// index.js
require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const cors = require('cors');
const session = require('express-session');
const passport = require('./passport-setup');

const { rateLimiter, requestLogger } = require('./middlewares/authMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const activityRoutes = require('./routes/activityRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const recommendationsRoutes = require('./routes/recommendationsRoutes');
const conferenceHallRoutes = require('./routes/conferenceHallRoutes/conferenceHallRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const conferenceHallPaymentRoutes = require('./routes/conferenceHallRoutes/conferenceHallPaymentRoutes');


///For  associations :::: 
const User = require('./models/User');
const Category = require('./models/Category');
const Activity = require('./models/Activity');
const Booking = require('./models/Booking');
const BookingParticipant = require('./models/BookingParticipant');
const ActivityImage = require('./models/ActivityImage');
const ConferenceHall = require('./models/ConferenceHallModels/ConferenceHall');
const ConferenceHallBooking = require('./models/ConferenceHallModels/ConferenceHallBooking');
const ConferenceHallImage = require('./models/ConferenceHallModels/ConferenceHallImage');

// ----------------------------------------Associations for Sports Bookings-----------
Booking.belongsTo(Activity, { foreignKey: 'activity_id' });
Activity.hasMany(Booking, { foreignKey: 'activity_id' });

Booking.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Booking, { foreignKey: 'user_id' });

Booking.hasMany(BookingParticipant, { foreignKey: 'booking_id' });
BookingParticipant.belongsTo(Booking, { foreignKey: 'booking_id' });

Activity.hasMany(ActivityImage, { foreignKey: 'activity_id', as: 'images' });
ActivityImage.belongsTo(Activity, { foreignKey: 'activity_id' });

Activity.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Activity, { foreignKey: 'category_id' });


// ----------------------------------Associations for conference hall booking---------------
// 1. ConferenceHall has many bookings
ConferenceHall.hasMany(ConferenceHallBooking, { foreignKey: 'conferenceHallId', as: 'bookings' });
ConferenceHallBooking.belongsTo(ConferenceHall, { foreignKey: 'conferenceHallId' });

// 2. A User can have many ConferenceHallBookings
User.hasMany(ConferenceHallBooking, { foreignKey: 'userId', as: 'conferenceHallBookings' });
ConferenceHallBooking.belongsTo(User, { foreignKey: 'userId' });

// 3. ConferenceHall has many images (for carousels, etc.)
ConferenceHall.hasMany(ConferenceHallImage, { foreignKey: 'conferenceHallId', as: 'images' });
ConferenceHallImage.belongsTo(ConferenceHall, { foreignKey: 'conferenceHallId' });

// 4.Each ConferenceHall belongs to a Category (the "Conference Halls" category)
ConferenceHall.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Category.hasMany(ConferenceHall, { foreignKey: 'category_id', as: 'conferenceHalls' });
//----------------------------------------------------------------------


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
// app.use(rateLimiter);
app.use(requestLogger);

// Configure express-session middleware (required for Passport sessions)
app.use(session({
    secret: process.env.SESSION_SECRET || 'mysecret', // Set in .env file
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set secure:true in production with HTTPS
}));

// Initialize Passport and use sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/conferenceHalls', conferenceHallRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/conferenceHallPayment', conferenceHallPaymentRoutes);


// Test database connection and start the server
sequelize.authenticate()
    .then(() => {
        console.log('Database connected...');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('Database connection failed:', err));
