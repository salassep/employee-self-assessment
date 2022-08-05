const autoBind = require('auto-bind');
const AuthenticationServices = require('../services/db/AuthenticationServices');
const AuthorizationError = require('../exceptions/AuthorizationError');
const tokenManager = require('../tokenize/TokenManager');
const UserRoleServices = require('../services/db/UserRoleServices');

class AuthenticationControllers {
  constructor() {
    this._service = new AuthenticationServices();
    this._userRoleService = new UserRoleServices();
    autoBind(this);
  }

  async signIn(req, res, next) {
    const { body } = req;
    const authData = { email: body.email, password: body.password };

    try {
      const result = await this._service.signIn(authData);

      const accessToken = tokenManager.generateToken({ id: result.userId }, '5m');
      const refreshToken = tokenManager.generateToken({ id: result.userId }, '30d');

      res.cookie('accessToken', accessToken, {
        maxAge: 300000,
        httpOnly: true,
      });

      res.cookie('refreshToken', refreshToken, {
        maxAge: 2.628e9,
        httpOnly: true,
      });

      const userRole = await this._userRoleService.getUserRoles(result.userId);

      return res.status(201).send({
        status: 'OK',
        userId: result.userId,
        roleId: userRole[0].roleId,
        msg: 'Sign in success',
      });
    } catch (err) {
      return next(err);
    }
  }

  async getLogs(req, res, next) {
    try {
      const isAdmin = await this._service.verifyAccess(req.userId, 1);

      if (!isAdmin) {
        throw new AuthorizationError('You don\'t have an access');
      }

      const result = await this._service.getLogs();

      return res.status(201).send({
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async changePassword(req, res, next) {
    const { body } = req;
    const authData = {
      userId: req.userId,
      newPass: body.newPass,
      oldPass: body.oldPass,
    };

    try {
      const result = await this._service.changePassword(authData);

      return res.status(201).send({
        status: 'OK',
        userId: authData.userId,
        data: result,
        msg: 'Change Password Success',
      });
    } catch (err) {
      return next(err);
    }
  }

  async logOut(req, res) {
    res.cookie('accessToken', '', {
      maxAge: 0,
      httpOnly: true,
    });
    res.cookie('refreshToken', '', {
      maxAge: 0,
      httpOnly: true,
    });
    return res.status(201).send({ status: 'OK' });
  }
}

module.exports = AuthenticationControllers;
