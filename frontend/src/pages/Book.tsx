import { useState } from 'react';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { activities } from '../data/activities';
import { categories } from '../data/categories';
import type { Activity } from '../types';

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM',
];

export default function Book() {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [participants, setParticipants] = useState(1);

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? activity.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity) return;

    const booking = {
      activity: selectedActivity,
      date: selectedDate,
      time: selectedTime,
      participants,
      totalPrice: selectedActivity.price * participants,
    };

    // Handle booking submission
    console.log('Booking:', booking);
    alert('Booking submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Book Your Adventure
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Choose from our exciting range of activities
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          {/* Filters */}
          <div className="lg:w-1/4">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              
              {/* Search */}
              <div className="mt-4">
                <label htmlFor="search" className="sr-only">
                  Search activities
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    placeholder="Search activities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <Search className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Category filter */}
              <div className="mt-6">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus :ring-indigo-500 sm:text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Activity Selection */}
          <div className="lg:w-3/4">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`cursor-pointer rounded-lg border-2 bg-white p-4 ${
                      selectedActivity?.id === activity.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-200'
                    }`}
                    onClick={() => setSelectedActivity(activity)}
                  >
                    <img
                      src={activity.image}
                      alt={activity.name}
                      className="h-32 w-full rounded-lg object-cover"
                    />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      {activity.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{activity.description}</p>
                    <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <dt className="font-medium text-gray-500">Duration</dt>
                        <dd className="text-gray-900">{activity.duration} min</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-500">Price</dt>
                        <dd className="text-gray-900">${activity.price}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>

              {selectedActivity && (
                <>
                  {/* Date and Time Selection */}
                  <div className="grid gap-8 sm:grid-cols-2">
                    {/* Date Selection */}
                    <div>
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Select Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>

                    {/* Participants */}
                    <div>
                      <label
                        htmlFor="participants"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Number of Participants
                      </label>
                      <input
                        type="number"
                        id="participants"
                        name="participants"
                        value={participants}
                        onChange={(e) => setParticipants(Math.max(1, Math.min(parseInt(e.target.value) || 1, selectedActivity.maxParticipants)))}
                        min="1"
                        max={selectedActivity.maxParticipants}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Max {selectedActivity.maxParticipants} participants
                      </p>
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Select Time
                    </label>
                    <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`rounded-md px-3 py-2 text-sm font-semibold ${
                            selectedTime === time
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white text-gray-900 hover:bg-gray-50'
                          } shadow-sm ring-1 ring-inset ring-gray-300`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Booking Summary */}
                  <div className="rounded-lg bg-gray-50 p-6">
                    <h3 className="text-lg font-medium text-gray-900">Booking Summary</h3>
                    <dl className="mt-4 space-y-4">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Activity</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {selectedActivity.name}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Date</dt>
                        <dd className="text-sm font-medium text-gray-900">{selectedDate}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Time</dt>
                        <dd className="text-sm font-medium text-gray-900">{selectedTime}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Participants</dt>
                        <dd className="text-sm font-medium text-gray-900">{participants}</dd>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-4">
                        <dt className="text-base font-medium text-gray-900">Total Price</dt>
                        <dd className="text-base font-medium text-indigo-600">
                          ${selectedActivity.price * participants}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={!selectedDate || !selectedTime}
                      className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300"
                    >
                      Complete Booking
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}