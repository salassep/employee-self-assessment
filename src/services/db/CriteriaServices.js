const db = require('../../database/models');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const CacheServices = require('../redis/CacheServices');

class CriteriaServices {
  constructor() {
    this._cacheServices = new CacheServices();
  }

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

      await this._cacheServices.delete('criteria');

      return result;
    } catch (err) {
      throw new InvariantError('Failed to create criteria');
    }
  }

  async getAllCriteria() {
    try {
      const result = await this._cacheServices.get('criteria');
      return JSON.parse(result);
    } catch (err) {
      const result = await db.Criteria.findAll();
      await this._cacheServices.set('criteria', JSON.stringify(result));
      return result;
    }
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

      await this._cacheServices.delete('criteria');

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

    await this._cacheServices.delete('criteria');

    return result;
  }
}

module.exports = CriteriaServices;
