const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Review = require('../models/Review');
const Activity = require('../models/Activity');
const ConferenceHall = require('../models/ConferenceHallModels/ConferenceHall');
const { authenticate } = require('../middlewares/authMiddleware');

// Create a review for an activity or conference hall
router.post('/', authenticate, async (req, res) => {
  try {
    const { reviewable_type, reviewable_id, rating, review_text } = req.body;
    if (!reviewable_type || !reviewable_id || !rating) {
      return res.status(400).json({ error: 'reviewable_type, reviewable_id, and rating are required.' });
    }
    if (!['activity', 'conferenceHall'].includes(reviewable_type)) {
      return res.status(400).json({ error: 'Invalid reviewable_type. Must be "activity" or "conferenceHall".' });
    }

    // Validate that the review target exists
    if (reviewable_type === 'activity') {
      const activity = await Activity.findByPk(reviewable_id);
      if (!activity) return res.status(404).json({ error: 'Activity not found.' });
    } else if (reviewable_type === 'conferenceHall') {
      const hall = await ConferenceHall.findByPk(reviewable_id);
      if (!hall) return res.status(404).json({ error: 'Conference hall not found.' });
    }

    const review = await Review.create({
      user_id: req.user.id,
      reviewable_type,
      reviewable_id,
      rating,
      review_text
    });
    res.status(201).json({ message: 'Review created successfully.', review });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: 'An error occurred while creating the review.' });
  }
});

// Get reviews for a given activity or conference hall
// Expects query parameters: type and id, for example:
// GET /api/reviews?type=activity&id=1
router.get('/', async (req, res) => {
  try {
    const { type, id } = req.query;
    if (!type || !id) {
      return res.status(400).json({ error: 'Query parameters "type" and "id" are required.' });
    }
    if (!['activity', 'conferenceHall'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type. Must be "activity" or "conferenceHall".' });
    }
    const reviews = await Review.findAll({
      where: {
        reviewable_type: type,
        reviewable_id: id
      },
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: 'An error occurred while fetching reviews.' });
  }
});

// Update a review (only the owner can update)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { rating, review_text } = req.body;
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found.' });
    }
    if (review.user_id !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to update this review.' });
    }
    if (rating) review.rating = rating;
    if (review_text) review.review_text = review_text;
    await review.save();
    res.json({ message: 'Review updated successfully.', review });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: 'An error occurred while updating the review.' });
  }
});

// Delete a review (only the owner can delete)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found.' });
    }
    if (review.user_id !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this review.' });
    }
    await review.destroy();
    res.json({ message: 'Review deleted successfully.' });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: 'An error occurred while deleting the review.' });
  }
});

module.exports = router;
