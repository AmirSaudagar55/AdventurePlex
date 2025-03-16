// models/ConferenceHallBooking.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');
const ConferenceHall = require('./ConferenceHall');
const User = require('../User');

const ConferenceHallBooking = sequelize.define('ConferenceHallBooking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conferenceHallId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ConferenceHall,
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  bookingDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed'),
    defaultValue: 'pending'
  },
  // Payment fields:
  razorpay_order_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid'),
    defaultValue: null
  },
  razorpay_payment_id: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

ConferenceHallBooking.belongsTo(ConferenceHall, { foreignKey: 'conferenceHallId' });
ConferenceHallBooking.belongsTo(User, { foreignKey: 'userId' });

module.exports = ConferenceHallBooking;
