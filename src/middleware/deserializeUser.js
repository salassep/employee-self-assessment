const tokenManager = require('../tokenize/TokenManager');

const deserializeUser = (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;
  try {
    if (!accessToken && !refreshToken) {
      return next();
    }
    const { payload } = tokenManager.verifyJwtToken(accessToken);
    if (payload) {
      req.userId = payload.id;
      return next();
    }
  } catch (err) {
    const { payload } = tokenManager.verifyJwtToken(refreshToken);
    if (payload) {
      const newAccessToken = tokenManager.generateToken({ id: payload.id }, '5m');

      res.cookie('accessToken', newAccessToken, {
        maxAge: 300000,
        httpOnly: true,
      });

      req.userId = payload.id;
      return next();
    }

    return next();
  }

  return next();
};

module.exports = deserializeUser;
