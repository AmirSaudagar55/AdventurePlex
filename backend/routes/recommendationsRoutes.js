const express = require('express');
const axios = require('axios');
const Activity = require('../models/Activity'); // Adjust path if needed
const router = express.Router();

// URL of your external recommendation service (Flask + ngrok)
const RECOMMENDER_URL = "https://b22d-34-125-62-227.ngrok-free.app";

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    // Call the external recommendation API
    const recResponse = await axios.get(`${RECOMMENDER_URL}/recommendations/${userId}`);
    // Expected response structure:
    // { recommendations: [ [activityId, predictedRating], ... ] }
    const recData = recResponse.data;
    if (!recData || !recData.recommendations) {
      return res.status(500).json({ error: "Invalid response from recommendation service" });
    }
    // Extract activity IDs from recommendations
    const activityIds = recData.recommendations.map(rec => rec[0]);

    // Query the database to get details for these activities
    const activities = await Activity.findAll({
      where: { id: activityIds }
    });

    // To return the activities in the same order as recommended, build a lookup map:
    const activityMap = {};
    activities.forEach(activity => {
      activityMap[activity.id] = activity;
    });
    const sortedActivities = activityIds.map(id => activityMap[id]).filter(a => a);

    res.json({ recommendations: sortedActivities });
  } catch (error) {
    console.error("Error in recommendations route:", error.message);
    res.status(500).json({ error: "Failed to get recommendations" });
  }
});

module.exports = router;
