const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
    lastName: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
      }
}, {
    timestamps: true
});

module.exports = User;
