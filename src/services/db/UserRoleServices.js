const { Op } = require('sequelize');
const db = require('../../database/models');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserRoleServices {
  async checkRoleExist(roleId) {
    const result = await db.Roles.count({
      where: {
        roleId,
      },
    });

    return result;
  }

  async createUserRole(userId, roleId) {
    try {
      const userRoleCheck = await db.User_roles.count({
        where: {
          userId,
          roleId,
        },
      });

      if (userRoleCheck) {
        throw new InvariantError('Role already exist in this user');
      }

      const result = await db.User_roles.create({
        roleId,
        userId,
      });

      return result;
    } catch (err) {
      if (err instanceof InvariantError) throw err;
      throw new NotFoundError('Failed to add role to user, role or user not exist');
    }
  }

  async getUserRoles(userId = null) {
    try {
      const result = await db.User_roles.findAll({
        attributes: {
          exclude: ['role_id', 'user_id'],
        },
        include: [
          {
            model: db.Roles,
            require: true,
          },
          {
            model: db.Users,
            require: true,
            attributes: ['name'],
            where: {
              userId: {
                [Op.like]: userId ? `%${userId}` : '%',
              },
            },
          },
        ],
      });

      return result;
    } catch (err) {
      throw new NotFoundError('Role not found');
    }
  }

  async getRoles() {
    try {
      const result = await db.Roles.findAll();

      return result;
    } catch (err) {
      return new NotFoundError('Failed to get roles');
    }
  }

  async updateUserRole(userRoleId, newRoleId) {
    const isRoleExist = await this.checkRoleExist(newRoleId);

    if (!isRoleExist) {
      throw new NotFoundError('Role not found');
    }

    const result = await db.User_roles.update(
      {
        roleId: newRoleId,
      },
      {
        where: {
          userRoleId,
        },
      },
    );

    if (result < 1) {
      throw new NotFoundError('User or role not found');
    }

    return result;
  }

  async deleteUserRole(userId, roleId = null) {
    const result = roleId
      ? await db.User_roles.destroy({
        where: {
          userId,
          roleId,
        },
      })
      : await db.User_roles.destroy({
        where: {
          userId,
        },
      });

    if (!result) {
      throw new NotFoundError('User or role not found');
    }

    return result;
  }
}

module.exports = UserRoleServices;
