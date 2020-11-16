const express = require("express");
const router = express.Router();
const {
  signUp,
  signIn,
  updateUser,
  resetPasswordRequest,
  newPassword,
  verifyPasswordToken,
} = require("../services/User");

const {
  bodyValidation,
  paramValidation,
  Schemas,
  queryParamValidation,
} = require("../utils/validation/joi");

const { verifyToken } = require("../utils/middlewares");
const { verifyUser } = require("../services/User/signIn");
const findOneUser = require("../services/User/findOneUser");
const createProduct = require("../services/Product/createProduct");
const { searchProducts } = require("../services/Product/findproduct");
const updateProduct = require("../services/Product/updateProdcut");
const createStore = require("../services/Store/createStore");
const updateStore = require("../services/Store/updateStore");
const { findOneStore } = require("../services/Store/findStore");
const { initializePayment, webhook } = require("../services/Payment/paystack");
const createOrder = require("../services/Order/createOrder");
const findOneOrder = require("../services/Order/findOrder");
const createCategory = require("../services/Category/createCategory");
const findOneCategory = require("../services/Category/findCategory");
const addReview = require("../services/Review/review");
const createCoupon = require("../services/Dicount");

const baseURL = "/api/v1";

/*
  This route should create a new user with usernamen and password
*/

router.post(
  `${baseURL}/user/signup`,
  bodyValidation(Schemas.userSchema),
  signUp
);

/*
Sign in with Username and password
*/
router.post(
  `${baseURL}/user/signin`,
  bodyValidation(Schemas.loginSchema),
  signIn
);

/*
 * Allow users to reset their password
 */
router.post(
  `${baseURL}/user/reset/password`,
  bodyValidation(Schemas.forgotPasswordSchema),
  resetPasswordRequest
);

/*
 * very a users attempt to change password
 */
router.post(
  `${baseURL}/user/reset/verifyPasswordToken`,
  bodyValidation(Schemas.verifyPasswordTokenSchema),
  verifyPasswordToken
);

/*
 * this returns a user profile information
 */
router.get(`${baseURL}/user/profile`, verifyToken, findOneUser);

/*
 * Update a user
 */
router.put(
  `${baseURL}/user/update`,
  bodyValidation(Schemas.updateUserSchema),
  verifyToken,
  updateUser
);

/*
 * verify a user
 */
router.get(`${baseURL}/user/verify`, verifyToken, verifyUser);

/*
 * Create a new password
 */
router.post(
  `${baseURL}/user/reset/newpassword`,
  bodyValidation(Schemas.newPasswordSchema),
  newPassword
);

/*
 * Create a new product
 */
router.post(`${baseURL}/product/create`, verifyToken, createProduct);

/*
 * Search products
 */

router.get(
  `${baseURL}/product/search`,
  queryParamValidation(Schemas.productSearchSchema),
  searchProducts
);

router.put(`${baseURL}/product/update/:slug`, verifyToken, updateProduct);

/*
 * Create a new store
 */
router.post(`${baseURL}/store/create`, verifyToken, createStore);

/*
 * Update store
 */
router.put(`${baseURL}/store/update/:slug`, verifyToken, updateStore);

/*
 * Update store
 */
router.get(`${baseURL}/store/retrieve/:slug`, findOneStore);

/*
 * Generate transaction payment link
 */

router.post(
  `${baseURL}/order/create`,
  bodyValidation(Schemas.orderSchema),
  verifyToken,
  createOrder
);

router.get(
  `${baseURL}/order/retrieve/:id`,
  paramValidation(Schemas.idSchema, "id"),
  findOneOrder
);

/*
 * Create Category
 */

router.post(
  `${baseURL}/category/create`,
  bodyValidation(Schemas.categorySchema),
  verifyToken,
  createCategory
);

router.post(
  `${baseURL}/product/review/:productId`,
  paramValidation(Schemas.idSchema, "productId"),
  bodyValidation(Schemas.reviewSchema),
  verifyToken,
  addReview
);

router.post(
  `${baseURL}/product/coupon/:productId`,
  paramValidation(Schemas.idSchema, "productId"),
  bodyValidation(Schemas.couponSchema),
  verifyToken,
  createCoupon
);

router.get(`${baseURL}/category/retrieve/:slug`, findOneCategory);

router.post(`${baseURL}/paystack/webhook`, webhook);

module.exports = router;
