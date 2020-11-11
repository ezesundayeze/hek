const { Store } = require("../../models");
const response = require("../../utils/apiResponse");
const { singleUpload } = require("../../utils/upload");
const { formDataValidation, Schemas } = require("../../utils/validation/joi");

const updateStore = async (verifiedToken, req, res, next) => {
  singleUpload(req, res, async (err) => {
    if (err) {
      return res.status(500).json(response.validation(err.message, 500));
    }

    try {
      // formDataValidation validates req.body
      const error = await formDataValidation(Schemas.editStoreSchema, req.body);

      if (error) {
        return res.status(400).json(response.validation(error));
      }

      const params = req.params;
      const payload = req.body;

      const findStore = await Store.findOne({ slug: params.slug });
      if (findStore?.owner != verifiedToken._id) {
        return res.status(401).json(response.error("Unauthorized Access", 401));
      }

      if (!payload.image) {
        const store = await Store.findOneAndUpdate(
          { slug: params.slug },
          { $set: payload },
          { new: true }
        );
        return res.status(200).json(response.success("OK", store, 200));
      }

      payload.image = req.file.path;
      const newStore = await Store.findOneAndUpdate(
        { slug: params.slug },
        { $set: payload },
        { new: true }
      );

      return res.status(201).json(response.success("OK", newStore, 201));
    } catch (error) {
      console.log(error);
      next(error);
    }
  });
};

module.exports = updateStore;
