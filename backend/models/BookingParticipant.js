// models/BookingParticipant.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Booking = require('./Booking');

const BookingParticipant = sequelize.define('BookingParticipant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  booking_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Booking,
      key: 'id'
    }
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = BookingParticipant;
