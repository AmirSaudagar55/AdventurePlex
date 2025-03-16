// src/pages/Book.jsx
import React, { useEffect, useState, useContext } from "react";
import { Search } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Book() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]); // New state for categories
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const backendURL = "https://5000-idx-adventureplex-1739096860464.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev";

  // Fetch activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch(`${backendURL}/api/activities`);
        const data = await res.json();
        setActivities(data);
        setLoadingActivities(false);
      } catch (error) {
        console.error("Error fetching activities:", error);
        setLoadingActivities(false);
      }
    };
    fetchActivities();
  }, [backendURL]);

  // Fetch categories dynamically from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${backendURL}/api/categories`);
        const data = await res.json();
        setCategories(data);
        setLoadingCategories(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [backendURL]);

  // Filter activities based on search query and selected category
  useEffect(() => {
    let filtered = activities;
    if (searchQuery) {
      filtered = filtered.filter(
        (activity) =>
          activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(
        (activity) => activity.category_id === Number(selectedCategory)
      );
    }
    setFilteredActivities(filtered);
  }, [activities, searchQuery, selectedCategory]);

  if (loadingActivities || loadingCategories) {
    return <div>Loading activities and categories...</div>;
  }

  const handleSelectForBooking = (activity) => {
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      // Redirect to ActivityDetail page with full details
      navigate(`/activity/${activity.id}`, { state: { activity } });
    }
  };

  const handleLogin = () => {
    navigate("/login");
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
              <div className="mt-6">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Activities List */}
          <div className="lg:w-3/4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="cursor-pointer rounded-lg border-2 bg-white p-4"
                >
                  <div className="block">
                    <img
                      src={activity.image_url}
                      alt={activity.name}
                      className="h-32 w-full rounded-lg object-cover"
                    />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      {activity.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {activity.description}
                    </p>
                    <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <dt className="font-medium text-gray-500">
                          Duration
                        </dt>
                        <dd className="text-gray-900">
                          {activity.duration} {activity.duration_unit || "mins"}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-500">
                          Price
                        </dt>
                        <dd className="text-gray-900">{activity.price}</dd>
                      </div>
                    </dl>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectForBooking(activity)}
                    className="mt-4 w-full rounded-md bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
                  >
                    Select for Booking
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">
              You must be logged in to continue booking your adventure. Please login to proceed.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleLogin}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors duration-200"
              >
                Login
              </button>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
