const autoBind = require('auto-bind');
const { Op, Sequelize } = require('sequelize');
const db = require('../../database/models');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const UserServices = require('./UserServices');

class AssessmentServices {
  constructor() {
    this._userService = new UserServices();
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

      return result;
    } catch (err) {
      throw new InvariantError('Failed to add assessment');
    }
  }

  async getAllAssessments() {
    const result = await db.Assessments.findAll({
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

    return result;
  }

  async getAssessmentsPerPeriod(period) {
    const [, month, year] = period.split('-');
    const assessments = await this.getAllAssessments();
    const filteredAssessments = assessments
      .filter((e) => new Date(e.period).getMonth() + 1 === +month
      && new Date(e.period).getFullYear() === +year);

    return filteredAssessments;
  }

  async getAssessmentsPerPeriodPerReceiver(period, receiverId) {
    const [, month, year] = period.split('-');
    const assessments = await this.getAllAssessments();
    const filteredAssessments = assessments
      .filter((e) => new Date(e.period).getMonth() + 1 === +month
      && new Date(e.period).getFullYear() === +year
      && e.receiverId === receiverId);
    const senders = [...new Set(filteredAssessments.map((e) => e.userId))];
    const filteredSenders = (senderId) => filteredAssessments.filter((e) => e.userId === senderId);

    if (!filteredAssessments.length) return [];

    return {
      receiverId,
      name: filteredAssessments[0].receiver.name,
      email: filteredAssessments[0].receiver.email,
      period,
      workDate: filteredAssessments[0].receiver.workDate,
      position: filteredAssessments[0].receiver.position,
      senders: senders.map((e) => ({
        userId: e,
        name: filteredSenders(e)[0].sender.name,
        email: filteredSenders(e)[0].sender.email,
        workDate: filteredSenders(e)[0].sender.workDate,
        position: filteredSenders(e)[0].sender.position,
        assessments: filteredSenders(e).map((elem) => ({
          assessmentId: elem.assessmentId,
          criterionId: elem.criterionId,
          criteriaName: elem.criterion.name,
          description: elem.criterion.description,
          position: elem.criterion.position,
          point: elem.point,
          createdAt: elem.createdAt,
          updatedAt: elem.updatedAt,
        })),
      })),
    };
  }

  async getOneEmployeeAssessment(employeeId) {
    const result = await db.Assessments.findAll({
      where: {
        receiverId: employeeId,
      },
      attributes: {
        exclude: ['criterion_id', 'user_id', 'receiver_id'],
      },
      include: [
        {
          model: db.Users,
          require: true,
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: db.Criteria,
          require: true,
        },
      ],
    });

    if (!result.length) {
      throw new NotFoundError('Assessment not found');
    }

    const getCriteria = await this.getCriteria();

    return {
      employeeId: result[0].dataValues.User.userId,
      name: result[0].dataValues.User.name,
      position: result[0].dataValues.User.position,
      period: result[0].dataValues.period,
      assessments: getCriteria.map((e) => ({
        criterionId: e.criteriaId,
        criteriaName: e.name,
        position: e.position,
        description: e.description,
        total: result.map((value) => {
          if (e.criteriaId === value.criterionId) return value.point;
          return 0;
        }).reduce((a, b) => a + b, 0),
      })),
    };
  }

  async assessmentsCheckByAdmin(employeeId) {
    const getUsers = await this._userService.getAllUsers();
    const employeeArr = getUsers
      .filter((e) => (e.userId !== employeeId && e.roles.length
        ? e.roles.find((value) => value.name === 'employee')
        : false
      ));

    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const result = await db.Assessments.count({
      where: {
        userId: employeeId,
        receiverId: employeeArr.map((e) => e.userId),
        [Op.and]: [
          Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('period')), month),
          Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('period')), year),
        ],
      },
    });

    if (result < employeeArr.length) return { isDone: false };

    return { isDone: true };
  }

  async assessmentCheckByEmployee(userId, receiverId) {
    const criteria = await this.getCriteria();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const result = await db.Assessments.count({
      where: {
        userId,
        receiverId,
        criterionId: criteria.map((e) => e.criteriaId),
        [Op.and]: [
          Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('period')), month),
          Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('period')), year),
        ],
      },
    });

    if (result < criteria.length) return { isDone: false };

    return { isDone: true };
  }

  async updateAssessment(newAssessment) {
    try {
      const result = await db.Assessments.update(
        {
          point: newAssessment.point,
        },
        {
          where: {
            userId: newAssessment.userId,
            receiverId: newAssessment.receiverId,
            criterionId: newAssessment.criterionId,
          },
        },
      );

      return result;
    } catch (err) {
      throw new InvariantError('Failed to add assessment');
    }
  }

  async deleteEmployeeAssessments(employeeId) {
    const result = await db.Assessments.destroy({
      where: {
        [Op.or]: [{ userId: employeeId }, { receiverId: employeeId }],
      },
    });

    return result;
  }
}

module.exports = AssessmentServices;
