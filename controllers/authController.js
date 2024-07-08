require("dotenv").config();
const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const Permission = require("../models/permissionModel");
const UserPermission = require("../models/userPermissionModel");
const helper = require("../helpers/helper");

const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) return res.status(400).send("User already exists");

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    const userData = await newUser.save();

    //assign default permissions
    const defaultPermissions = await Permission.find({
      is_default: 1,
    });

    if (defaultPermissions.length > 0) {
      const permissionArray = [];
      defaultPermissions.forEach((permission) => {
        permissionArray.push({
          permission_name: permission.permission_name,
          permission_value: [0, 1, 2, 3],
        });
      });

      const userPermission = new UserPermission({
        user_id: userData._id,
        permissions: permissionArray,
      });

      await userPermission.save();
    }

    return res.status(200).json({
      success: true,
      msg: "User created",
      data: userData,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const generateAccessToken = async (payload, expiresInAccess) => {
  try {
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: expiresInAccess,
    });

    const decoded = jwt.decode(accessToken);
    const exp = decoded ? decoded.exp : null;

    return { accessToken, exp };
  } catch (error) {
    console.error("Error generating access token:", error);
    throw error;
  }
};

const generateRefreshToken = async (payload, expiresInRefresh) => {
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: expiresInRefresh,
  });
  return token;
};

const generateAccessAndRefreshToken = async (
  payload,
  expiresInAccess,
  expiresInRefresh
) => {
  try {
    const user = await User.findById(payload.userData._id);

    const { accessToken, exp } = await generateAccessToken(
      payload,
      expiresInAccess
    );
    const refreshToken = await generateRefreshToken(payload, expiresInRefresh);

    user.refresh_token = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, exp, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(200).json({
        success: false,
        msg: "Email & password is Incorrect!",
      });
    }

    if (!bcrypt.compareSync(password, userData.password)) {
      return res.status(401).json({
        success: false,
        msg: "Email & password is Incorrect!",
      });
    }

    const payload = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };

    const { accessToken, exp, refreshToken } =
      await generateAccessAndRefreshToken(
        {
          userData: payload,
        },
        "2d",
        "5m"
      );

    // get userdata  with all permissions
    const result = await User.aggregate([
      {
        $match: { email: userData.email },
      },
      {
        $lookup: {
          from: "userpermissions",
          localField: "_id",
          foreignField: "user_id",
          as: "permissions",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
          permissions: {
            $cond: {
              if: {
                $isArray: "$permissions",
              },
              then: { $arrayElemAt: ["$permissions", 0] },
              else: null,
            },
          },
        },
      },
      {
        $addFields: {
          permissions: {
            permissions: "$permissions.permissions",
          },
        },
      },
    ]);
    return res.status(200).json({
      success: true,
      msg: "Login Successfully!",
      data: result[0],
      accessToken: accessToken,
      backend_exp: exp,
      refreshToken: refreshToken,
      tokenType: "Bearer",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.headers["authorization"];

    if (!incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        msg: "token is required  for  Authentication",
      });
    }

    const bearer = incomingRefreshToken.split(" ");
    const bearerRefreshToken = bearer[1];
    const decodedRefreshToken = jwt.verify(
      bearerRefreshToken,
      process.env.SECRET_KEY
    );

    const user = await User.findById(decodedRefreshToken?.userData?._id);

    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Invalid Refresh Token",
      });
    }

    if (bearerRefreshToken !== user?.refresh_token) {
      return res.status(401).json({
        success: false,
        msg: "Refresh Tokenm is Expired or Used",
      });
    }

    // get userdata  with all permissions
    const result = await User.aggregate([
      {
        $match: { email: user.email },
      },
      {
        $lookup: {
          from: "userpermissions",
          localField: "_id",
          foreignField: "user_id",
          as: "permissions",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
          permissions: {
            $cond: {
              if: {
                $isArray: "$permissions",
              },
              then: { $arrayElemAt: ["$permissions", 0] },
              else: null,
            },
          },
        },
      },
      {
        $addFields: {
          permissions: {
            permissions: "$permissions.permissions",
          },
        },
      },
    ]);

    const options = {
      httpOnly: true,
      secure: true,
    };

    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const { accessToken, exp, refreshToken } =
      await generateAccessAndRefreshToken(
        {
          userData: payload,
        },
        "10m",
        "1m"
      );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        msg: "Login refreshed",
        data: result[0],
        accessToken: accessToken,
        backend_exp: exp,
        refreshToken: refreshToken,
        tokenType: "Bearer",
      });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user_id = req.user.userData._id;
    const userData = await User.findOne({ _id: user_id });
    return res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const getUserPermissions = async (req, res) => {
  try {
    const user_id = req.user.userData._id;
    const UserPermissions = await helper.getUserPermissions(user_id);

    return res.status(200).json({
      success: true,
      msg: "User Permissions",
      user: UserPermissions,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  getProfile,
  getUserPermissions,
};
