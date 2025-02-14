const sequelize = require('./db');
const User = require('./models/User');
const Category = require('./models/Category');
const Activity = require('./models/Activity');
const Booking = require('./models/Booking');
const Contact = require('./models/Contact');
const Review = require('./models/Review');

const syncDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');

        await sequelize.sync({ alter: true }); // Use { force: true } for dropping tables before sync
        console.log('Database tables synchronized');
    } catch (error) {
        console.error('Error syncing database:', error);
    } finally {
        await sequelize.close();
    }
};

syncDB();
