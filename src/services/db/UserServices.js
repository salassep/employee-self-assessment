const autoBind = require('auto-bind');
const db = require('../../database/models');
const InvariantError = require('../../exceptions/InvariantError');
const UserRoleServices = require('./UserRoleServices');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserServices {
  constructor() {
    this._userRoleServices = new UserRoleServices();
    autoBind(this);
  }

  async createUser(newUser) {
    const createdAt = new Date();
    const updatedAt = createdAt;

    const isRoleExist = await this._userRoleServices.checkRoleExist(newUser.roleId);

    if (!isRoleExist) {
      throw new NotFoundError('Role not found');
    }

    try {
      const result = await db.Users.create({
        email: newUser.email,
        password: newUser.password,
        name: newUser.name,
        workDate: newUser.workDate,
        position: newUser.position,
        createdAt,
        updatedAt,
      });

      await this._userRoleServices.createUserRole(result.userId, newUser.roleId);

      delete result.dataValues.password;

      return result;
    } catch (err) {
      throw new InvariantError('Failed to add user.');
    }
  }

  async getAllUsers() {
    try {
      const [result, userRoles] = await Promise.all([
        db.Users.findAll(),
        this._userRoleServices.getUserRoles(),
      ]);

      const getArrayRole = (userId) => {
        const userRolesArr = [];
        userRoles.forEach((e) => {
          if (e.userId === userId) {
            userRolesArr.push({ userRoleId: e.userRoleId, roleId: e.roleId, name: e.Role.name });
          }
        });

        return userRolesArr;
      };

      return result.map((e) => ({
        userId: e.userId,
        name: e.name,
        email: e.email,
        workDate: e.workDate,
        position: e.position,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
        deletedAt: e.deletedAt,
        roles: getArrayRole(e.userId),
      }));
    } catch (err) {
      return false;
    }
  }

  async getUsersByRole(roleName) {
    const allUsers = await this.getAllUsers();
    const employeeArr = allUsers.filter((e) => e.roles.find((value) => value.name === roleName));

    return employeeArr;
  }

  async getUserById(userId) {
    const result = await db.Users.findAll({
      attributes: {
        exclude: ['password'],
      },
      where: {
        userId,
      },
    });

    if (!result.length) {
      throw new NotFoundError('User not found');
    }

    const userRoles = await this._userRoleServices.getUserRoles(userId);

    result[0].dataValues.roles = userRoles.map((e) => (
      {
        userRoleId: e.userRoleId,
        roleId: e.roleId,
        name: e.Role.name,
      }));

    return result;
  }

  async updateUser(userId, newData) {
    try {
      const result = await db.Users.update(
        {
          email: newData.email,
          name: newData.name,
          workDate: newData.workDate,
          position: newData.position,
        },
        {
          where: {
            id: userId,
          },
        },
      );

      if (result < 1) {
        throw new NotFoundError('User not found');
      }

      return {
        id: userId,
        email: newData.email,
        name: newData.name,
        workDate: newData.workDate,
        position: newData.position,
      };
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new InvariantError('Failed to add user');
    }
  }

  async deleteUser(userId) {
    const result = await db.Users.destroy({
      where: {
        id: userId,
      },
    });

    if (result < 1) {
      throw new NotFoundError('User not found');
    }

    await this._userRoleServices.deleteUserRole(userId);

    return result;
  }
}

module.exports = UserServices;
