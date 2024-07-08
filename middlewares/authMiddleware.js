require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res.status(403).json({
      success: false,
      msg: "token is required  for  Authentication",
    });
  }

  try {
    const bearer = token.split(" ");
    const bearerToken = bearer[1];
    // console.log(bearerToken)
    const decodedData = jwt.verify(bearerToken, process.env.SECRET_KEY);

    // console.log(decodedData)
    req.user = decodedData;
  } catch (error) {
    return res.status(400).json({
      code: 400,
      success: false,
      msg: "Invalid Token",
    });
  }
  return next();
};

module.exports = verifyToken;
