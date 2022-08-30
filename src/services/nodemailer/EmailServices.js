require('dotenv').config();
const nodemailer = require('nodemailer');
const InvariantError = require('../../exceptions/InvariantError');

const EmailService = {
  sendMessage: async (receiver, htmlContent) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: receiver,
      subject: 'Self Assessment Reminder',
      html: htmlContent,
    };

    try {
      const result = await transporter.sendMail(mailOptions);

      return result;
    } catch (err) {
      console.log(err);
      throw new InvariantError('Something wrong');
    }
  },
};

module.exports = EmailService;
