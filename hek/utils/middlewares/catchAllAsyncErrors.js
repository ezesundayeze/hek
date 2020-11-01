const catchAllAsyncErrors = (callback) => {
  return async (verifyToken, req, res, next) => {
    try {
      await callback(verifyToken, req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  catchAllAsyncErrors,
};
