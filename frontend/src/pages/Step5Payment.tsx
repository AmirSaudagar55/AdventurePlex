// src/pages/Step5Payment.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ConferenceHallPaymentHandler from "../components/ConferenceHallPaymentHandler";

export default function Step5Payment({ hall, timeDetails, onNext, onBack }) {
  const { user } = useContext(AuthContext);
  
  // Prepare bookingData required by the payment handler.
  const bookingData = {
    hallId: hall.id,
    bookingDate: timeDetails.date,       // Expected in YYYY-MM-DD format
    startTime: timeDetails.startTime,      // e.g. "10:00:00"
    endTime: timeDetails.endTime,          // e.g. "12:00:00"
    // Calculate total price from hall.pricePerMin and the duration in minutes
    totalPrice: Number(hall.pricePerMin) * timeDetails.duration,
    userName: user.name,
    userEmail: user.email,
  };

  // Set your backend URL appropriately.
  const backendURL =
    "https://5000-idx-adventureplex-1739096860464.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev";

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>
      <div className="border p-4 rounded-md mb-4 bg-gray-50">
        <p className="text-gray-700">
          Please complete your payment securely using Razorpay.
        </p>
      </div>
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md"
        >
          Back
        </button>
        <ConferenceHallPaymentHandler
          bookingData={bookingData}
          backendURL={backendURL}
          // Pass the verification data to onNext so that later steps can use it
          onPaymentSuccess={(verifyData) => onNext(verifyData)}
        />
      </div>
    </div>
  );
}
