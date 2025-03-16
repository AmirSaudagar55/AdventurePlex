//The images of ground (ground images)
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Activity = require('./Activity');

const ActivityImage = sequelize.define('ActivityImage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  activity_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Activity,
      key: 'id'
    }
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = ActivityImage;
