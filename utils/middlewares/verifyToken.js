const jwt = require("jsonwebtoken");
const response = require("../apiResponse");
const { secret } = require("../config");

const verifyToken = async (req, res, next) => {
  let token;

  const tokenWithBearer = req.header("Authorization");
  if (tokenWithBearer) {
    token = tokenWithBearer.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json(response.error(`please login to perform this action`, 401));
  }

  try {
    const verifiedToken = jwt.verify(token, secret);

    if (!verifiedToken._id || !verifiedToken.role) {
      return res
        .status(401)
        .json(
          response.error(
            "Invalid Token, please login to perform this action",
            401
          )
        );
    }

    next(verifiedToken);
  } catch (error) {
    return res
      .status(401)
      .json(
        response.error(`${error}, please login to perform this action`, 401)
      );
  }
};

module.exports = {
  verifyToken,
};
