const { User, Wallet } = require("../../models");
const response = require("../../utils/apiResponse");
const sendEmail = require("../../utils/emailer");
const { encryptPassword, genToken } = require("../../utils/helper");

const signUp = async (req, res, next) => {
  try {
    const { body } = req;
    const { email } = req.body;

    // Checks if user already exist in the database
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(401)
        .json(
          response.error(
            "User already exist, please login or use forget password",
            401
          )
        );
    }

    // Perform the hashing of the password and saving the new user
    const newuser = new User(body);
    const { password } = newuser;
    const hashedPassword = await encryptPassword(password);
    newuser.password = hashedPassword;
    const data = await newuser.save();

    //Create wallet
    const wallet = new Wallet({
      balance: 0,
      currencyCode: "NGN",
      user: data._id,
    });

    await wallet.save();

    // Send welcome email
    sendEmail(
      data.email,
      "Welcome to Hek!",
      { name: data.firstName },
      "./templates/email/welcome.handlebars"
    );

    const payload = { ...data._doc };
    delete payload.password;
    //Generate token to log user in
    const token = await genToken(data._id, data.role);
    return res.status(201).json(
      response.success(
        null,
        {
          token,
          ...payload,
        },
        201
      )
    );
  } catch (error) {
    next(error);
  }
};

const socialSignUp = async (req, res, next) => {};

module.exports = {
  signUp,
  socialSignUp,
};
