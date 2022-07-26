const UserRoleServices = require('../services/UserRoleServices');
const ClientError = require('../exceptions/ClientError');
const autoBind = require('auto-bind');

class UserRoleControllers {
  constructor() {
    this._service = new UserRoleServices();
    autoBind(this);
  }

  async addRoleToUser(req, res) {
    const result = await this._service.createUserRole(req.params.userId, req.params.roleId);

    if (result instanceof ClientError) {
      return res.status(result.statusCode).send({
        message: result.message
      });
    }

    return res.status(201).send({
      status: "OK", 
      data: result
    });
  }

  async getRoles(req, res) {
    const result = await this._service.getRoles();

    return res.status(201).send({
      status: "OK", 
      data: result
    });
  }

  async deleteUserRole(req, res) {
    const result = await this._service.deleteUserRole(req.params.userId, req.params.roleId);

    if (result instanceof ClientError) {
      return res.status(result.statusCode).send({
        message: result.message
      });
    }

    return res.status(201).send({
      status: "OK", 
      data: result
    });
  }
};

module.exports = UserRoleControllers;
