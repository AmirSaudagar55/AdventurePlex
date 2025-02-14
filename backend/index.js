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

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(rateLimiter);
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

// Test database connection and start the server
sequelize.authenticate()
    .then(() => {
        console.log('Database connected...');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('Database connection failed:', err));
