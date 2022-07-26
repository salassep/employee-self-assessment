const { Op } = require('sequelize');
const db = require('../database/models');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class UserRoleServices {
  async createUserRole(userId, roleId) {
    try {

      const userRoleCheck = await db.User_roles.count({
        where: {
          userId: userId,
          roleId: roleId,
        }
      });

      if (userRoleCheck) {
        return new InvariantError("Role already exist in this user");
      }

      const result  = await db.User_roles.create({
        roleId: roleId,
        userId: userId,
      });

      return result;
    } catch (err) {
      return new InvariantError("Failed to add role to user");
    }
  }

  async getUserRoles(userId = null) {
    try {
      const result  = await db.User_roles.findAll({
        include: [
          {
            model: db.Roles,
            require: true,
          },
          {
            model: db.Users,
            require: true,
            where: {
              userId: {
                [Op.like]: userId ? `%${userId}` : '%'
              },
            }
          }
        ]
      });


      return result;
    } catch (err) {
      return new NotFoundError("Role not found");
    }
  }

  async getRoles() {
    try {
      const result  = await db.Roles.findAll();

      return result;
    } catch (err) {
      return new NotFoundError("Failed to get roles");
    }
  }

  async deleteUserRole(userId, roleId = null) {
    try {
      const result  = roleId 
      ? await db.User_roles.destroy({
        where: {
          userId: userId,
          roleId: roleId,
        }
      }) 
      : await db.User_roles.destroy({
        where: {
          userId: userId,
        }
      });

      if (!result) {
        return new NotFoundError("User or role not found");
      }

      return result;
    } catch (err) {
      return new InvariantError("Failed to delete role");
    }
  }
};

module.exports = UserRoleServices;
