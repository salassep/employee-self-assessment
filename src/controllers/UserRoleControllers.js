const autoBind = require('auto-bind');
const UserRoleServices = require('../services/db/UserRoleServices');
const AuthenticationServices = require('../services/db/AuthenticationServices');
const AuthorizationError = require('../exceptions/AuthorizationError');

class UserRoleControllers {
  constructor() {
    this._service = new UserRoleServices();
    this._authenticationServices = new AuthenticationServices();
    autoBind(this);
  }

  async addRoleToUser(req, res, next) {
    try {
      const isAdmin = await this._authenticationServices.verifyAccess(req.userId, 1);

      if (!isAdmin) {
        throw new AuthorizationError('You don\'t have an access');
      }

      const result = await this._service.createUserRole(req.params.userId, req.params.roleId);

      return res.status(201).send({
        statusCode: 201,
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async getRoles(req, res) {
    const result = await this._service.getRoles();

    return res.status(201).send({
      statusCode: 201,
      status: 'OK',
      data: result,
    });
  }

  async updateUserRole(req, res, next) {
    try {
      const isAdmin = await this._authenticationServices.verifyAccess(req.userId, 1);

      if (!isAdmin) {
        throw new AuthorizationError('You don\'t have an access');
      }

      const result = await this._service.updateUserRole(req.params.userRoleId, req.body.roleId);

      return res.status(201).send({
        statusCode: 201,
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async deleteUserRole(req, res, next) {
    try {
      const isAdmin = await this._authenticationServices.verifyAccess(req.userId, 1);

      if (!isAdmin) {
        throw new AuthorizationError('You don\'t have an access');
      }

      const result = await this._service.deleteUserRole(req.params.userId, req.params.roleId);

      return res.status(201).send({
        statusCode: 201,
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = UserRoleControllers;
