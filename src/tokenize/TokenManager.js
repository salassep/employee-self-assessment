const jwt = require('jsonwebtoken');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  generateToken: (payload, expiresIn) => jwt.sign(
    payload,
    process.env.JWT_KEY,
    { expiresIn },
  ),
  verifyJwtToken: (accessToken) => {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_KEY);
      return { payload: decoded };
    } catch (err) {
      throw new InvariantError('Token not valid');
    }
  },
};

module.exports = TokenManager;
