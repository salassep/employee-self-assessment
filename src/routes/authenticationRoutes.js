const express = require('express');
const AuthenticationControllers = require('../controllers/AuthenticationControllers');
const requireUser = require('../middleware/requireUser');

const router = express.Router();
const authenticationControllers = new AuthenticationControllers();

router.post('/signin', authenticationControllers.signIn); // Sign in
router.post('/change-password', requireUser, authenticationControllers.changePassword); // User change password

router.get('/users/logs', requireUser, authenticationControllers.getLogs); // Get login info

router.delete('/logout', requireUser, authenticationControllers.logOut); // Log out

module.exports = router;
