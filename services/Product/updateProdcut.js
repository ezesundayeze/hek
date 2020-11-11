const { Product } = require("../../models");
const response = require("../../utils/apiResponse");
const { imageUpload } = require("../../utils/upload");
const { formDataValidation, Schemas } = require("../../utils/validation/joi");

const updateProduct = async (verifiedToken, req, res, next) => {
  imageUpload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json(response.validation(err.message, 500));
    }

    try {
      // formDataValidation validates req.body
      const error = await formDataValidation(
        Schemas.editProductSchema,
        req.body
      );

      if (error) {
        console.log(error);
        return res.status(400).json(response.validation(error));
      }
      const params = req.params;
      const payload = req.body;

      const findProduct = await Product.findOne({
        slug: params.slug,
      }).populate("store");

      if (findProduct?.owner != verifiedToken._id) {
        return res.status(401).json(response.error("Unauthorized Access", 401));
      }

      if (payload?.images?.length == 0 || undefined) {
        const product = await Product.findOneAndUpdate(
          { slug: params.slug },
          { $set: payload },
          { new: true }
        );
        return res.status(200).json(response.success("OK", product, 200));
      }

      payload.images = req.files;
      const product = await Product.findOneAndUpdate(
        { slug: params.slug },
        { $set: payload },
        { new: true }
      );
      return res.status(200).json(response.success("OK", product, 200));
    } catch (error) {
      console.log(error);
      next(error);
    }
  });
};

module.exports = updateProduct;
