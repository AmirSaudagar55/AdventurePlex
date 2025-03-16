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
    price: {
        type: DataTypes.STRING, // To handle different pricing formats (₹295, Per Player, etc.)
        allowNull: true
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: true // For activities with a set duration
    },
    duration_unit: {
        type: DataTypes.STRING, // E.g., "Mins", "Hours", "Day"
        allowNull: true
    },
    min_age: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    min_height: {
        type: DataTypes.STRING, // Handles values like "4.5ft"
        allowNull: true
    },
    max_weight: {
        type: DataTypes.STRING, // E.g., "90 Kgs"
        allowNull: true
    },
    max_participants: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    games_available: {
        type: DataTypes.INTEGER, // E.g., "14" for Carnival Games
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
