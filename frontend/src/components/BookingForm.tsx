// src/components/BookingForm.tsx
import React, { useState } from "react";
import { Calendar, Users } from "lucide-react";
import { format } from "date-fns";

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
];

interface BookingFormProps {
  activity: {
    id: string;
    name: string;
    price: number;
    maxParticipants: number;
    category: string;
  };
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  participants: number;
  setParticipants: (participants: number) => void;
  calculateTotalPrice: () => number;
  onBooking: (e: React.FormEvent) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  activity,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  participants,
  setParticipants,
  calculateTotalPrice,
  onBooking,
}) => {
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowBookingSuccess(true);
    onBooking(e);
    setTimeout(() => setShowBookingSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900">Book Now</h3>

        {/* Date Selection */}
        <div className="mt-6">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Select Date
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500">
              <Calendar className="h-5 w-5" />
            </span>
            <input
              type="date"
              id="date"
              name="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd")}
              className="block w-full rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>

        {/* Time Selection */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Select Time
          </label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${
                  selectedTime === time
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-900 hover:bg-gray-50"
                } border border-gray-300`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Participants Selection */}
        <div className="mt-6">
          <label htmlFor="participants" className="block text-sm font-medium text-gray-700">
            Number of {activity.category === "social" ? "Guests" : "Participants"}
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500">
              <Users className="h-5 w-5" />
            </span>
            <input
              type="number"
              id="participants"
              value={participants}
              onChange={(e) =>
                setParticipants(
                  Math.max(1, Math.min(parseInt(e.target.value) || 1, activity.maxParticipants))
                )
              }
              min="1"
              max={activity.maxParticipants}
              className="block w-full rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Maximum {activity.maxParticipants} {activity.category === "social" ? "guests" : "participants"}
          </p>
        </div>

        {/* Price Summary */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <span className="text-lg font-semibold text-gray-900">Total Price</span>
            <span className="text-lg font-semibold text-indigo-600">${calculateTotalPrice()}</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedDate || !selectedTime}
          className="mt-6 w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300"
        >
          Complete Booking
        </button>

        {/* Success Message */}
        {showBookingSuccess && (
          <div className="mt-4 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-green-400">✓</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Booking successful! We'll send you a confirmation email shortly.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default BookingForm;
