const jwt = require('jsonwebtoken');
const User = require('../models/User');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

// ✅ Authentication Middleware (JWT & Session-based)
const authenticate = async (req, res, next) => {
    try {
        if (req.isAuthenticated && req.isAuthenticated()) {
            console.log("Session Authenticated:", req.user.email);
            return next();
        }

        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findByPk(decoded.id);

        if (!req.user) return res.status(401).json({ error: 'Invalid token' });

        console.log("JWT Authenticated:", req.user.email);
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// ✅ Role-based Access Control Middleware
const authorizeAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    console.log("Admin access granted");
    next();
};

// ✅ Rate Limiting Middleware (Prevents API abuse)
const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, 
    message: 'Too many requests. Try again later.'
});

// CORS Configuration Middleware
const corsOptions = cors();
// {
//     origin: ['http://localhost:3000', 'https://yourfrontenddomain.com'], // Allowed frontend domains
//     methods: ['GET', 'POST', 'PATCH', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// };
const corsMiddleware = cors(corsOptions);

// Request Logging Middleware
const requestLogger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};

module.exports = { authenticate, authorizeAdmin, rateLimiter, corsMiddleware, requestLogger };

