const response = require("../../utils/apiResponse");
const { Store } = require("../../models");

const findOneStore = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const store = await Store.findOne({ slug: slug });
    if (!store) {
      return res.status(404).json(response.error("Store not found", 404));
    }
    return res.status(200).json(response.success("Ok", store, 200));
  } catch (error) {
    next(error.message);
  }
};

module.exports = {
  findOneStore,
};
