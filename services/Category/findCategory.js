const response = require("../../utils/apiResponse");
const { Category } = require("../../models");

const findOneCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug: slug });
    if (!category) {
      return res.status(404).json(response.error("Category not found", 404));
    }
    return res.status(200).json(response.success("Ok", category, 200));
  } catch (error) {
    next(error.message);
  }
};

module.exports = findOneCategory;
