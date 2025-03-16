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

// Local Registration
router.post('/register', validateRegister, async (req, res) => {
  try {
    // Expect firstName, lastName, email, password, and phone from request body.
    console.log(req.body);
    const { firstName, lastName, email, password, phone } = req.body;
    // Combine first and last name to store in the "name" field.
    const fullName = `${firstName} ${lastName}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      firstName, 
      lastName, 
      name: fullName,
      email, 
      password: hashedPassword, 
      phone,
      profilePicture: "https://ik.imagekit.io/r9wd8jzgs/people.png?updatedAt=1739851225791"
    });
    // Generate a JWT token for persistent login
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15d' }
    );
    res.status(201).json({ message: 'User registered successfully', token, user });
  } catch (error) {
    console.log(error);
    // If the error is due to a unique constraint (e.g. duplicate email), send a friendly message.
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "User already exists" });
    }
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
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15d' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Google OAuth: Initiate authentication with Google
router.get('/google', passport.authenticate('google', { scope: ['openid', 'email', 'profile'] }));

// Google OAuth Callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
      console.log("Google OAuth callback - user:", req.user);
      // Generate a JWT token for persistent login
      const token = jwt.sign(
        { id: req.user.id, role: req.user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15d' }
      );
      // Redirect to the frontend with the token in the URL query string
      res.redirect(
        `https://5173-idx-adventureplex-1739096860464.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev/?token=${token}`
      );
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
