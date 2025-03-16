// models/ConferenceHallImage.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');
const ConferenceHall = require('./ConferenceHall');

const ConferenceHallImage = sequelize.define('ConferenceHallImage', {
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
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = ConferenceHallImage;
