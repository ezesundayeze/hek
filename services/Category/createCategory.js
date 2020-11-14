const { Category } = require("../../models");
const response = require("../../utils/apiResponse");

const createCategory = async (verifiedToken, req, res, next) => {
  try {
    const payload = req.body;
    const category = new Category(payload);
    const newCategory = await category.save();
    return res.status(201).json(response.success("OK", newCategory, 201));
  } catch (error) {
    next(error);
  }
};

module.exports = createCategory;
