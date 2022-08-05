const bcrypt = require('bcrypt');
const db = require('../../database/models');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const UserRoleServices = require('./UserRoleServices');
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationServices {
  constructor() {
    this._service = new UserRoleServices();
  }

  async signIn(authData) {
    const result = await db.Users.findOne({
      attributes: ['userId', 'email', 'password'],
      where: {
        email: authData.email,
      },
    });

    if (!result) {
      throw new NotFoundError('User not found');
    }

    const passwordIsValid = bcrypt.compareSync(authData.password, result.password);

    if (!passwordIsValid) {
      throw new AuthenticationError('Password incorrect');
    }

    await db.Logs.upsert({ userId: result.userId, lastLoginAt: new Date() });

    return result;
  }

  async getLogs() {
    const result = await db.Logs.findAll({
      attributes: {
        exclude: ['user_id'],
      },
      order: [['logId', 'DESC']],
      include: [
        {
          model: db.Users,
          require: true,
          attributes: ['name', 'email'],
        },
      ],
    });

    const setObj = new Set();

    const filteredResult = result.reduce((acc, item) => {
      if (!setObj.has(item.userId)) {
        setObj.add(item.userId, item);
        acc.push(item);
      }
      return acc;
    }, []);

    return filteredResult.map((e) => ({
      logId: e.logId,
      userId: e.userId,
      name: e.User.name,
      email: e.User.email,
      lastLoginAt: e.lastLoginAt,
    }));
  }

  async changePassword(authData) {
    const result = await db.Users.findByPk(authData.userId);

    if (!result) {
      throw new NotFoundError('User not found');
    }

    const oldPasswordIsValid = bcrypt.compareSync(authData.oldPass, result.password);

    if (!oldPasswordIsValid) {
      throw new AuthenticationError('Password inccorrect');
    }

    if (!authData.newPass) {
      throw new InvariantError('Password is required');
    }

    try {
      await db.Users.update(
        {
          password: authData.newPass,
        },
        {
          where: { userId: authData.userId },
        },
      );
    } catch (err) {
      throw new InvariantError(`Failed to update password. ${err.message}`);
    }
  }

  async verifyAccess(userId, roleLevel) {
    const userRoles = await this._service.getUserRoles(userId);
    const isAccess = userRoles.find((e) => e.Role.roleId === roleLevel);

    return isAccess;
  }
}

module.exports = AuthenticationServices;
