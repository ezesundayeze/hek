const joi = require("joi");
const response = require("../apiResponse");

const formDataValidation = async (schema, body) => {
  const result = await schema.validate(body, { abortEarly: false });
  if (result.error) {
    return result.error.details;
  }
};

const queryParamValidation = (schema) => {
  return (req, res, next) => {
    const result = schema.validate(req.query, { abortEarly: false });
    if (result.error) {
      return res.status(400).json(response.validation(result.error.details));
    }
    next();
  };
};

const paramValidation = (schema, name) => {
  return (req, res, next) => {
    const result = schema.validate(
      { param: req["params"][name] },
      { abortEarly: false }
    );
    if (result.error) {
      return res.status(400).json(response.validation(result.error.details));
    } else {
      if (!req.value) req.value = {};
      if (!req.value["params"]) req.value["params"] = {};
      req.value["params"][name] = result.value.param;
      next();
    }
  };
};

function bodyValidation(schema) {
  return (req, res, next) => {
    const result = schema.validate(req.body, { abortEarly: false });

    if (result.error) {
      return res.status(400).json(response.validation(result.error.details));
    } else {
      if (!req.value) req.value = {};
      if (!req.value["body"]) req.value["body"] = {};
      req.value["body"] = result.value;
      next();
    }
  };
}

const Schemas = {
  idSchema: joi.object().keys({
    param: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),

  productSearchSchema: joi.object().keys({
    title: joi.string(),
    priceStart: joi.string(),
    priceEnd: joi.string(),
    page: joi.number(),
    limit: joi.number(),
    productType: joi.string(),
    brand: joi.string(),
    quantity: joi.number(),
    category: joi.string(),
    size: joi.number(),
    store: joi.string(),
  }),

  productSchema: joi.object().keys({
    title: joi.string().required(),
    description: joi.string(),
    price: joi.number().required(),
    category: joi.string(),
    productType: joi.string().allow("retail", "wholesale").default("retail"),
    size: joi.string(),
    brand: joi.string(),
    quantity: joi.number().required(),
    store: joi.string(),
    images: joi.string(),
  }),

  storeSchema: joi.object().keys({
    name: joi.string(),
    address: joi.string(),
    country: joi.string(),
    city: joi.string(),
    image: joi.string(),
  }),

  categorySchema: joi.object().keys({
    title: joi.string(),
    description: joi.string(),
  }),
  couponSchema: joi.object().keys({
    code: joi.string(),
    value: joi.number(),
  }),

  reviewSchema: joi.object().keys({
    comment: joi.string(),
    rate: joi.number(),
    orderId: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),

  orderSchema: joi.object().keys({
    coupon: joi.string(),
    shipping: joi
      .object()
      .keys({
        name: joi.string().required(),
        address: joi.string().required(),
        country: joi.string().required(),
        state: joi.string().required(),
        postalCode: joi.string().required(),
      })
      .required(),
    products: joi
      .array()
      .items({
        id: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        quantity: joi.number(),
      })
      .required(),
  }),

  editStoreSchema: joi.object().keys({
    name: joi.string(),
    address: joi.string(),
    country: joi.string(),
    city: joi.string(),
    image: joi.string(),
  }),

  editProductSchema: joi.object().keys({
    title: joi.string(),
    description: joi.string(),
    price: joi.number(),
    category: joi.string(),
    productType: joi.string().allow("retail", "wholesale").default("retail"),
    size: joi.string(),
    brand: joi.string(),
    quantity: joi.number(),
    store: joi.string(),
    images: joi.string(),
  }),
  stringParammSchema: joi.object().keys({
    param: joi
      .string()
      .regex(/[a-zA-Z0-9.,?]*/)
      .required(),
  }),
  userSchema: joi.object().keys({
    firstName: joi.string().min(2).required(),
    lastName: joi.string().min(2).required(),
    phone: joi.string().min(7).max(15),
    email: joi.string().email().required(),
    role: joi.string().max(10).valid("buyer", "merchant"),
    bankName: joi.string(),
    accountName: joi.string(),
    accountNumber: joi.number(),
    password: joi
      .string()
      .required()
      .regex(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/
      )
      .messages({
        "string.pattern.base": "Invalid password",
      }),
    status: joi.string().valid(...["active", "inactive"]),
  }),

  updateUserSchema: joi.object().keys({
    firstName: joi.string().min(2),
    lastName: joi.string().min(2),
    phone: joi.string().min(7).max(15),
    email: joi.string().email(),
    role: joi.string().max(10).valid("buyer", "merchant"),
    bankName: joi.string(),
    accountName: joi.string(),
    accountNumber: joi.number(),
    password: joi
      .string()
      .regex(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/
      )
      .messages({
        "string.pattern.base": "Invalid password",
      }),
    status: joi.string().valid(...["active", "inactive"]),
  }),
  withdrawal: joi.object().keys({
    amount: joi.number().required(),
  }),
  forgotPasswordSchema: joi.object().keys({
    email: joi.string().email(),
  }),
  verifyPasswordTokenSchema: joi.object().keys({
    passwordToken: joi.string().length(6),
  }),
  newPasswordSchema: joi.object().keys({
    passwordToken: joi.string().length(6),
    password: joi
      .string()
      .regex(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/
      )
      .required(),
  }),
  loginSchema: joi.object().keys({
    email: joi.string().email().required(),
    password: joi
      .string()
      .regex(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/
      )
      .required(),
  }),
  createDisputeSchema: joi.object().keys({
    title: joi.string().required(),
    complain: joi.string().required(),
    transactionId: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
  updateDisputeSchema: joi.object().keys({
    status: joi.string().required(),
  }),

  editUserSchema: joi.object().keys({
    firstName: joi.string().min(5),
    lastName: joi.string().min(5),
    phone: joi.string().min(7).max(15),
    email: joi.string().email(),
    role: joi.string().max(10).valid("buyer", "merchant"),
    password: joi
      .string()
      .regex(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/
      ),
    status: joi.string(),
  }),

  paystackPaymentShema: joi.object().keys({
    email: joi.string().email(),
    amount: joi.number(),
    transactionId: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),

  createInvoiceSchema: joi.object().keys({
    merchant: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    buyer: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    transactionId: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    date: joi.string(),
    status: joi.string(),
    amountPaid: joi.number(),
    balance: joi.number(),
    reason: joi.string(),
    total: joi.number(),
  }),

  queryParamSchema: (parameters) => {
    let obj = {};
    parameters.forEach((param) => {
      obj[param] = joi.string().regex(/[a-zA-Z0-9]/);
    });
    return joi.object().keys(obj);
  },
};

module.exports = {
  paramValidation,
  bodyValidation,
  Schemas,
  formDataValidation,
  queryParamValidation,
};
