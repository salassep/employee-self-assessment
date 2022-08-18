const autoBind = require('auto-bind');
const UserServices = require('../services/db/UserServices');
const AssessmentServices = require('../services/db/AssessmentServices');
const AuthenticationServices = require('../services/db/AuthenticationServices');
const AuthorizationError = require('../exceptions/AuthorizationError');

class UserControllers {
  constructor() {
    this._service = new UserServices();
    this._assessmentServices = new AssessmentServices();
    this._authenticationServices = new AuthenticationServices();
    autoBind(this);
  }

  async createUser(req, res, next) {
    const { body } = req;
    const newUser = {
      email: body.email,
      password: body.password,
      name: body.name,
      workDate: body.workDate,
      position: body.position,
      roleId: body.roleId,
    };

    try {
      const isAdmin = await this._authenticationServices.verifyAccess(req.userId, 1);

      if (!isAdmin) {
        throw new AuthorizationError('You don\'t have an access');
      }

      const result = await this._service.createUser(newUser);
      return res.status(201).send({
        statusCode: 201,
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async getAllUsers(req, res) {
    const result = await this._service.getAllUsers();

    return res.status(201).send({
      statusCode: 201,
      status: 'OK',
      data: result,
    });
  }

  async getUserId(req, res) {
    return res.status(201).send({
      statusCode: 201,
      status: 'OK',
      data: req.userId,
    });
  }

  async getUsersByRole(req, res, next) {
    try {
      const isEmployee = await this._authenticationServices.verifyAccess(req.userId, 3);

      if (isEmployee) {
        throw new AuthorizationError('You don\'t have an access');
      }

      const result = await this._service.getUsersByRole(req.params.roleName);

      return res.status(201).send({
        statusCode: 201,
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async getUserById(req, res, next) {
    try {
      const result = await this._service.getUserById(req.params.id);

      return res.status(201).send({
        statusCode: 201,
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async updateUser(req, res, next) {
    const { params, body } = req;
    const newData = {
      email: body.email,
      name: body.name,
      workDate: body.workDate,
      position: body.position,
    };

    try {
      let result = {};
      const isAdmin = await this._authenticationServices.verifyAccess(req.userId, 1);

      if (params.id === req.userId || isAdmin) {
        result = await this._service.updateUser(params.id, newData);
      } else {
        throw new AuthorizationError('You don\'t have an access');
      }

      return res.status(201).send({
        statusCode: 201,
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const isAdmin = await this._authenticationServices.verifyAccess(req.userId, 1);

      if (!isAdmin) {
        throw new AuthorizationError('You don\'t have an access');
      }

      const result = await this._service.deleteUser(req.params.id);

      await this._assessmentServices.deleteEmployeeAssessments(req.params.id);

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

module.exports = UserControllers;
