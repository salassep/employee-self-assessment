const autoBind = require('auto-bind');
const CriteriaServices = require('../services/db/CriteriaServices');
const AuthenticationServices = require('../services/db/AuthenticationServices');
const AuthorizationError = require('../exceptions/AuthorizationError');

class CriteriaController {
  constructor() {
    this._service = new CriteriaServices();
    this._authentificationService = new AuthenticationServices();
    autoBind(this);
  }

  async createCriteria(req, res, next) {
    try {
      const [isAdmin, isHr] = await Promise.all([
        this._authentificationService.verifyAccess(req.userId, 1),
        this._authentificationService.verifyAccess(req.userId, 2),
      ]);
      const newData = {
        name: req.body.name,
        description: req.body.description,
        position: req.body.position,
      };
      let result = {};

      if (isAdmin || isHr) {
        result = await this._service.createCriteria(newData);
      } else {
        throw new AuthorizationError('You don\'t have an access');
      }

      return res.status(201).send({
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async getAllCriteria(req, res) {
    const result = await this._service.getAllCriteria();

    res.status(201).send({
      status: 'OK',
      data: result,
    });
  }

  async getCriterionById(req, res, next) {
    try {
      const result = await this._service.getCriterionById(req.params.criterionId);

      return res.status(201).send({
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async updateCriteria(req, res, next) {
    try {
      const { params, body } = req;
      const isEmployee = await this._authentificationService.verifyAccess(req.userId, 3);
      const newData = {
        criterionId: params.criterionId,
        name: body.name,
        description: body.description,
        position: body.position,
      };

      if (isEmployee) {
        throw new AuthorizationError('You don\'t have an access');
      }

      const result = await this._service.updateCriteria(newData);

      return res.status(201).send({
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async deleteCriteria(req, res, next) {
    try {
      const isEmployee = await this._authentificationService.verifyAccess(req.userId, 3);

      if (isEmployee) {
        throw new AuthorizationError('You don\'t have an access');
      }

      const result = await this._service.deleteCriteria(req.params.criterionId);

      return res.status(201).send({
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = CriteriaController;
