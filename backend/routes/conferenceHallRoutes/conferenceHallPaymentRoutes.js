// routes/conferenceHallPaymentRoutes.js
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { authenticate } = require('../../middlewares/authMiddleware');
const ConferenceHallBooking = require('../../models/ConferenceHallModels/ConferenceHallBooking');
// Import ConferenceHall model to fetch hall details for email content.
const ConferenceHall = require('../../models/ConferenceHallModels/ConferenceHall');

// Import QR code and email service libraries.
const QRCode = require('qrcode');
const { sendMail } = require('../../services/emailService');

// Initialize Razorpay instance using your environment variables.
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ➜ Create Razorpay Order for Conference Hall Booking
router.post('/create-order', authenticate, async (req, res) => {
  try {
    const { booking_id, amount } = req.body;
    if (!booking_id || !amount) {
      return res.status(400).json({ error: 'Missing booking_id or amount' });
    }
    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_conference_${booking_id}_${Date.now()}`,
      payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);
    // Update the conference hall booking record with the order id and set payment status to pending.
    await ConferenceHallBooking.update(
      { razorpay_order_id: order.id, payment_status: 'pending' },
      { where: { id: booking_id } }
    );
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// ➜ Verify Payment Signature for Conference Hall Booking and send confirmation email
router.post('/verify', authenticate, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !booking_id) {
      return res.status(400).json({ error: 'Missing required payment details' });
    }
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    if (expectedSignature === razorpay_signature) {
      // Update the booking payment status to 'paid'
      await ConferenceHallBooking.update(
        { payment_status: 'paid', status: 'confirmed' },
        { where: { id: booking_id } }
      );
      // Fetch the booking and conference hall details for confirmation email.
      const booking = await ConferenceHallBooking.findByPk(booking_id);
      const hall = await ConferenceHall.findByPk(booking.conferenceHallId);
      const bookingCode = booking.id.toString();
      const qrCodeDataURL = await QRCode.toDataURL(bookingCode);
      
    //   // Construct the confirmation email.
    //   const emailHtml = `
    //     <h2>Conference Hall Booking Confirmation</h2>
    //     <p>Dear ${req.user.name},</p>
    //     <p>Your booking for <strong>${hall.name}</strong> on <strong>${booking.bookingDate}</strong> from <strong>${booking.startTime}</strong> to <strong>${booking.endTime}</strong> has been confirmed.</p>
    //     <p>Your booking code is: <strong>${bookingCode}</strong></p>
    //     <p>Please find the attached QR code for authentication at the venue.</p>
    //     <p>Thank you for booking with us!</p>
    //   `;
      
    //   try {
    //     await sendMail(req.user.email, "Conference Hall Booking Confirmation", emailHtml, [
    //       {
    //         filename: 'qr.png',
    //         content: qrCodeDataURL.split('base64,')[1],
    //         encoding: 'base64',
    //         cid: 'qrCode'
    //       }
    //     ]);
    //   } catch (emailError) {
    //     console.error('Error sending confirmation email:', emailError);
    //     // Optionally, you may still return success.
    //   }
      res.json({ status: "success", bookingCode, qrCode: qrCodeDataURL });
    } else {
      res.status(400).json({ error: "Invalid signature" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
});

module.exports = router;
