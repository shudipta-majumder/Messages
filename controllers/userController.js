const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const randomString = require("randomstring");
const { sendMail } = require("../helpers/mailer");
const mongoose = require("mongoose");
const Permission = require("../models/permissionModel");
const UserPermission = require("../models/userPermissionModel");

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }

    const { name, email, username, gender } = req.body;

    const isExists = await User.findOne({
      email,
    });
    if (isExists) {
      return res.status(400).json({
        success: false,
        msg: "Email Already Exists",
      });
    }

    const password = randomString.generate(6);
    const hashedPassword = await bcrypt.hash(password, 10);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    var obj = {
      name,
      email,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    };
    
    if (req.body.role && req.body.role == 1) {
      return res.status(400).json({
        success: false,
        msg: "You can not create admin",
      });
    } else if (req.body.role) {
      obj.role = req.body.role;
    }
    const user = new User(obj);

    const userData = await user.save();

    //add permission to user if coming in request
    if (req.body.permissions != undefined && req.body.permissions.length > 0) {
      const addPermissions = req.body.permissions;
      const permissionArray = [];
      await Promise.all(
        addPermissions.map(async (permission) => {
          const permissionData = await Permission.findOne({
            _id: permission.id,
          });
          permissionArray.push({
            permission_name: permissionData.permission_name,
            permission_value: permission.value,
          });
        })
      );

      const userPermission = new UserPermission({
        user_id: userData._id,
        permissions: permissionArray,
      });
      await userPermission.save();
    }

    const content =
      `
     <p>Dear <b>` +
      userData.name +
      `</b> Your account is created, bellow is  your  Credentials</p>
     <b>Name:</b>  ` +
      userData.name +
      `
     <b>Email: </b> ` +
      userData.email +
      `
     <b>Password: </b> ` +
      password +
      `
      <p>Now You Can Login your Account in Our <a href="http://192.168.16.124:7000/api/login">Application</a>, Thanks.....</p>
    `;
    sendMail(userData.email, "Account Created", content);
    return res.status(200).json({
      success: true,
      msg: "User Created Successfuly",
      data: userData,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getUser = async (req, res) => {
  try {
    // get userdata  with all permissions
    const users = await User.aggregate([
      {
        $match: {
          _id: {
            $ne: new mongoose.Types.ObjectId(req.user.userData._id),
          },
        },
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
      msg: "Posts Fetched Successfully!",
      data: users,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }

    const { id, name, username, gender } = req.body;

    const isExists = await User.findOne({
      _id: id,
    });
    if (!isExists) {
      return res.status(400).json({
        success: false,
        msg: "User not Exists",
      });
    }

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    var updateObj = {
      name,
      username,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    };

    if (req.body.role != undefined) {
      updateObj.role = req.body.role;
    }

    const updatedData = await User.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: updateObj,
      },
      { new: true }
    );
    //add permission to user if coming in request otherwise update
    if (req.body.permissions != undefined && req.body.permissions.length > 0) {
      const addPermissions = req.body.permissions;
      const permissionArray = [];
      await Promise.all(
        addPermissions.map(async (permission) => {
          const permissionData = await Permission.findOne({
            _id: permission.id,
          });
          permissionArray.push({
            permission_name: permissionData.permission_name,
            permission_value: permission.value,
          });
        })
      );

      await UserPermission.findOneAndUpdate(
        {
          user_id: updatedData._id,
        },
        {
          permissions: permissionArray,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    return res.status(200).json({
      success: true,
      msg: "User Updated Successfuly",
      data: updatedData,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const delateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }

    const { id } = req.body;

    const isExists = await User.findOne({
      _id: id,
    });
    if (!isExists) {
      return res.status(400).json({
        success: false,
        msg: "User not Exists",
      });
    }

    const updatedData = await User.findByIdAndDelete(
      {
        _id: id,
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      msg: "User Deleted Successfuly",
      data: updatedData,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  delateUser,
};
