const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const Booking = require('../models/Booking');
const Category = require('../models/Category');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

// ✅ Create new activity (Admin only)
router.post('/activities', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const { category_id, name, description, price, duration, duration_unit, min_age, min_height, max_weight, max_participants, games_available, laps_per_race, type, image_url, available } = req.body;

        // 🔹 Check if category exists before creating an activity
        const category = await Category.findByPk(category_id);
        if (!category) {
            return res.status(400).json({ error: "Category not found." });
        }

        if (!['individual', 'group'].includes(type)) {
            return res.status(400).json({ error: "Invalid type. Must be 'individual' or 'group'." });
        }

        const activity = await Activity.create({
            category_id,
            name,
            description,
            price,
            duration,
            duration_unit,
            min_age,
            min_height,
            max_weight,
            max_participants,
            games_available,
            laps_per_race,
            type,
            image_url,
            available
        });

        res.status(201).json({ message: "Activity created successfully", activity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get all activities
router.get('/activities', async (req, res) => {
    try {
        const activities = await Activity.findAll();
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get a single activity by ID
router.get('/activities/:id', async (req, res) => {
    try {
        const activity = await Activity.findByPk(req.params.id);
        if (!activity) return res.status(404).json({ error: 'Activity not found' });
        res.json(activity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Update an activity (Admin only)
router.patch('/activities/:id', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const activity = await Activity.findByPk(req.params.id);
        if (!activity) return res.status(404).json({ error: 'Activity not found' });

        if (req.body.category_id) {
            const categoryExists = await Category.findByPk(req.body.category_id);
            if (!categoryExists) {
                return res.status(400).json({ error: "Category not found." });
            }
        }

        if (req.body.type && !['individual', 'group'].includes(req.body.type)) {
            return res.status(400).json({ error: "Invalid type. Must be 'individual' or 'group'." });
        }

        await activity.update(req.body);
        res.json({ message: "Activity updated successfully", activity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Delete an activity (Admin only)
router.delete('/activities/:id', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const activity = await Activity.findByPk(req.params.id);
        if (!activity) return res.status(404).json({ error: 'Activity not found' });

        await activity.destroy();
        res.json({ message: "Activity deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get all bookings (Admin only)
router.get('/bookings', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const bookings = await Booking.findAll();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Create a new category (Admin only)
router.post('/categories', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const { name, slug, description, image_url, color } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ error: "Name and slug are required." });
        }

        // 🔹 Ensure unique slug
        const existingCategory = await Category.findOne({ where: { slug } });
        if (existingCategory) {
            return res.status(400).json({ error: "Category with this slug already exists." });
        }

        const category = await Category.create({ name, slug, description, image_url, color });

        res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get all categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
