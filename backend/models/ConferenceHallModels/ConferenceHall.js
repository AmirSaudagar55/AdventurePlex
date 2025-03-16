// models/ConferenceHallModels/ConferenceHall.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const ConferenceHall = sequelize.define('ConferenceHall', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // This field references the Category model.
    // You should ensure that your database already has a Category record with name "Conference Halls"
    // and use that category's id as the default when creating a conference hall.
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  floorNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pricePerMin: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Features like projector, sound system etc. stored as JSON.
  features: {
    type: DataTypes.JSON,
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = ConferenceHall;
