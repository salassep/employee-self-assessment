require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.database,
    host: process.env.HOST,
    port: 3306,
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: 'root',
    database: 'employee_assessment',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: 'root',
    database: 'employee_assessment',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
