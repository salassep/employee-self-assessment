const express = require('express');
const UserControllers = require('../controllers/UserControllers');
const UserRoleControllers = require('../controllers/UserRoleControllers');

const router = express.Router();
const userControllers = new UserControllers();
const userRoleControllers = new UserRoleControllers();

router.get("/users", userControllers.getAllUsers);
router.get("/users/:id", userControllers.getUserById);
router.post("/users", userControllers.createUser);
router.post("/users/:userId/roles/:roleId", userRoleControllers.addRoleToUser);
router.put("/users/:id", userControllers.updateUser);
router.delete("/users/:id", userControllers.deleteUser);
router.delete("/users/:userId/roles/:roleId", userRoleControllers.deleteUserRole);

// router.delete("/users/:id", userControllers.deleteUser);

router.get("/roles", userRoleControllers.getRoles);


module.exports = router;
