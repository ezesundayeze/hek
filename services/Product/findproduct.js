const response = require("../../utils/apiResponse");
const { Product } = require("../../models");

const findOne = async (req, res, next) => {
  try {
    const id = req.param;
    const product = Product.findById({ _id: id });
    return res.status(200).json(response.success("Ok", product, 200));
  } catch (error) {
    next(error.message);
  }
};

const searchProducts = async (req, res, next) => {
  try {
    let {
      page,
      limit,
      title,
      brand,
      category,
      size,
      store,
      productType,
      quantity,
      priceStart,
      priceEnd,
    } = req.query;

    let parameters = {
      priceStart,
      priceEnd,
      title,
      page,
      limit,
      productType,
      brand,
      quantity,
      category,
      size,
      store,
    };

    let searchParamValues = Object.entries(parameters).filter(Boolean);

    let match = { price: { $gt: priceStart, $lt: priceEnd } };

    searchParamValues.forEach(([key, value]) => {
      if (value) {
        match[key] = { $regex: value, $options: "i" };
      }
    });

    delete match.priceStart;
    delete match.priceEnd;

    const product = await Product.aggregate([{ $match: match }]);

    return res.status(200).json(response.success("Ok", product, 200));
  } catch (error) {
    console.log(error);
    next(error.message);
  }
};

module.exports = {
  findOne,
  searchProducts,
};
