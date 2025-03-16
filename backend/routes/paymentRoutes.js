// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { authenticate } = require('../middlewares/authMiddleware');
const Booking = require('../models/Booking');

// Initialize Razorpay instance using your credentials from environment variables.
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ➜ Create Razorpay Order
router.post('/create-order', authenticate, async (req, res) => {
  try {
    // Expecting booking_id and amount (in INR) from the request body.
    const { booking_id, amount } = req.body;
    if (!booking_id || !amount) {
      return res.status(400).json({ error: 'Missing booking_id or amount' });
    }

    // Convert INR to paise.
    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_order_${booking_id}_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    // Optionally update your booking record with the order id and mark payment as pending.
    await Booking.update(
      { razorpay_order_id: order.id, payment_status: 'pending' },
      { where: { id: booking_id } }
    );

    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// ➜ Verify Payment Signature
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
      // Update booking as paid and store the payment id.
      await Booking.update(
        { payment_status: 'paid', razorpay_payment_id },
        { where: { id: booking_id } }
      );
      res.json({ status: "success" });
    } else {
      res.status(400).json({ error: "Invalid signature" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
});

module.exports = router;
