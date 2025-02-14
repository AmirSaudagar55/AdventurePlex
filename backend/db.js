const { Sequelize } = require('sequelize');

// Database connection
const sequelize = new Sequelize('testdb', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
});

module.exports = sequelize;
