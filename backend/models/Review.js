const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' }
  },
  reviewable_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reviewable_type: {
    type: DataTypes.ENUM('activity', 'conferenceHall'),
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  review_text: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Review;
