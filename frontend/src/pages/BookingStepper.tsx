// src/pages/BookingStepper.tsx
import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PaymentHandler from "../components/PaymentHandler";


// Helper to compute overall start/end times from slots
function computeTimeRange(
  slots: string[],
  duration: number
): { start_time: string; end_time: string } {
  if (!slots.length) {
    return { start_time: "", end_time: "" };
  }
  const sorted = [...slots].sort(); // sort slots (assumes "HH:MM" format)
  const start = sorted[0];
  const end = sorted[sorted.length - 1];
  // Convert HH:MM to minutes
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  const startTotal = startH * 60 + startM;
  const endTotal = endH * 60 + endM + duration; // end time = latest slot + duration
  const formatTime = (total: number) => {
    const hrs = Math.floor(total / 60).toString().padStart(2, "0");
    const mins = (total % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:00`;
  };
  return { start_time: formatTime(startTotal), end_time: formatTime(endTotal) };
}

// -------------------------------------------------
// Step 1: Confirm the Activity
// -------------------------------------------------
function Step1Confirm({
  activity,
  onNext,
}: {
  activity: any;
  onNext: () => void;
}) {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Confirm Activity</h2>
      <div className="border p-4 rounded-md flex items-center">
        <img
          src={activity.image_url}
          alt={activity.name}
          className="w-32 h-32 object-cover rounded-md mr-4"
        />
        <div>
          <h3 className="text-xl font-semibold">{activity.name}</h3>
          <p className="text-gray-600">{activity.description}</p>
          <p className="mt-2">
            <strong>Duration:</strong> {activity.duration}{" "}
            {activity.duration_unit || "mins"}
          </p>
          <p className="mt-1">
            <strong>Price:</strong> {activity.price}
          </p>
        </div>
      </div>
      <button
        onClick={onNext}
        className="mt-6 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md"
      >
        Continue
      </button>
    </div>
  );
}

// -------------------------------------------------
// Step 2: Group Details Form
// -------------------------------------------------
function Step2GroupForm({
  maxMembers,
  onNext,
  onBack,
  setGroupDetails,
  user, // passed from AuthContext
}: {
  maxMembers: number;
  onNext: () => void;
  onBack: () => void;
  setGroupDetails: (details: any) => void;
  user: any;
}) {
  // Prepopulate member 1 with logged in user's name if available
  const [members, setMembers] = useState([
    { full_name: user?.name || "", gender: "", address: "", dob: "" },
  ]);
  const [count, setCount] = useState(1);
  const [error, setError] = useState("");

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setCount(value);
    const diff = value - members.length;
    if (diff > 0) {
      setMembers([
        ...members,
        ...Array(diff).fill({ full_name: "", gender: "", address: "", dob: "" }),
      ]);
    } else if (diff < 0) {
      setMembers(members.slice(0, value));
    }
  };

  const handleMemberChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...members];
    (updated[index] as any)[field] = value;
    setMembers(updated);
  };

  const handleNext = () => {
    // Validate required fields for each member
    for (let i = 0; i < members.length; i++) {
      const { full_name, gender, dob } = members[i];
      if (!full_name.trim() || !gender || !dob) {
        setError(`Please fill in all required fields for Member ${i + 1}`);
        return;
      }
    }
    setError("");
    setGroupDetails({ count, members });
    onNext();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Group Details</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Number of Group Members (Max: {maxMembers})
        </label>
        <input
          type="number"
          min="1"
          max={maxMembers}
          value={count}
          onChange={handleCountChange}
          className="border rounded-md p-2 w-full"
        />
      </div>
      {members.map((member, idx) => (
        <div key={idx} className="border p-4 rounded-md mb-4">
          <h3 className="font-semibold mb-2">Member {idx + 1}</h3>
          <div className="mb-2">
            <label className="block text-sm font-medium">Full Name*</label>
            <input
              type="text"
              value={member.full_name}
              onChange={(e) => handleMemberChange(idx, "full_name", e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Gender*</label>
            <select
              value={member.gender}
              onChange={(e) => handleMemberChange(idx, "gender", e.target.value)}
              className="border rounded-md p-2 w-full"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Address</label>
            <input
              type="text"
              value={member.address}
              onChange={(e) => handleMemberChange(idx, "address", e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Date of Birth*</label>
            <input
              type="date"
              value={member.dob}
              onChange={(e) => handleMemberChange(idx, "dob", e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </div>
        </div>
      ))}
      {error && <p className="text-red-500 mb-4">{error}</p>}
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

// -------------------------------------------------
// Step 3: Date & Time Selection (with frozen booked slots)
// -------------------------------------------------
function Step3TimeSelection({
  onNext,
  onBack,
  activity,
  setTimeDetails,
  tempSlots,
  setTempSlots,
  tempPeriod,
  setTempPeriod,
  selectedDate,
  setSelectedDate,
}: {
  onNext: () => void;
  onBack: () => void;
  activity: any;
  setTimeDetails: (details: any) => void;
  tempSlots: string[];
  setTempSlots: (slots: string[]) => void;
  tempPeriod: string;
  setTempPeriod: (period: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [error, setError] = useState("");

  // When period or selectedDate changes, generate slots and then remove booked slots
  useEffect(() => {
    if (!tempPeriod) {
      setAvailableSlots([]);
      return;
    }
    const newSlots = generateSlots(tempPeriod, activity.duration, selectedDate);
    // Fetch booked slots for the activity & date
    fetch(
      `https://5000-idx-adventureplex-1739096860464.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev/api/activities/${activity.id}/available-slots?booking_date=${selectedDate}`
    )
      .then((res) => res.json())
      .then((data) => {
        const booked = data.bookedSlots.map((slot: any) => slot.start_time);
        // Filter out slots that are booked
        const filtered = newSlots.filter((slot) => !booked.includes(slot));
        setAvailableSlots(filtered);
        // Also remove any tempSlots that are no longer available
        setTempSlots((prev) => prev.filter((slot) => filtered.includes(slot)));
      })
      .catch((err) => {
        console.error("Error fetching booked slots:", err);
        setAvailableSlots(newSlots); // fallback
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempPeriod, selectedDate]);

  // Helper: generate time slots (with past-time restriction)
  function generateSlots(
    period: string,
    duration: number,
    dateVal: string
  ): string[] {
    const now = new Date();
    const isToday = dateVal === today;

    let startHour, endHour;
    if (period === "Morning") {
      startHour = 8;
      endHour = 12;
    } else if (period === "Afternoon") {
      startHour = 12;
      endHour = 16;
    } else if (period === "Evening") {
      startHour = 16;
      endHour = 20;
    } else return [];

    const slots: string[] = [];
    let current = startHour * 60;
    const gap = 10;
    while (current + duration <= endHour * 60) {
      const hrs = Math.floor(current / 60);
      const mins = current % 60;
      const formatted = `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}`;
      // If date is today, skip past slots
      if (isToday) {
        const slotDate = new Date();
        slotDate.setHours(hrs, mins, 0, 0);
        if (slotDate <= now) {
          current += duration + gap;
          continue;
        }
      }
      slots.push(formatted);
      current += duration + gap;
    }
    return slots;
  }

  const handleNext = () => {
    if (selectedDate < today) {
      setError("Selected date cannot be in the past.");
      return;
    }
    if (!tempPeriod) {
      setError("Please select a period.");
      return;
    }
    if (tempSlots.length === 0) {
      setError("Please select at least one time slot.");
      return;
    }
    setError("");
    setTimeDetails({ date: selectedDate, period: tempPeriod, slots: tempSlots });
    onNext();
  };

  const toggleSlot = (slot: string) => {
    if (tempSlots.includes(slot)) {
      setTempSlots(tempSlots.filter((s) => s !== slot));
    } else {
      setTempSlots([...tempSlots, slot]);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Select Date & Time</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          min={today}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded-md p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Period</label>
        <select
          value={tempPeriod}
          onChange={(e) => setTempPeriod(e.target.value)}
          className="border rounded-md p-2 w-full"
        >
          <option value="">Select Period</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
        </select>
      </div>
      {availableSlots.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 font-medium">Available Time Slots:</p>
          <div className="grid grid-cols-3 gap-2">
            {availableSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => toggleSlot(slot)}
                className={`border rounded-md px-3 py-2 text-sm ${
                  tempSlots.includes(slot)
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}
      {error && <p className="text-red-500 mb-4">{error}</p>}
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

// -------------------------------------------------
// Step 4: Review Booking Details (Includes Price Details)
// -------------------------------------------------
function Step4Review({
  activity,
  groupDetails,
  timeDetails,
  priceDetails,
  onNext,
  onBack,
}: {
  activity: any;
  groupDetails: any;
  timeDetails: any;
  priceDetails: {
    basePrice: number;
    totalSlots: number;
    totalDuration: number;
    totalPrice: number;
  };
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Review Booking Details</h2>
      <div className="border p-4 rounded-md mb-4">
        <h3 className="font-semibold text-lg">Activity</h3>
        <p>{activity.name}</p>
        <p>{activity.description}</p>
      </div>
      <div className="border p-4 rounded-md mb-4">
        <h3 className="font-semibold text-lg">Group Details</h3>
        <p>
          <strong>Number of Members:</strong> {groupDetails.count}
        </p>
        {groupDetails.members.map((member: any, idx: number) => (
          <div key={idx} className="mt-2">
            <p>
              <strong>Member {idx + 1}:</strong>
            </p>
            <p>Name: {member.full_name}</p>
            <p>Gender: {member.gender}</p>
            <p>Address: {member.address}</p>
            <p>DOB: {member.dob}</p>
          </div>
        ))}
      </div>
      <div className="border p-4 rounded-md mb-4">
        <h3 className="font-semibold text-lg">Time Details</h3>
        <p>
          <strong>Date:</strong> {timeDetails.date}
        </p>
        <p>
          <strong>Period:</strong> {timeDetails.period}
        </p>
        <p>
          <strong>Selected Slots:</strong> {timeDetails.slots.join(", ")}
        </p>
      </div>
      <div className="border p-4 rounded-md mb-4">
        <h3 className="font-semibold text-lg">Price Details</h3>
        <p>
          <strong>Base Price (per slot):</strong> ₹{priceDetails.basePrice}
        </p>
        <p>
          <strong>Total Slots Selected:</strong> {priceDetails.totalSlots}
        </p>
        <p>
          <strong>Total Duration:</strong> {priceDetails.totalDuration} mins
        </p>
        <p>
          <strong>Total Price:</strong> ₹{priceDetails.totalPrice}
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
          Confirm & Proceed to Payment
        </button>
      </div>
    </div>
  );
}

// -------------------------------------------------
// Step 5: Payment (Simulated & Booking Creation)
// -------------------------------------------------
function Step5Payment({
  onNext,
  onBack,
  bookingData,
}: {
  onNext: () => void;
  onBack: () => void;
  bookingData: any;
}) {
  const backendURL =
    "https://5000-idx-adventureplex-1739096860464.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev"; // Replace with your actual backend URL

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>
      <div className="border p-4 rounded-md mb-4">
        <p className="text-gray-700">Please complete your payment using Razorpay.</p>
      </div>
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
        >
          Back
        </button>
        <PaymentHandler
          bookingData={bookingData}
          backendURL={backendURL}
          onPaymentSuccess={onNext}
        />
      </div>
    </div>
  );
}


// -------------------------------------------------
// Step 6: Booking Complete
// -------------------------------------------------
function Step6Complete({ onReset }: { onReset: () => void }) {
  return (
    <div className="p-4 text-center">
      <h2 className="text-3xl font-bold mb-4">Booking Complete!</h2>
      <p className="text-gray-700 mb-6">
        Thank you for booking with AdventurePlex. Enjoy your adventure!
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

// -------------------------------------------------
// Main Booking Stepper Component
// -------------------------------------------------
export default function BookingStepper() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activity } = location.state || {};
  const { user } = useContext(AuthContext);

  if (!activity) {
    navigate("/book");
    return null;
  }

  // Steps management
  const [currentStep, setCurrentStep] = useState(1);
  // Data from steps
  const [groupDetails, setGroupDetails] = useState<any>(null);
  const [timeDetails, setTimeDetails] = useState<any>(null);
  // For real-time slot selection in Step 3
  const [tempSlots, setTempSlots] = useState<string[]>([]);
  const [tempPeriod, setTempPeriod] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Price calculation
  const basePrice = Number(activity.price.replace(/\D+/g, "")) || 0;
  const totalSlots = tempSlots.length;
  const totalDuration = activity.duration * totalSlots;
  let totalPrice = 0;
  if (groupDetails) {
    totalPrice = activity.will_price_remain_same_for_whole_group
      ? basePrice * (timeDetails ? timeDetails.slots.length : totalSlots)
      : basePrice * (timeDetails ? timeDetails.slots.length : totalSlots) * groupDetails.count;
  }

  const finalSlots = timeDetails ? timeDetails.slots : tempSlots;
  const timeRange =
    finalSlots.length > 0
      ? computeTimeRange(finalSlots, activity.duration)
      : { start_time: "", end_time: "" };

  // Prepare booking data for backend
  const bookingData =
    groupDetails && timeDetails
      ? {
          activity_id: activity.id,
          booking_date: timeDetails.date,
          start_time: timeRange.start_time,
          end_time: timeRange.end_time,
          participants: groupDetails.count,
          total_price: activity.will_price_remain_same_for_whole_group
            ? basePrice * timeDetails.slots.length
            : basePrice * timeDetails.slots.length * groupDetails.count,
          public_booking: false,
          participants_info: groupDetails.members,
        }
      : null;

  const steps = [
    "Confirm Activity",
    "Group Details",
    "Select Date & Time",
    "Review Details",
    "Payment",
    "Complete",
  ];

  const handleReset = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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
                  <div className="mt-4">
                    {stepIndex === 1 && (
                      <Step1Confirm
                        activity={activity}
                        onNext={() => setCurrentStep(2)}
                      />
                    )}
                    {stepIndex === 2 && (
                      <Step2GroupForm
                        maxMembers={activity.maximum_group_members_allowed}
                        onNext={() => setCurrentStep(3)}
                        onBack={() => setCurrentStep(1)}
                        setGroupDetails={setGroupDetails}
                        user={user}
                      />
                    )}
                    {stepIndex === 3 && (
                      <Step3TimeSelection
                        onNext={() => setCurrentStep(4)}
                        onBack={() => setCurrentStep(2)}
                        activity={activity}
                        setTimeDetails={setTimeDetails}
                        tempSlots={tempSlots}
                        setTempSlots={setTempSlots}
                        tempPeriod={tempPeriod}
                        setTempPeriod={setTempPeriod}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                      />
                    )}
                    {stepIndex === 4 && (
                      <Step4Review
                        activity={activity}
                        groupDetails={groupDetails}
                        timeDetails={timeDetails}
                        priceDetails={{
                          basePrice,
                          totalSlots: timeDetails ? timeDetails.slots.length : 0,
                          totalDuration:
                            (timeDetails ? timeDetails.slots.length : 0) *
                            activity.duration,
                          totalPrice: bookingData?.total_price || 0,
                        }}
                        onNext={() => setCurrentStep(5)}
                        onBack={() => setCurrentStep(3)}
                      />
                    )}
                    {stepIndex === 5 && bookingData && (
                      <Step5Payment
                        onNext={() => setCurrentStep(6)}
                        onBack={() => setCurrentStep(4)}
                        bookingData={bookingData}
                      />
                    )}
                    {stepIndex === 6 && <Step6Complete onReset={handleReset} />}
                  </div>
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
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              PRICE DETAILS
            </h3>
            {!groupDetails || (!tempSlots.length && !timeDetails) ? (
              <p className="text-gray-700 text-sm">
                Select date & time to see price details.
              </p>
            ) : (
              <div className="text-gray-700 text-sm space-y-1">
                <p>
                  <strong>Base Price (per slot):</strong> ₹{basePrice}
                </p>
                <p>
                  <strong>Slots Selected:</strong> {tempSlots.length}
                </p>
                {groupDetails && (
                  <p>
                    <strong>Group Members:</strong> {groupDetails.count}
                  </p>
                )}
                <p>
                  <strong>Total Duration:</strong> {totalDuration} mins
                </p>
                {activity.will_price_remain_same_for_whole_group ? (
                  <p>
                    <strong>Total Price (Group):</strong> ₹{totalPrice}
                  </p>
                ) : (
                  <p>
                    <strong>Total Price (Per Person):</strong> ₹{totalPrice}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
