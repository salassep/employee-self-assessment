const UserServices = require('../services/UserServices');
const ClientError = require('../exceptions/ClientError');
const autoBind = require('auto-bind');

class UserControllers {
  constructor() {
    this._service = new UserServices();
    autoBind(this);
  }

  async createUser(req, res) {
    const { body } = req;

    const newUser = {
      email: body.email,
      password: body.password,
      name: body.name,
      workDate: body.workDate,
      position: body.position,
      roleId: body.roleId
    };

    const result = await this._service.createUser(newUser);

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

  async getAllUsers(req, res) {
    const result = await this._service.getAllUsers();

    return res.status(201).send({
      status: "OK", 
      data: result
    });
  }

  async getUserById(req, res) {
    const result = await this._service.getUserById(req.params.id);

    return res.status(201).send({
      status: "OK", 
      data: result
    });
  }

  async updateUser(req, res) {
    const { params, body } = req;

    const newData = {
      email: body.email,
      password: body.password,
      name: body.name,
      workDate: body.workDate,
      position: body.position,
      roleId: body.roleId
    };

    const result = await this._service.updateUser(params.id, newData);

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

  async deleteUser(req, res) {
    const result = await this._service.deleteUser(req.params.id);

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
}
                                                                                                                                                                                                                                                                                  

module.exports = UserControllers;