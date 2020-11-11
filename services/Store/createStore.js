const { Store } = require("../../models");
const response = require("../../utils/apiResponse");
const { singleUpload } = require("../../utils/upload");
const { formDataValidation, Schemas } = require("../../utils/validation/joi");

const createStore = async (verifiedToken, req, res, next) => {
  singleUpload(req, res, async (err) => {
    if (err) {
      return res.status(500).json(response.validation(err.message, 500));
    }

    try {
      // formDataValidation validates req.body
      const error = await formDataValidation(Schemas.storeSchema, req.body);

      if (error) {
        return res.status(400).json(response.validation(error));
      }

      const payload = req.body;
      payload.owner = verifiedToken._id;
      payload.image = req.file.path;
      const store = new Store(payload);
      const newStore = await store.save();

      return res.status(201).json(response.success("OK", newStore, 201));
    } catch (error) {
      console.log(error);
      next(error);
    }
  });
};

module.exports = createStore;
