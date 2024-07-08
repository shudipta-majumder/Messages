const onlyAdminAccess = async (req, res, next) => {
  try {
    if (req.user.userData.role != 1) {
      return res.status(400).json({
        success: false,
        msg: "You have no permission to access this route",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "Something went wrong",
    });
  }
  return next();
};

module.exports = { onlyAdminAccess };
