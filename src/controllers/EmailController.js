const EmailServices = require('../services/nodemailer/EmailServices');

class EmailController {
  async sendEmail(req, res, next) {
    try {
      const content = '<h1>Self Assessment Reminder</h1><br>You have not filled out the assessment for other employees this month.';

      EmailServices.sendMessage(req.body.email, content);

      return res.status(201).send({
        statusCode: 201,
        status: 'OK',
      });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = EmailController;
