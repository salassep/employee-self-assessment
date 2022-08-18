const express = require('express');
const requireUser = require('../middleware/requireUser');
const EmailController = require('../controllers/EmailController');

const router = express.Router();
const emailController = new EmailController();

router.post('/send-email', requireUser, emailController.sendEmail);

module.exports = router;
