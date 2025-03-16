const express = require('express'); 
const router = express.Router();
const Activity = require('../models/Activity');
const Category = require('../models/Category');
const Booking = require('../models/Booking');
const { Op } = require('sequelize');

// Get all activities with optional filters
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        const filters = {};
        
        if (category) filters.category_id = category;
        if (search) filters.name = { [Op.like]: `%${search}%` };
        
        const activities = await Activity.findAll({ where: filters });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get activity details by ID
router.get('/:id', async (req, res) => {
    try {
        const activity = await Activity.findByPk(req.params.id, {
            include: [{ model: Category, attributes: ['name', 'description'] }]
        });
        if (!activity) return res.status(404).json({ error: 'Activity not found' });
        res.json(activity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check availability for specific activity
router.get('/availability/:id', async (req, res) => {
    try {
        const activity = await Activity.findByPk(req.params.id);
        if (!activity) return res.status(404).json({ error: 'Activity not found' });
        res.json({ available: activity.available });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all available activities
router.get('/activities', async (req, res) => {
    try {
        const activities = await Activity.findAll({
            where: { available: true },
            include: [{ model: Category, attributes: ['name'] }]
        });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get bookings for a specific activity
router.get('/activities/:id/bookings', async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { activity_id: req.params.id }
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
