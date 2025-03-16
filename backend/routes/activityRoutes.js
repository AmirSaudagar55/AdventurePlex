const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const Category = require('../models/Category');
const ActivityImage = require('../models/ActivityImage'); 
const Booking = require('../models/Booking');
const ConferenceHall = require('../models/ConferenceHallModels/ConferenceHall');
const { Op } = require('sequelize');

/**
 * IMPORTANT: Order your routes so that more specific routes are defined 
 * before the dynamic route (i.e. '/:id'). This prevents routes like '/availability/:id'
 * or '/activities' from being misinterpreted.
 */


// Route to get images for a specific activity
router.get('/:id/images', async (req, res) => {
    try {
        const images = await ActivityImage.findAll({
            where: { activity_id: req.params.id },
            attributes: ['image_url']
        });
        if (!images.length) {
            return res.status(404).json({ error: 'No images found for this activity' });
        }
        res.json(images);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 1. Check availability for a specific activity
router.get('/availability/:id', async (req, res) => {
    try {
        const activity = await Activity.findByPk(req.params.id);
        if (!activity) return res.status(404).json({ error: 'Activity not found' });
        res.json({ available: activity.available });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Get bookings for a specific activity
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





// 3. (Optional) Get all available activities – renamed route to avoid conflict
router.get('/available', async (req, res) => {
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

// 4. Get all activities with optional filters (this route is for queries with filters)
// 4. Get all activities with optional filters (this route is for queries with filters)
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        const filters = {};
        if (category) {
            // Convert category to an integer for correct matching
            filters.category_id = parseInt(category, 10);
        }
        if (search) {
            filters.name = { [Op.like]: `%${search}%` };
        }
        const activities = await Activity.findAll({ where: filters });
        console.log("We are sending the filtered activities ", activities.length)
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Get activity details by ID (this should be the last route, so it doesn’t override the above)
router.get('/:id', async (req, res) => {
    try {
        const activity = await Activity.findByPk(req.params.id, {
            include: [
                { model: Category, attributes: ['name', 'description'] },
                { model: ActivityImage, as: 'images', attributes: ['image_url'] }
            ]
        });
        if (!activity) return res.status(404).json({ error: 'Activity not found' });
        res.json(activity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
