const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { authenticate } = require('../middlewares/authMiddleware'); // Middleware for authentication

// ✅ Create a review (User must be authenticated)
router.post('/', authenticate, async (req, res) => {
    try {
        const { activity_id, rating, review_text } = req.body;
        const user_id = req.user.id; // Authenticated user ID

        if (!activity_id || !rating) {
            return res.status(400).json({ error: 'Activity ID and rating are required.' });
        }

        const review = await Review.create({ user_id, activity_id, rating, review_text });
        res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get all reviews for a specific activity
router.get('/:activity_id', async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { activity_id: req.params.activity_id }
        });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Update a review (User can only update their own review)
router.patch('/:id', authenticate, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) return res.status(404).json({ error: 'Review not found' });

        if (review.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to update this review' });
        }

        await review.update(req.body);
        res.json({ message: 'Review updated successfully', review });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Delete a review (User can delete their own review, Admin can delete any review)
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) return res.status(404).json({ error: 'Review not found' });

        if (review.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized to delete this review' });
        }

        await review.destroy();
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
