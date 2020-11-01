const response = require("../apiResponse");

const checkRole = (role) => {
  return (verifiedToken, req, res, next) => {
    try {
      if (!role.includes(verifiedToken.role)) {
        return res
          .status(401)
          .json(
            response.error(
              `You are not authorized to perform this action, please contact Admin`,
              401
            )
          );
      }

      return next(verifiedToken);
    } catch (error) {
      return res
        .status(401)
        .json(
          response.error(
            `${error}, Something happened please contact the Admin`,
            401
          )
        );
    }
  };
};

module.exports = {
  checkRole,
};
