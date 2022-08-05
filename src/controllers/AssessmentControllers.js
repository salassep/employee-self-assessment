/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');
const AssessmentServices = require('../services/db/AssessmentServices');

class AssessmentControllers {
  constructor() {
    this._service = new AssessmentServices();
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

  async getAllAssessments(req, res) {
    const result = await this._service.getAllAssessments();

    res.status(201).send({
      status: 'OK',
      data: result,
    });
  }

  async getAssessmentsPerPeriod(req, res, next) {
    const result = await this._service.getAssessmentsPerPeriod(req.params.period);

    res.status(201).send({
      status: 'OK',
      data: result,
    });
  }

  async getAssessmentsPerPeriodPerReceiver(req, res, next) {
    const result = await this._service
      .getAssessmentsPerPeriodPerReceiver(req.params.period, req.params.receiverId);

    res.status(201).send({
      status: 'OK',
      data: result,
    });
  }

  async getOneEmployeeAssessment(req, res, next) {
    try {
      const result = await this._service.getOneEmployeeAssessment(req.params.employeeId);

      return res.status(201).send({
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async assessmentCheckByAdmin(req, res, next) {
    try {
      const result = await this._service.assessmentsCheckByAdmin(req.params.employeeId);

      return res.status(201).send({
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async assessmentCheckByEmployee(req, res, next) {
    try {
      const userId = '65627920-87bb-49af-b6d3-a04ba86c2fef';
      const result = await this._service.assessmentCheckByEmployee(userId, req.params.receiverId);

      return res.status(201).send({
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async updateAssessment(req, res, next) {
    const { params, body } = req;

    const newAssessment = {
      userId: '65627920-87bb-49af-b6d3-a04ba86c2fef',
      receiverId: params.employeeId,
      criterionId: body.criterionId,
      point: body.point,
    };

    try {
      const result = await this._service.updateAssessment(newAssessment);

      return res.status(201).send({
        status: 'OK',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = AssessmentControllers;
