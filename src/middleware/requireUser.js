const AuthenticationError = require('../exceptions/AuthenticationError');

const requireUser = (req, res, next) => {
  if (!req.userId) {
    return next(new AuthenticationError('You have to login first'));
  }

  return next();
};

module.exports = requireUser;
