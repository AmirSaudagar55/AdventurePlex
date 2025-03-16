// src/pages/ConferenceHallBookingStepper.jsx
import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

// --- Step Components ---
// Step 1: Confirm Conference Hall Details
function Step1ConfirmHall({ hall, onNext }) {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Confirm Conference Hall Details</h2>
      <div className="border p-4 rounded-md flex flex-col sm:flex-row items-center">
        <img
          src={hall.image_url}
          alt={hall.name}
          className="w-32 h-32 object-cover rounded-md mr-0 sm:mr-4 mb-4 sm:mb-0"
        />
        <div>
          <h3 className="text-xl font-semibold">{hall.name}</h3>
          <p className="text-gray-600">{hall.description}</p>
          <p className="mt-2">
            <strong>Capacity:</strong> {hall.capacity}
          </p>
          <p className="mt-1">
            <strong>Floor:</strong> {hall.floorNumber}
          </p>
          <p className="mt-1">
            <strong>Price per Minute:</strong> ₹{hall.pricePerMin}
          </p>
          <p className="mt-1">
            <strong>Location:</strong> {hall.location}
          </p>
          {hall.features && (
            <div className="mt-2">
              <strong>Features:</strong>
              <ul className="list-disc ml-5">
                {Object.entries(hall.features).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value.toString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={onNext}
        className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md"
      >
        Continue
      </button>
    </div>
  );
}

// Step 2: Select Date, Start & End Time
function Step2TimeSelection({ onNext, onBack, setTimeDetails }) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:30");
  const [error, setError] = useState("");

  const handleNext = () => {
    const start = new Date(`${date}T${startTime}:00`);
    const end = new Date(`${date}T${endTime}:00`);
    const diff = (end - start) / 60000; // duration in minutes
    if (diff < 25) {
      setError("Meeting duration must be at least 25 minutes.");
      return;
    }
    setError("");
    setTimeDetails({ date, startTime, endTime, duration: diff });
    onNext();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Select Date & Time</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Date</label>
        <input
          type="date"
          value={date}
          min={today}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-md p-2 w-full"
        />
      </div>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border rounded-md p-2 w-full"
          />
        </div>
      </div>
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// Step 3: Basic & Meeting Details
function Step3BasicDetails({ onNext, onBack, setBasicDetails }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [meetingName, setMeetingName] = useState("");
  const [meetingDesc, setMeetingDesc] = useState("");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!name || !email || !meetingName) {
      setError("Name, Email, and Meeting Name are required.");
      return;
    }
    setError("");
    setBasicDetails({ name, email, meetingName, meetingDesc });
    onNext();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Basic & Meeting Details</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Your Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="border rounded-md p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="border rounded-md p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Meeting Name</label>
        <input
          type="text"
          value={meetingName}
          onChange={(e) => setMeetingName(e.target.value)}
          placeholder="Enter meeting name"
          className="border rounded-md p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Meeting Description</label>
        <textarea
          value={meetingDesc}
          onChange={(e) => setMeetingDesc(e.target.value)}
          placeholder="Brief description of the meeting"
          className="border rounded-md p-2 w-full"
        />
      </div>
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// Step 4: Review Booking Details
function Step4Review({ hall, timeDetails, basicDetails, onNext, onBack }) {
  const totalDuration = timeDetails.duration;
  const totalPrice = Number(hall.pricePerMin) * totalDuration;
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Review Booking Details</h2>
      <div className="border p-4 rounded-md mb-4">
        <h3 className="font-semibold text-lg">Conference Hall</h3>
        <p>{hall.name}</p>
        <p>{hall.description}</p>
        <p>
          <strong>Location:</strong> {hall.location}
        </p>
        <p>
          <strong>Price per Minute:</strong> ₹{hall.pricePerMin}
        </p>
      </div>
      <div className="border p-4 rounded-md mb-4">
        <h3 className="font-semibold text-lg">Time Details</h3>
        <p>
          <strong>Date:</strong> {timeDetails.date}
        </p>
        <p>
          <strong>Start Time:</strong> {timeDetails.startTime}
        </p>
        <p>
          <strong>End Time:</strong> {timeDetails.endTime}
        </p>
        <p>
          <strong>Duration:</strong> {totalDuration} minutes
        </p>
      </div>
      <div className="border p-4 rounded-md mb-4">
        <h3 className="font-semibold text-lg">Meeting Details</h3>
        <p>
          <strong>Your Name:</strong> {basicDetails.name}
        </p>
        <p>
          <strong>Email:</strong> {basicDetails.email}
        </p>
        <p>
          <strong>Meeting Name:</strong> {basicDetails.meetingName}
        </p>
        <p>
          <strong>Description:</strong> {basicDetails.meetingDesc}
        </p>
      </div>
      <div className="border p-4 rounded-md mb-4">
        <h3 className="font-semibold text-lg">Price</h3>
        <p>
          <strong>Total Duration:</strong> {totalDuration} minutes
        </p>
        <p>
          <strong>Total Price:</strong> ₹{totalPrice}
        </p>
      </div>
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}

// Step 5: Payment – see updated Step5Payment component above (imported below)
import Step5Payment from "./Step5Payment";

// Step 6: QR Code & Confirmation
function Step6QRCode({ booking, onNext, onBack }) {
  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Booking Confirmed</h2>
      <div className="border p-4 rounded-md mb-4 inline-block">
        <p className="mb-2">QR Code:</p>
        <div className="w-32 h-32 bg-gray-300 flex items-center justify-center">
          <span className="text-gray-700">[QR]</span>
        </div>
      </div>
      <p className="mb-4 text-gray-700">
        Your booking details and QR code have been sent to your email.
      </p>
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md"
        >
          Finish
        </button>
      </div>
    </div>
  );
}

// Step 7: Completion
function Step7Complete({ onReset }) {
  return (
    <div className="p-4 text-center">
      <h2 className="text-3xl font-bold mb-4">Booking Successful!</h2>
      <p className="text-gray-700 mb-6">
        Thank you for booking the conference hall. Enjoy your meeting!
      </p>
      <button
        onClick={onReset}
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
      >
        Go to Home
      </button>
    </div>
  );
}

// Main Conference Hall Booking Stepper Component
export default function ConferenceHallBookingStepper() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hall } = location.state || {};
  if (!hall) {
    navigate("/book");
    return null;
  }

  const steps = [
    "Conference Hall Details",
    "Select Date & Time",
    "Basic & Meeting Details",
    "Review Booking",
    "Payment",
    "QR & Confirmation",
    "Complete",
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const [timeDetails, setTimeDetails] = useState(null);
  const [basicDetails, setBasicDetails] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  const handleReset = () => {
    navigate("/");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ConfirmHall hall={hall} onNext={() => setCurrentStep(2)} />;
      case 2:
        return (
          <Step2TimeSelection
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
            setTimeDetails={setTimeDetails}
          />
        );
      case 3:
        return (
          <Step3BasicDetails
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
            setBasicDetails={setBasicDetails}
          />
        );
      case 4:
        return (
          <Step4Review
            hall={hall}
            timeDetails={timeDetails}
            basicDetails={basicDetails}
            onNext={() => setCurrentStep(5)}
            onBack={() => setCurrentStep(3)}
          />
        );
      case 5:
        return (
          <Step5Payment
            hall={hall}
            timeDetails={timeDetails}
            onNext={(booking) => {
              setBookingData(booking);
              setCurrentStep(6);
            }}
            onBack={() => setCurrentStep(4)}
          />
        );
      case 6:
        return (
          <Step6QRCode
            booking={bookingData}
            onNext={() => setCurrentStep(7)}
            onBack={() => setCurrentStep(5)}
          />
        );
      case 7:
        return <Step7Complete onReset={handleReset} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Link to="/book" className="ml-4 mb-4 inline-flex items-center text-indigo-600 hover:text-indigo-500">
        <ArrowLeft className="mr-2 h-5 w-5" /> Back to Booking
      </Link>
      <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row gap-6">
        {/* Left Column: Stepper */}
        <div className="md:w-3/4 space-y-4">
          {steps.map((stepLabel, idx) => {
            const stepIndex = idx + 1;
            const isActive = currentStep === stepIndex;
            const isCompleted = currentStep > stepIndex;
            return (
              <div key={stepIndex} className="bg-white border rounded shadow p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">{stepLabel}</h2>
                  {isCompleted && !isActive && (
                    <button
                      className="text-indigo-600 hover:underline text-sm"
                      onClick={() => setCurrentStep(stepIndex)}
                    >
                      EDIT
                    </button>
                  )}
                </div>
                {isActive ? (
                  <div className="mt-4">{renderStep()}</div>
                ) : isCompleted ? (
                  <div className="mt-2 text-sm text-green-600">Completed</div>
                ) : (
                  <div className="mt-2 text-sm text-gray-500">
                    Please complete previous steps first
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Real-time Price Details (sticky on desktop) */}
        <div className="hidden md:block md:w-1/4 sticky top-4 self-start">
          <div className="bg-white border rounded shadow p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">PRICE DETAILS</h3>
            {timeDetails ? (
              <div className="text-gray-700 text-sm space-y-1">
                <p>
                  <strong>Duration:</strong> {timeDetails.duration} mins
                </p>
                <p>
                  <strong>Price per Minute:</strong> ₹{hall.pricePerMin}
                </p>
                <p>
                  <strong>Total Price:</strong>{" "}
                  {timeDetails && hall.pricePerMin
                    ? `₹${Number(hall.pricePerMin) * timeDetails.duration}`
                    : "N/A"}
                </p>
              </div>
            ) : (
              <p className="text-gray-700 text-sm">
                Select date & time to see price details.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
