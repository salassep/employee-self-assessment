const express = require('express');
const requireUser = require('../middleware/requireUser');
const UserControllers = require('../controllers/UserControllers');
const UserRoleControllers = require('../controllers/UserRoleControllers');

const router = express.Router();
const userControllers = new UserControllers();
const userRoleControllers = new UserRoleControllers();

router.get('/users', requireUser, userControllers.getAllUsers); // Get all users
router.get('/users/:id', requireUser, userControllers.getUserById); // Get user by id
router.get('/users/roles/:roleName', requireUser, userControllers.getUsersByRole); // Get users by role
router.get('/roles', requireUser, userRoleControllers.getRoles); // Get all roles

router.post('/users', requireUser, userControllers.createUser); // Create new user by super admin
router.post('/users/:userId/roles/:roleId', userRoleControllers.addRoleToUser); // Add new role to user

router.put('/users/:id', requireUser, userControllers.updateUser); // Change user data (password and role not included)
router.put('/users/roles/:userRoleId', userRoleControllers.updateUserRole);

router.delete('/users/:id', requireUser, userControllers.deleteUser);
router.delete('/users/:userId/roles/:roleId', requireUser, userRoleControllers.deleteUserRole);

module.exports = router;
