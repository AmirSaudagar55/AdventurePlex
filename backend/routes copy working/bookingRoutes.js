const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Activity = require('../models/Activity');
const { authenticate } = require('../middlewares/authMiddleware');

// ✅ Create a booking (check activity existence, availability, and slot availability)
router.post('/', authenticate, async (req, res) => {
    try {
        // Destructure and validate required fields from the request body
        const { activity_id, booking_date, start_time, participants, total_price, public_booking } = req.body;
        if (!activity_id || !booking_date || !start_time || !participants || !total_price) {
            return res.status(400).json({ error: 'Missing required booking details' });
        }
        
        const user_id = req.user.id;
        
        // Verify that the activity exists and is available for booking
        const activity = await Activity.findByPk(activity_id);
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        if (activity.available === false) {
            return res.status(400).json({ error: 'Activity is not available for booking' });
        }
        
        // Check if the slot for the specified booking_date and start_time is already booked
        const existingBooking = await Booking.findOne({
            where: { activity_id, booking_date, start_time }
        });
        if (existingBooking) {
            return res.status(400).json({ error: 'Slot already booked for the selected date and time' });
        }
        
        // Create the booking. Status and public_booking have default values in the model if not provided.
        const booking = await Booking.create({
            user_id,
            activity_id,
            booking_date,
            start_time,
            participants,
            total_price,
            public_booking: public_booking || false
        });
        
        res.status(201).json({ message: 'Booking successful', booking });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'An error occurred while creating the booking' });
    }
});

// ✅ Get all bookings for the authenticated user, including activity details
router.get('/', authenticate, async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { user_id: req.user.id },
            include: [{
                model: Activity,
                attributes: ['name', 'location']
            }]
        });
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'An error occurred while retrieving bookings' });
    }
});

// ✅ Cancel a booking (users can only cancel their own bookings)
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        if (booking.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to cancel this booking' });
        }
        await booking.destroy();
        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ error: 'An error occurred while cancelling the booking' });
    }
});

// ✅ Check available slots for an activity
// Optionally filter by booking_date (?booking_date=YYYY-MM-DD)
router.get('/activities/:id/available-slots', async (req, res) => {
    try {
        const { id } = req.params;
        const { booking_date } = req.query;
        
        // Build the filter criteria
        const whereClause = { activity_id: id };
        if (booking_date) {
            whereClause.booking_date = booking_date;
        }
        
        // Retrieve booked slots using the correct field name "start_time"
        const bookedSlots = await Booking.findAll({
            where: whereClause,
            attributes: ['booking_date', 'start_time']
        });
        
        res.json({
            bookedSlots: bookedSlots.map(slot => ({
                booking_date: slot.booking_date,
                start_time: slot.start_time
            }))
        });
    } catch (error) {
        console.error('Error fetching available slots:', error);
        res.status(500).json({ error: 'An error occurred while fetching available slots' });
    }
});

module.exports = router;
