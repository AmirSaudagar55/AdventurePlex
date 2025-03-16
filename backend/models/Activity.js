// models/Activity.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Category = require('./Category');

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  will_price_remain_same_for_whole_group: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  price: {
    type: DataTypes.STRING, // For display purposes; you might add a numeric field if needed for calculations.
    allowNull: true
  },
  maximum_group_members_allowed: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  duration: { // Time taken to complete the activity in each slot
    type: DataTypes.INTEGER,
    allowNull: false
  },
  duration_unit: {
    type: DataTypes.STRING, // e.g., "Mins", "Hours", "Day"
    allowNull: true
  },
  min_age: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  min_height: {
    type: DataTypes.STRING, // e.g., "4.5ft"
    allowNull: true
  },
  max_weight: {
    type: DataTypes.STRING, // e.g., "90 Kgs"
    allowNull: true
  },
  max_participants_per_slots: {  
    // For go-karting: number of karts available. For 7D theater: seating capacity.
    type: DataTypes.INTEGER,
    allowNull: true
  },
  games_available: {
    type: DataTypes.INTEGER, // e.g., "14" for Carnival Games
    allowNull: true
  },
  laps_per_race: {
    type: DataTypes.INTEGER, // Specific to Go-karting
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('individual', 'group'),
    allowNull: false
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

module.exports = Activity;