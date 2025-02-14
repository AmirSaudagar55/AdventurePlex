// authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('../passport-setup'); // Ensure Passport is configured
const User = require('../models/User');
const { authenticate } = require('../middlewares/authMiddleware');
const { validateRegister, validateLogin } = require('../middlewares/validationMiddleware');

//Just optional Local Registration
router.post('/register', validateRegister, async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, phone });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Local Login (Optional if using sessions; you may combine local & Google auth)
// Here we continue to support JWT-based login for local auth.
router.post('/login', validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Google OAuth: Initiate authentication with Google
router.get('/google', passport.authenticate('google', { scope: ['openid', 'email', 'profile'] }));

// Google OAuth Callback
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login', successRedirect: 'https://5173-idx-adventureplex-1739096860464.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev/', session: true }),
    (req, res) => {
        // Successful authentication - here you can choose to redirect or send a token/session info.
        console.log(req.user);
        res.json({ message: 'Google login successful', user: req.user });
    }
);

router.get('/successTemp', (req, res)=>{
    console.log("User logged in 😀");
    console.log(req.user);
    res.json({ message: 'Google login successful 😀', user: req.user });

})

// Logout User (destroys session)
router.post('/logout', authenticate, (req, res) => {
    req.logout(() => {
        res.json({ message: 'Logout successful' });
    });
});

// Get Current User (session based)
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
        res.json(user);
    } catch (error) {
        console.log("Got error in /me route");
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
