const { validationResult } = require("express-validator");
const Role = require("../../models/roleModel");

const addRole = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }

    const { role_name, value } = req.body;
    const role = new Role({
      role_name,
      value,
    });
    const roleData = await role.save();
    return res.status(200).json({
      success: true,
      msg: "Role created successfully",
      data: roleData,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getRoles = async (req, res) => {
  try {
    const Roles = await Role.find({
      value: {
        $ne: 1,
      },
    });
    return res.status(200).json({
      success: true,
      msg: "Roles Fetched Successfully!",
      data: Roles,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  addRole,
  getRoles,
};
