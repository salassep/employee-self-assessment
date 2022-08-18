const ClientError = require('../exceptions/ClientError');

/* eslint-disable no-unused-vars */
class ErrorControllers {
  static errorLogger(err, req, res, next) {
    console.error('\x1b[31m', err);
    next(err);
  }

  static errorResponder(err, req, res, next) {
    if (err instanceof ClientError) {
      res.status(err.statusCode).send({ statusCode: err.statusCode, status: 'Failed', msg: err.message });
    } else {
      res.status(err.statusCode).send(JSON.stringify(err, null, 4));
    }
  }

  static invalidPathHandler(req, res, next) {
    res.redirect('/error');
  }
}

module.exports = ErrorControllers;
