const autoBind = require('auto-bind');
const AssessmentServices = require('../services/db/AssessmentServices');
const AuthenticationServices = require('../services/db/AuthenticationServices');
const AuthorizationError = require('../exceptions/AuthorizationError');

class AssessmentControllers {
  constructor() {
    this._service = new AssessmentServices();
    this._authenticationServices = new AuthenticationServices();
    autoBind(this);
  }

  async createAssessment(req, res, next) {
    const { params, body } = req;

    const newAssessment = {
      userId: req.userId,
      receiverId: params.employeeId,
      criterionId: body.criterionId,
      point: body.point,
    };

    try {
      const result = await this._service.createAssessment(newAssessment);

      return res.status(201).send({
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async getAllAssessments(req, res, next) {
    try {
      const isHr = await this._authenticationServices.verifyAccess(req.userId, 2);

      if (!isHr) {
        throw new AuthorizationError('You don\'t have an access');
      }

      const result = await this._service.getAllAssessments();

      return res.status(201).send({
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async getAllAssessmentReceivers(req, res, next) {
    try {
      const isHr = await this._authenticationServices.verifyAccess(req.userId, 2);

      if (!isHr) {
        throw new AuthorizationError('You don\'t have an access');
      }

      const result = await this._service.getAllAssessments(true);

      return res.status(201).send({
        statusCode: 201,
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async getAllAssessmentSenders(req, res, next) {
    try {
      const isHr = await this._authenticationServices.verifyAccess(req.userId, 2);

      if (!isHr) {
        throw new AuthorizationError('You don\'t have an access');
      }

      const result = await this._service.getAllAssessments(true, false);

      return res.status(201).send({
        statusCode: 201,
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async getAssessmentsPerPeriod(req, res, next) {
    try {
      const isHr = await this._authenticationServices.verifyAccess(req.userId, 2);

      if (!isHr) {
        throw new AuthorizationError('You don\'t have an access');
      }

      const result = await this._service.getAssessmentsPerPeriod(req.params.period);

      return res.status(201).send({
        statusCode: 201,
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async getAssessmentsPerPeriodPerReceiver(req, res, next) {
    try {
      const isHr = await this._authenticationServices.verifyAccess(req.userId, 2);

      if (!isHr) {
        throw new AuthorizationError('You don\'t have an access');
      }

      const result = await this._service.getAssessmentsPerPeriod(req.params.period, true);

      return res.status(201).send({
        statusCode: 201,
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async getAssessmentsPerPeriodPerSender(req, res, next) {
    try {
      const isHr = await this._authenticationServices.verifyAccess(req.userId, 2);

      if (!isHr) {
        throw new AuthorizationError('You don\'t have an access');
      }

      const result = await this._service.getAssessmentsPerPeriod(req.params.period, true, false);

      return res.status(201).send({
        statusCode: 201,
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async getOneEmployeeAssessment(req, res, next) {
    try {
      const result = await this._service.getOneEmployeeAssessment(req.params.employeeId);

      return res.status(201).send({
        statusCode: 201,
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async getOneEmployeeAssessmentPerPeriod(req, res, next) {
    try {
      const result = await this._service
        .getOneEmployeeAssessmentPerPeriod(req.params.period, req.params.employeeId);

      return res.status(201).send({
        statusCode: 201,
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async assessmentCheckByHr(req, res, next) {
    try {
      const result = await this._service
        .assessmentsCheckByHr(req.params.period);

      return res.status(201).send({
        statusCode: 201,
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async assessmentCheckByEmployee(req, res, next) {
    try {
      const result = await this._service.assessmentCheckByEmployee(req.params.period, req.userId);

      return res.status(201).send({
        statusCode: 201,
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async getAssessmentTotalAllEmployeePerPeriod(req, res) {
    const result = await this._service.getAssessmentTotalAllEmployeePerPeriod(req.params.period);

    return res.status(201).send({
      statusCode: 201,
      status: 'OK',
      data: result,
    });
  }

  async getAssessmentTotalOneEmployeePerPeriod(req, res) {
    const result = await this._service
      .getAssessmentTotalOneEmployeePerPeriod(req.params.period, req.params.employeeId);

    return res.status(201).send({
      statusCode: 201,
      status: 'OK',
      data: result,
    });
  }

  async updateAssessment(req, res, next) {
    const { params, body } = req;

    const newAssessment = {
      userId: req.userId,
      receiverId: params.employeeId,
      criterionId: body.criterionId,
      period: body.period,
      point: body.point,
    };

    try {
      const result = await this._service.updateAssessment(newAssessment);

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

module.exports = AssessmentControllers;
