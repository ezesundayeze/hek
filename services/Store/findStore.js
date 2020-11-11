const response = require("../../utils/apiResponse");
const { Store } = require("../../models");

const findOne = async (req, res, next) => {
  try {
    const { slug } = req.param;
    const store = Store.findOne({ slug: slug });
    return res.status(200).json(response.success("Ok", store, 200));
  } catch (error) {
    next(error.message);
  }
};

module.exports = {
  findOne,
};
