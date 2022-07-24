const userServices = require('../services/userServices');

const createUser = async (req, res) => {
  const { body } = req;

  const newUser = {
    email: body.email,
    password: body.password,
    name: body.name,
    workDate: body.workDate,
    position: body.position,
  };

  const result = await userServices.createUser(newUser);

  if (result.errors) {
    return res.status(400).send({
      status: "Failed",
      msg: result.errors.map(e => e.message)
    });
  }

  res.status(201).send({status: "OK", data: result});
};                                                                                                                                                                                                                                                                                          

const getAllUsers = async (req, res) => {
  const result = await userServices.getAllUsers();
  
  if (result.errors) {
    return res.status(400).send({
      status: "Failed",
      msg: result.errors.map(e => e.message)
    });
  }

  res.status(201).send({status: "OK", data: result});
};

const getUserById = async (req, res) => {
  const result = await userServices.getUserById(req.params.id);

  if (result.errors) {
    return res.status(400).send({
      status: "Failed",
      msg: result.errors.map(e => e.message)
    });
  }

  res.status(201).send({status: "OK", data: result});
};

const updateUser = (req, res) => {
  const result = userServices.updateUser();
  res.send("Update a role");
};

const deleteUser = (req, res) => {
  const result = userServices.deleteUser();
  res.send("Delete a role");
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}