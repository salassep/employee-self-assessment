const autoBind = require('auto-bind');
const { Op, Sequelize } = require('sequelize');
const db = require('../../database/models');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const UserServices = require('./UserServices');
const ResultModel = require('../../utils/ResultModel');
const CacheServices = require('../redis/CacheServices');
const CriteriaServices = require('./CriteriaServices');

class AssessmentServices {
  constructor() {
    this._userService = new UserServices();
    this._resultModel = new ResultModel();
    this._cacheServices = new CacheServices();
    this._criteriaServices = new CriteriaServices();
    autoBind(this);
  }

  async createAssessment(newAssessment) {
    const createdAt = new Date();
    const updatedAt = createdAt;
    const month = createdAt.getMonth() + 1;
    const year = createdAt.getFullYear();
    const period = createdAt.toISOString().split('T')[0];

    const checkAssessment = await db.Assessments.count({
      where: {
        criterionId: newAssessment.criterionId,
        userId: newAssessment.userId,
        receiverId: newAssessment.receiverId,
        [Op.and]: [
          Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('period')), month),
          Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('period')), year),
        ],
      },
    });

    if (checkAssessment) {
      throw new InvariantError('The criteria for receiver in the current period have been inputted');
    }

    try {
      const result = await db.Assessments.create({
        userId: newAssessment.userId,
        receiverId: newAssessment.receiverId,
        criterionId: newAssessment.criterionId,
        point: newAssessment.point,
        period,
        createdAt,
        updatedAt,
      });

      await this._cacheServices.delete('assessments');

      return result;
    } catch (err) {
      throw new InvariantError('Failed to add assessment');
    }
  }

  async getAllAssessments(isModelResult = false, isReceivers = true) {
    let result = [];
    try {
      const cacheResult = await this._cacheServices.get('assessments');
      result = JSON.parse(cacheResult);
    } catch (err) {
      result = await db.Assessments.findAll({
        attributes: {
          exclude: ['criterion_id', 'user_id', 'receiver_id'],
        },
        include: [
          {
            model: db.Users,
            require: true,
            as: 'receiver',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt', 'userId', 'password'],
            },
          },
          {
            model: db.Users,
            require: true,
            as: 'sender',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt', 'userId', 'password'],
            },
          },
          {
            model: db.Criteria,
            require: true,
            as: 'criterion',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt', 'criteriaId'],
            },
          },
        ],
      });

      await this._cacheServices.set('assessments', JSON.stringify(result));
    }

    if (isModelResult) {
      const users = await this._userService.getAllUsers();
      const [months, years] = [
        [...new Set(result.map((e) => new Date(e.period).getMonth() + 1))],
        [...new Set(result.map((e) => new Date(e.period).getFullYear()))],
      ];

      this._resultModel.data = result;

      const resultModel = isReceivers
        ? this._resultModel.modelPerReceiver(users, months, years)
        : this._resultModel.modelPerSender(users, months, years);

      return resultModel;
    }

    return result;
  }

  async getAssessmentsPerPeriod(period, isModelResult = false, isReceivers = true) {
    const [, month, year] = period.split('-');
    const assessments = await this.getAllAssessments();
    const result = assessments
      .filter((e) => new Date(e.period)
        .getMonth() + 1 === +month && new Date(e.period)
        .getFullYear() === +year);

    if (isModelResult) {
      const users = await this._userService.getAllUsers();

      this._resultModel.data = assessments;

      const modelResult = isReceivers
        ? this._resultModel.modelPerPeriodPerReceiver(users, +month, +year)
        : this._resultModel.modelPerPeriodPerSender(users, +month, +year);

      return modelResult;
    }

    return result;
  }

  async getOneEmployeeAssessment(employeeId) {
    const [receivers, senders] = await Promise.all([
      this.getAllAssessments(true),
      this.getAllAssessments(true, false),
    ]);

    const filteredReceivers = receivers.find((receiver) => receiver.receiverId === employeeId);
    const filteredSenders = senders.find((sender) => sender.senderId === employeeId);

    return {
      userId: filteredReceivers.receiverId,
      email: filteredReceivers.email,
      name: filteredReceivers.name,
      position: filteredReceivers.position,
      workDate: filteredReceivers.workDate,
      receivedAssessments: filteredReceivers.periods,
      sendedAssessments: filteredSenders.periods,
    };
  }

  async getOneEmployeeAssessmentPerPeriod(period, employeeId) {
    const [receivers, senders] = await Promise.all([
      this.getAssessmentsPerPeriod(period, true),
      this.getAssessmentsPerPeriod(period, true, false),
    ]);

    const filteredReceivers = receivers.find((receiver) => receiver.receiverId === employeeId);
    const filteredSenders = senders.find((sender) => sender.senderId === employeeId);

    return {
      userId: filteredReceivers.receiverId,
      email: filteredReceivers.email,
      name: filteredReceivers.name,
      position: filteredReceivers.position,
      workDate: filteredReceivers.workDate,
      period: filteredReceivers.period,
      receivedAssessments: filteredReceivers.senders,
      sendedAssessments: filteredSenders.receivers,
    };
  }

  async assessmentsCheckByHr(period) {
    const assessments = await this.getAssessmentsPerPeriod(period, true, false);

    const finishedAssessments = [];
    const unfinishedAssessments = [];

    assessments.map((e) => {
      e.receivers.map((value) => {
        if (!value.assessments.length) {
          unfinishedAssessments.push({
            userId: e.senderId,
            receiverId: value.receiverId,
            email: value.email,
            name: value.name,
            position: value.position,
            workDate: value.workDate,
          });
        } else {
          finishedAssessments.push({
            userId: e.senderId,
            receiverId: value.receiverId,
            email: value.email,
            name: value.name,
            position: value.position,
            workDate: value.workDate,
          });
        }
        return true;
      });
      return true;
    });

    return assessments.map((e) => ({
      userId: e.senderId,
      email: e.email,
      name: e.name,
      position: e.position,
      workDate: e.workDate,
      period: e.period,
      finishedAssessment: finishedAssessments.filter((user) => user.userId === e.senderId),
      unfinishedAssessment: unfinishedAssessments.filter((user) => user.userId === e.senderId),
    }));
  }

  async assessmentCheckByEmployee(period, employeeId) {
    const assessments = await this.getAssessmentsPerPeriod(period, true, false);
    const findEmployeeAssessment = assessments
      .find((assessment) => assessment.senderId === employeeId);

    const finishedAssessments = [];
    const unfinishedAssessments = [];

    findEmployeeAssessment.receivers.forEach((receiver) => {
      if (!receiver.assessments.length) {
        unfinishedAssessments.push({
          receiverId: receiver.receiverId,
          email: receiver.email,
          name: receiver.name,
          position: receiver.position,
          workDate: receiver.workDate,
        });
      } else {
        finishedAssessments.push({
          receiverId: receiver.receiverId,
          email: receiver.email,
          name: receiver.name,
          position: receiver.position,
          workDate: receiver.workDate,
          assessments: receiver.assessments,
        });
      }
      return true;
    });

    return {
      userId: findEmployeeAssessment.senderId,
      email: findEmployeeAssessment.email,
      name: findEmployeeAssessment.name,
      position: findEmployeeAssessment.position,
      workDate: findEmployeeAssessment.workDate,
      period: findEmployeeAssessment.period,
      finishedAssessment: finishedAssessments,
      unfinishedAssessment: unfinishedAssessments,
    };
  }

  async getAssessmentTotalAllEmployeePerPeriod(period) {
    const [criteria, result] = await Promise.all([
      this._criteriaServices.getAllCriteria(),
      this.getAssessmentsPerPeriod(period, true),

    ]);
    const total = (senders, criterionId) => {
      const totalAssessment = [];
      senders.forEach((sender) => {
        sender.assessments.forEach((assessment) => {
          if (assessment.criterionId === criterionId) {
            totalAssessment.push(assessment.point);
          }
        });
      });
      return totalAssessment.reduce((a, b) => a + b, 0);
    };

    return result.map((e) => ({
      userId: e.receiverId,
      email: e.email,
      name: e.name,
      period,
      position: e.position,
      workDate: e.workDate,
      assessments: Object.assign({}, ...criteria.map((criterion) => ({
        [criterion.name]: total(e.senders, criterion.criteriaId),
      }))),
    }));
  }

  async getAssessmentTotalOneEmployeePerPeriod(period, employeeId) {
    const result = await this.getAssessmentTotalAllEmployeePerPeriod(period);
    const filteredResult = result.filter((e) => e.userId === employeeId);

    return filteredResult;
  }

  async updateAssessment(newAssessment) {
    try {
      const [, month, year] = newAssessment.period.split('-');
      const result = await db.Assessments.update(
        {
          point: newAssessment.point,
        },
        {
          where: {
            userId: newAssessment.userId,
            receiverId: newAssessment.receiverId,
            criterionId: newAssessment.criterionId,
            [Op.and]: [
              Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('period')), month),
              Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('period')), year),
            ],
          },
        },
      );

      if (result < 1) {
        this.createAssessment(newAssessment);
      }

      await this._cacheServices.delete('assessments');

      return result;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new InvariantError('Failed to add assessment');
    }
  }

  async deleteEmployeeAssessments(employeeId) {
    const result = await db.Assessments.destroy({
      where: {
        [Op.or]: [{ userId: employeeId }, { receiverId: employeeId }],
      },
    });

    await this._cacheServices.delete('assessments');

    return result;
  }

  async deleteEmployeeAssessmentsCriteriaReason(criterionId) {
    const result = await db.Assessments.destroy({
      where: {
        criterionId,
      },
    });

    await this._cacheServices.delete('assessments');

    return result;
  }
}

module.exports = AssessmentServices;
