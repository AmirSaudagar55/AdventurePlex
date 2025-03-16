// src/pages/BookingsPage.tsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

// Define interfaces for the two types of bookings:
interface ActivityBooking {
  id: number;
  booking_date: string; // e.g. "2025-02-26"
  start_time: string;   // e.g. "09:00:00"
  participants: number;
  total_price: string;
  status: string;
  Activity: {
    name: string;
    location: string;
    image_url?: string;
  };
  bookingType: "activity";
}

interface ConferenceHallBookingRaw {
  id: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalPrice: string;
  status: string;
  ConferenceHall: {
    name: string;
    location: string;
    pricePerMin: string;
    image_url?: string;
  };
}

interface ConferenceHallBooking extends ActivityBooking {
  // Normalized fields:
  booking_date: string; // from bookingDate
  start_time: string;   // from startTime
  total_price: string;  // from totalPrice
  bookingType: "conferenceHall";
}

type CombinedBooking = ActivityBooking | ConferenceHallBooking;

export default function BookingsPage() {
  const { token } = useContext(AuthContext);
  const [activityBookings, setActivityBookings] = useState<ActivityBooking[]>([]);
  const [hallBookings, setHallBookings] = useState<ConferenceHallBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtering and sorting states
  const [sortOption, setSortOption] = useState<string>("recent"); // "recent", "oldest", "bookingOrder"
  const [bookingTypeFilter, setBookingTypeFilter] = useState<string>("all"); // "all", "activity", "conferenceHall"

  // Use your backend URL
  const backendURL =
    "https://5000-idx-adventureplex-1739096860464.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev";

  useEffect(() => {
    async function fetchBookings() {
      if (!token) return;
      try {
        // Fetch activity bookings from /api/bookings
        const activityRes = await fetch(`${backendURL}/api/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const activityData = await activityRes.json();
        const taggedActivityBookings = activityData.map((booking: any) => ({
          ...booking,
          bookingType: "activity" as const,
        }));
        setActivityBookings(taggedActivityBookings);

        // Fetch conference hall bookings from the dedicated endpoint
        const hallRes = await fetch(`${backendURL}/api/conferenceHalls/user-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const hallData: ConferenceHallBookingRaw[] = await hallRes.json();
        // Normalize the hall booking fields to match activity booking fields
        const taggedHallBookings: ConferenceHallBooking[] = hallData.map((booking) => ({
          ...booking,
          booking_date: booking.bookingDate,
          start_time: booking.startTime,
          total_price: booking.totalPrice,
          bookingType: "conferenceHall" as const,
        }));
        setHallBookings(taggedHallBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [token, backendURL]);

  // Combine both booking arrays.
  const combinedBookings: CombinedBooking[] = [...activityBookings, ...hallBookings];

  // Apply booking type filter.
  const filteredByType = combinedBookings.filter((booking) => {
    if (bookingTypeFilter === "all") return true;
    return booking.bookingType === bookingTypeFilter;
  });

  // Apply sorting based on sortOption.
  const sortedBookings = filteredByType.sort((a, b) => {
    const dateA = new Date(a.booking_date);
    const dateB = new Date(b.booking_date);
    if (sortOption === "recent") {
      return dateB.getTime() - dateA.getTime(); // Newest first
    } else if (sortOption === "oldest") {
      return dateA.getTime() - dateB.getTime(); // Oldest first
    } else if (sortOption === "bookingOrder") {
      return a.id - b.id; // Ascending order by booking id
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>

        {/* Filtering Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div className="mb-4 sm:mb-0">
            <label className="mr-2 font-medium text-gray-700">Sort By:</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border rounded-md p-2"
            >
              <option value="recent">Recent Bookings</option>
              <option value="oldest">Oldest Bookings</option>
              <option value="bookingOrder">Booking Order</option>
            </select>
          </div>
          <div>
            <label className="mr-2 font-medium text-gray-700">Booking Type:</label>
            <select
              value={bookingTypeFilter}
              onChange={(e) => setBookingTypeFilter(e.target.value)}
              className="border rounded-md p-2"
            >
              <option value="all">All</option>
              <option value="activity">Activities</option>
              <option value="conferenceHall">Conference Halls</option>
            </select>
          </div>
        </div>

        {loading ? (
          // Skeleton loader for the list area (header remains visible)
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((skeleton) => (
              <div
                key={skeleton}
                className="animate-pulse bg-white rounded-lg shadow-md p-6"
              >
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : sortedBookings.length === 0 ? (
          <p className="text-gray-600">No bookings found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {sortedBookings.map((booking) => (
              <div
                key={`${booking.bookingType}-${booking.id}`}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col"
              >
                {booking.bookingType === "activity" ? (
                  <>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {booking.Activity?.name}
                    </h2>
                    <p className="text-gray-600">{booking.Activity?.location}</p>
                    <p className="mt-2 text-gray-700">
                      <span className="font-semibold">Date:</span>{" "}
                      {booking.booking_date}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Start Time:</span>{" "}
                      {booking.start_time}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Participants:</span>{" "}
                      {booking.participants}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Total Price:</span> ₹
                      {booking.total_price}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Status:</span>{" "}
                      {booking.status}
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {booking.ConferenceHall?.name}
                    </h2>
                    <p className="text-gray-600">{booking.ConferenceHall?.location}</p>
                    <p className="mt-2 text-gray-700">
                      <span className="font-semibold">Date:</span>{" "}
                      {booking.booking_date}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Start Time:</span>{" "}
                      {booking.start_time}
                    </p>
                    {/* Optionally, add End Time if desired */}
                    <p className="text-gray-700">
                      <span className="font-semibold">Total Price:</span> ₹
                      {booking.total_price}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Status:</span>{" "}
                      {booking.status}
                    </p>
                  </>
                )}
                <div className="mt-auto pt-4">
                  <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
