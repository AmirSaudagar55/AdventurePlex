// routes/conferenceHallRoutes/conferenceHallRoutes.js
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const ConferenceHall = require('../../models/ConferenceHallModels/ConferenceHall');
const ConferenceHallBooking = require('../../models/ConferenceHallModels/ConferenceHallBooking');
const ConferenceHallImage = require('../../models/ConferenceHallModels/ConferenceHallImage');
const Category = require('../../models/Category');
const { authenticate } = require('../../middlewares/authMiddleware');

// Require the QR code and email service libraries
const QRCode = require('qrcode');
const { sendMail } = require('../../services/emailService');



// Add this endpoint to return conference hall bookings for the authenticated user
router.get('/user-bookings', authenticate, async (req, res) => {
  try {
    const bookings = await ConferenceHallBooking.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: ConferenceHall,
          attributes: ['name', 'location', 'pricePerMin', 'image_url']
        }
      ]
    });
    console.log(`Bookings of conference Hall ${bookings}`);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching conference hall bookings:', error);
    res.status(500).json({ error: error.message });
  }
});

// NEW: Get images for a specific conference hall (for carousel)
router.get('/:id/images', async (req, res) => {
  try {
    const images = await ConferenceHallImage.findAll({
      where: { conferenceHallId: req.params.id },
      attributes: ['imageUrl']
    });
    if (!images.length) {
      console.log("No image found");
      return res.status(404).json({ error: 'No images found for this conference hall' });
    }
    console.log(images);
    res.json(images);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Get conference hall details by ID
router.get('/:id', async (req, res) => {
  try {
    const hall = await ConferenceHall.findByPk(req.params.id, {
      include: [
        {
          model: ConferenceHallImage,
          as: 'images',
          attributes: ['imageUrl']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['name', 'description']
        }
      ]
    });
    if (!hall) {
      console.log('Conference hall not found');
      return res.status(404).json({ error: 'Conference hall not found' });
    }
    console.log(hall);
    res.json(hall);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// <<== UPDATED: Get all available conference halls with optional filters ==>>
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    // Start with the required available filter
    const filters = { available: true };

    // If a search term is provided, filter by name using LIKE operator.
    if (search) {
      filters.name = { [Op.like]: `%${search}%` };
    }

    // If a category is provided, add it to filters.
    if (category) {
      filters.category_id = category;
    }

    const halls = await ConferenceHall.findAll({ where: filters });
    console.log(halls);
    res.json(halls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/book', authenticate, async (req, res) => {
  try {
    const hallId = req.params.id;
    const { bookingDate, startTime, endTime } = req.body;
    
    // Validate required fields
    if (!bookingDate || !startTime || !endTime) {
      return res.status(400).json({ error: 'Booking date, start time, and end time are required.' });
    }
    
    // Check that the booking date is not in the past.
    const now = new Date();
    const bookingDateObj = new Date(bookingDate);
    if (bookingDateObj < new Date(now.toDateString())) {
      return res.status(400).json({ error: 'Booking date cannot be in the past.' });
    }
    
    // Validate time ordering.
    if (startTime >= endTime) {
      return res.status(400).json({ error: 'Start time must be before end time.' });
    }
    
    // Check if the conference hall exists.
    const hall = await ConferenceHall.findByPk(hallId);
    if (!hall) {
      return res.status(404).json({ error: 'Conference hall not found.' });
    }
    
    // Check for overlapping bookings for this hall on the same date.
    const overlappingBooking = await ConferenceHallBooking.findOne({
      where: {
        conferenceHallId: hallId,
        bookingDate,
        [Op.or]: [
          { startTime: { [Op.lt]: endTime, [Op.gte]: startTime } },
          { endTime: { [Op.lte]: endTime, [Op.gt]: startTime } },
          { startTime: { [Op.lte]: startTime }, endTime: { [Op.gte]: endTime } }
        ]
      }
    });
    
    if (overlappingBooking) {
      return res.status(400).json({ error: 'The conference hall is already booked for the selected time slot.' });
    }
    
    // Calculate duration in hours and total price.
    const start = new Date(`1970-01-01T${startTime}Z`);
    const end = new Date(`1970-01-01T${endTime}Z`);
    const durationInHours = (end - start) / (1000 * 60 * 60);
    const totalPrice = hall.pricePerMin * durationInHours * 60; // pricePerMin is per minute
    
    // Create the booking with pending payment status.
    const booking = await ConferenceHallBooking.create({
      conferenceHallId: hallId,
      userId: req.user.id,
      bookingDate,
      startTime,
      endTime,
      totalPrice,
      status: 'pending',       // not confirmed until payment is done
      payment_status: 'pending'
    });
    
    res.status(201).json({ message: 'Booking created, pending payment.', booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'An error occurred while creating the booking' });
  }
});

// Get all bookings for a specific conference hall (requires authentication)
router.get('/:id/bookings', authenticate, async (req, res) => {
  try {
    const hallId = req.params.id;
    const bookings = await ConferenceHallBooking.findAll({
      where: { conferenceHallId: hallId }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/bookings/:bookingId', authenticate, async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await ConferenceHallBooking.findOne({
      where: { id: bookingId, userId: req.user.id }
    });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or unauthorized.' });
    }
    // Delete the booking record (similar to activity bookings cancellation)
    await booking.destroy();
    res.json({ message: 'Booking cancelled successfully.' });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;