const db = require('../../database/models');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class CriteriaServices {
  async createCriteria(newData) {
    const createdAt = new Date();
    const updatedAt = createdAt;

    try {
      const result = await db.Criteria.create({
        name: newData.name,
        description: newData.description,
        position: newData.position,
        createdAt,
        updatedAt,
      });

      return result;
    } catch (err) {
      throw new InvariantError('Failed to create criteria');
    }
  }

  async getAllCriteria() {
    const result = await db.Criteria.findAll();

    return result;
  }

  async getCriterionById(criterionId) {
    const result = await db.Criteria.findByPk(criterionId);

    if (!result) {
      throw new NotFoundError('Criteria not found');
    }

    return result;
  }

  async updateCriteria(newData) {
    try {
      const result = await db.Criteria.update(
        {
          name: newData.name,
          description: newData.description,
          position: newData.position,
        },
        {
          where: {
            criteriaId: newData.criterionId,
          },
        },
      );

      if (!result) {
        throw new NotFoundError('Criteria not found');
      }

      return newData;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new InvariantError('Failed to update criteria');
    }
  }

  async deleteCriteria(criterionId) {
    const result = await db.Criteria.destroy({
      where: { criteriaId: criterionId },
    });

    if (!result) {
      throw new NotFoundError('Criteria not found');
    }

    return result;
  }
}

module.exports = CriteriaServices;
