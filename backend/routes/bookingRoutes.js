const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Activity = require('../models/Activity');
const BookingParticipant = require('../models/BookingParticipant');
const { authenticate } = require('../middlewares/authMiddleware');
const { sendMail } = require('../services/emailService');
const { generateQRCode } = require('../services/qrService');


// ✅ Create a booking (check activity existence, availability, and slot availability)
router.post('/', authenticate, async (req, res) => {
    try {
      // Destructure basic booking details and participants info from request body
      const {
        activity_id,
        booking_date,
        start_time,
        end_time,
        participants,
        total_price,
        public_booking,
        participants_info // array of group member details
      } = req.body;
      
      if (!activity_id || !booking_date || !start_time || !end_time || !participants || !total_price) {
        return res.status(400).json({ error: 'Missing required booking details' });
      }
      
      // Check if group member details array is provided and matches the participants count
      if (!participants_info || participants_info.length !== Number(participants)) {
        return res.status(400).json({ error: 'Group member details are incomplete or do not match the number of participants' });
      }
      
      const user_id = req.user.id;
      
      // Verify that the activity exists and is available for booking
      const activity = await Activity.findByPk(activity_id);
      if (!activity) {
        return res.status(404).json({ error: 'Activity not found' });
      }
      if (!activity.available) {
        return res.status(400).json({ error: 'Activity is not available for booking' });
      }
      
      // (Optional) Check if the booking falls within operating hours (8:00 am - 8:00 pm)
      const openingTime = '08:00:00';
      const closingTime = '20:00:00';
      if (start_time < openingTime || end_time > closingTime) {
        return res.status(400).json({ error: 'Booking time must be between 8:00 am and 8:00 pm' });
      }
      
      // Check if a booking already exists for the same activity at the same date and overlapping time range.
      const existingBooking = await Booking.findOne({
        where: { 
          activity_id, 
          booking_date,
          // A simple overlapping time check (adjust as needed for your business logic):
          start_time
        }
      });
      if (existingBooking) {
        return res.status(400).json({ error: 'Slot already booked for the selected date and time' });
      }
      
      // Create the booking record
      const booking = await Booking.create({
        user_id,
        activity_id,
        booking_date,
        start_time,
        end_time,
        participants,
        total_price,
        public_booking: public_booking || false
      });
      
      // Create BookingParticipant records
      const bookingParticipants = await Promise.all(
        participants_info.map(info =>
          BookingParticipant.create({
            booking_id: booking.id,
            full_name: info.full_name,
            gender: info.gender,
            address: info.address,
            dob: info.dob
          })
        )
      );
      
      // Generate QR code data (including complete user information)
      const qrData = JSON.stringify({
        booking_id: booking.id,
        activity: activity.name,
        booking_date,
        start_time,
        end_time,
        total_price,
        participants,
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email
          // Include additional user fields as needed
        }
      });
      const qrCodeImage = await generateQRCode(qrData);
      
      // Extract base64 data from the data URL
      const base64Data = qrCodeImage.split('base64,')[1];
      const qrBuffer = Buffer.from(base64Data, 'base64');
      
      // Construct a beautiful HTML email referencing the inline QR code via its cid
      const emailHtml = `
        <h2>Booking Confirmation</h2>
        <p>Dear ${req.user.name || 'User'},</p>
        <p>Your booking for <strong>${activity.name}</strong> on <strong>${booking_date}</strong> from <strong>${start_time}</strong> to <strong>${end_time}</strong> has been confirmed.</p>
        <p>Total Price: <strong>$${total_price}</strong></p>
        <p>Participants: <strong>${participants}</strong></p>
        <p>Please present the following QR code at the venue for verification:</p>
        <img src="cid:qrCode" alt="QR Code">
        <p>We look forward to welcoming you!</p>
        <p>Thank you for booking with us.</p>
      `;

    //!! Want to send emails after completion of complete !!
      
    //   // Send confirmation email with the QR code as an inline attachment
    //   try {
    //     await sendMail(req.user.email, 'Booking Confirmation', emailHtml, [
    //       {
    //         filename: 'qr.png',
    //         content: qrBuffer,
    //         cid: 'qrCode'
    //       }
    //     ]);
    //   } catch (emailError) {
    //     console.error('Error sending confirmation email:', emailError);
    //     // Optionally log the error and continue—booking is already successful.
    //   }
      
      res.status(201).json({ message: 'Booking successful', booking, bookingParticipants });
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
                attributes: ['name']
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
      
      // Delete all associated BookingParticipant records first
      await BookingParticipant.destroy({ where: { booking_id: booking.id } });
      
      // Now delete the booking
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
