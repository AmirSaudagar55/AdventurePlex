// src/components/PaymentHandler.tsx
import React from "react";
import { toast } from "react-toastify";
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";

interface PaymentHandlerProps {
  bookingData: any;
  backendURL: string;
  onPaymentSuccess: () => void;
  onPaymentFailure?: (error: string) => void;
}

const PaymentHandler: React.FC<PaymentHandlerProps> = ({
  bookingData,
  backendURL,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  // Helper functions to show toasts with icons and Tailwind styling
  const showSuccess = (message: string) => {
    toast.success(message, {
      icon: <FaCheckCircle className="text-green-500" />,
      className: "bg-green-100 text-green-800 font-semibold rounded shadow-md",
      position: "top-center", // Use string literal instead of toast.POSITION.TOP_CENTER
      autoClose: 3000,
    });
  };

  const showError = (message: string) => {
    toast.error(message, {
      icon: <FaExclamationTriangle className="text-red-500" />,
      className: "bg-red-100 text-red-800 font-semibold rounded shadow-md",
      position: "top-center", // Use string literal instead of toast.POSITION.TOP_CENTER
      autoClose: 3000,
    });
  };

  const showInfo = (message: string) => {
    toast.info(message, {
      icon: <FaInfoCircle className="text-blue-500" />,
      className: "bg-blue-100 text-blue-800 font-semibold rounded shadow-md",
      position: "top-center", // Use string literal instead of toast.POSITION.TOP_CENTER
      autoClose: 3000,
    });
  };

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showError("Please log in to complete your booking.");
        return;
      }
      
      // 1. Create the booking on your backend.
      const bookingResponse = await fetch(`${backendURL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });
      const bookingResult = await bookingResponse.json();
      if (!bookingResponse.ok) {
        showError(bookingResult.error || "Booking creation failed.");
        return;
      }
      const bookingId = bookingResult.booking.id;
      const amount = parseFloat(bookingData.total_price); // Amount in INR
      
      // 2. Create a Razorpay order.
      const orderResponse = await fetch(`${backendURL}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ booking_id: bookingId, amount }),
      });
      const orderData = await orderResponse.json();
      if (!orderResponse.ok) {
        showError(orderData.error || "Failed to create payment order.");
        // If order creation fails, cancel the booking.
        await cancelBooking(bookingId, token);
        return;
      }
      
      // 3. Configure Razorpay options and open the checkout modal.
      const options = {
        key: import.meta.env.REACT_APP_RAZORPAY_KEY_ID, // from your .env file
        amount: orderData.amount, // in paise
        currency: orderData.currency,
        name: "AdventurePlex",
        description: "Booking Payment",
        order_id: orderData.id,
        handler: async (response: any) => {
          // 4. Verify payment details on your backend.
          const verifyResponse = await fetch(`${backendURL}/api/payment/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              booking_id: bookingId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyResponse.json();
          if (verifyResponse.ok && verifyData.status === "success") {
            showSuccess("Payment successful! Your booking is confirmed.");
            onPaymentSuccess();
          } else {
            // If payment verification fails, cancel the booking.
            await cancelBooking(bookingId, token);
            showError("Payment verification failed. Your booking has been cancelled.");
            if (onPaymentFailure) onPaymentFailure("Payment verification failed.");
          }
        },
        modal: {
          ondismiss: async function () {
            // If user dismisses the checkout modal, cancel the booking.
            await cancelBooking(bookingId, token);
            showInfo("Payment was cancelled. Your booking has been removed.");
            if (onPaymentFailure) onPaymentFailure("Payment cancelled.");
          },
        },
        prefill: {
          name: bookingData.participants_info[0].full_name,
          email: "customer@example.com", // Replace with actual email if available
          contact: "",
        },
        theme: {
          color: "#F37254",
        },
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      showError("An error occurred during payment. Please try again.");
      if (onPaymentFailure) onPaymentFailure("Payment error occurred.");
    }
  };

  // Helper function to cancel a booking using the DELETE endpoint.
  const cancelBooking = async (bookingId: string, token: string) => {
    try {
      const deleteResponse = await fetch(`${backendURL}/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!deleteResponse.ok) {
        console.error("Failed to cancel booking:", await deleteResponse.json());
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-colors duration-300"
    >
      Pay Now
    </button>
  );
};

export default PaymentHandler;
