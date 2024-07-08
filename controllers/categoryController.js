const { validationResult } = require("express-validator");
const Categories = require("../models/categoriesModel");

const addCategories = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }

    const { category_name } = req.body;

    const isExists = await Categories.findOne({
      name: {
        $regex: category_name,
        $options: "i",
      },
    });

    if (isExists) {
      return res.status(400).json({
        success: false,
        msg: "Category name already exist",
      });
    }

    const catagory = new Categories({
      name: category_name,
    });

    const categoryData = await catagory.save();

    return res.status(200).json({
      success: true,
      msg: "Categories Added Successfuly",
      data: categoryData,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getCategories = async (req, res) => {
  try {
    const Categoriess = await Categories.find({});
    return res.status(200).json({
      success: true,
      msg: "Categoriess Fetched Successfully!",
      data: Categoriess,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteCategories = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }
    const { id } = req.body;
    const categoryData = await Categories.findOne({ _id: id });

    if (!categoryData) {
      return res.status(400).json({
        success: false,
        msg: "Categoriess ID doesn not exists",
      });
    }

    await Categories.findByIdAndDelete({ _id: id });
    return res.status(200).json({
      success: true,
      msg: "Categoriess Deleted Successfully!",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateCategories = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }

    const { id, category_name } = req.body;

    const categoryData = await Categories.findOne({ _id: id });

    if (!categoryData)
      return res.status(400).json({
        success: false,
        msg: "Categories ID not found",
      });

    const isExists = await Categories.findOne({
      _id: { $ne: id },
      name: {
        $regex: category_name,
        $options: "i",
      },
    });

    if (isExists) {
      return res.status(400).json({
        success: false,
        msg: "Categories Name Already Assigned on another",
      });
    }

    const updatedData = await Categories.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          name: category_name,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "Categories Updated Successfuly",
      data: updatedData,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  addCategories,
  getCategories,
  deleteCategories,
  updateCategories,
};
