const db = require('../database/models');
const bcrypt = require('bcrypt');
const InvariantError = require('../exceptions/InvariantError');
const UserRoleServices = require('./UserRoleServices');
const ClientError = require('../exceptions/ClientError');
const autoBind = require('auto-bind');
const NotFoundError = require('../exceptions/NotFoundError');

class UserServices {
  constructor() {
    this._userRoleServices = new UserRoleServices();
    autoBind(this);
  }

  async createUser(newUser) {
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    const createdAt = new Date();
    const updatedAt = createdAt;

    try {
      const result = await db.Users.create({
        email: newUser.email,
        password: hashPassword,
        name: newUser.name,
        workDate: newUser.workDate,
        position: newUser.position,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const userRoleResult = await this._userRoleServices.createUserRole(result.userId, newUser.roleId);

      if(userRoleResult instanceof ClientError) {
        return userRoleResult;
      }
  
      return result; 

    } catch (err) {
      return new InvariantError("Failed to add user");
    }
  }

  async getAllUsers() {
    try {
      const result = await db.Users.findAll();
      const userRoles = await this._userRoleServices.getUserRoles();
      
      const getArrayRole = (userId) => {
        const  userRolesArr = [];
        userRoles.forEach((e) => {
          if (e.userId === userId) {
            userRolesArr.push({roleId: e.roleId ,name: e.Role.name});
          }
        });
        return userRolesArr;
      };
  
      return result.map((e) => {
        return {
          userId: e.userId,
          name: e.name,
          email: e.email,
          workDate: e.workDate,
          position: e.position,
          createdAt: e.createdAt,
          updatedAt: e.updatedAt,
          deletedAt: e.deletedAt,
          roles: getArrayRole(e.userId)
        }
      }); 

    } catch (err) {
      return;
    }
  }

  async getUserById(userId) {
    try {
      const result = await db.Users.findAll({
        where: {
          userId: userId,
        }
      });

      const userRoles = await this._userRoleServices.getUserRoles(userId);

      result[0].dataValues.roles = userRoles.map((e) => Object.assign({roleId: e.roleId, name: e.Role.name}));

      return result; 
    } catch (err) {
      return;
    }
  }

  async updateUser(userId, newData){
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
            id: userId
          }
        }
      );

      if (result < 1) {
        return new NotFoundError("User not found");
      }
      
      return {
        id: userId,
        email: newData.email,
        name: newData.name,
        workDate: newData.workDate,
        position: newData.position, 
      }        
      
    } catch (err) {
      return new InvariantError("Failed to update user");
    }
  }

  async deleteUser(userId) {
    try {
      const result = await db.Users.update(
        {
          deletedAt: new Date(),      
        },
        {
          where: { 
            id: userId,
            deletedAt: null,
          }
        }
      );

      if (result < 1) {
        return new NotFoundError("User not found");
      }

      await this._userRoleServices.deleteUserRole(userId);
      
      return result.length;   
      
    } catch (err) {
      return new InvariantError("Failed to delete user");
    }
  }
}

module.exports = UserServices;
