const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Submit contact form
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }
        const contact = await Contact.create({ name, email, phone, message });
        res.status(201).json({ message: 'Contact form submitted successfully', contact });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
