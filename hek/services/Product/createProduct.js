const { Product } = require("../../models");
const response = require("../../utils/apiResponse");
const { imageUpload } = require("../../utils/upload");
const { formDataValidation, Schemas } = require("../../utils/validation/joi");

const createProduct = async (verifiedToken, req, res, next) => {
    imageUpload(req, res, async (err) => {
      if (err) {
        return res.status(500).json(response.validation(err.message, 500));
      }
  
      try {
        //formDataValidation validates req.body
        const error = await formDataValidation(Schemas.productSchema, req.body);
  
        if (error) {
          return res.status(400).json(response.validation(error));
        }
  
        const payload = req.body;
        payload.image = req.file.path;
        const product = new Product(payload);
        const newProduct = await product.save();
  
        return res.status(201).json(response.success("OK", newProduct, 201));
      } catch (error) {
        next(error);
      }
    });
  };


  module.exports =  createProduct;