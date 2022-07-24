const db = require('../database/models');
const bcrypt = require('bcrypt');

const createUser = async (newUser) => {
  const hashPassword = await bcrypt.hash(newUser.password, 10);
  const createdAt = new Date();
  const updatedAt = createdAt;

  // const isExist = await db.Users.count({
  //   where : {
  //     email: newUser.email
  //   }
  // });
  
  // if (isExist) {
  //   return;
  // }

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
  
    return result;

  } catch (err) {
    return err;
  }
};

const getAllUsers = async () => {
  try {
    const result = await db.Users.findAll();
  
    return result;

  } catch (err) {
    return err;
  }
};

const getUserById = async (userId) => {
  try {
    const result = await db.Users.findAll({
      where: {
        userId: userId
      }
    });
  
    return result;

  } catch (err) {
    return err;
  }
};

const updateUser = () => {
  return
};

const deleteUser = () => {
  return
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
