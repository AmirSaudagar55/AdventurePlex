// src/pages/Book.jsx
import React, { useEffect, useState, useContext } from "react";
import { Search } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Book() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // States for filtered items and categories
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // category id as string

  // Use your backend URL
  const backendURL =
    "https://5000-idx-adventureplex-1739096860464.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev";

  // Fetch categories from backend (for filter dropdown)
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${backendURL}/api/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, [backendURL]);

  // Updated logic for fetching filtered items using AbortController.
  useEffect(() => {
    const controller = new AbortController();
    // Clear previous items immediately.
    setFilteredItems([]);
    setLoadingItems(true);

    async function fetchFilteredItems() {
      try {
        // Prepare query parameters for search and category filters.
        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (selectedCategory) params.append("category", selectedCategory);

        let combined = [];
        if (selectedCategory === "") {
          // No category filter: fetch both activities and conference halls.
          const [activitiesRes, hallsRes] = await Promise.all([
            fetch(`${backendURL}/api/activities?${params.toString()}`, {
              signal: controller.signal,
            }),
            fetch(`${backendURL}/api/conferenceHalls?${params.toString()}`, {
              signal: controller.signal,
            }),
          ]);
          const [activitiesData, hallsData] = await Promise.all([
            activitiesRes.json(),
            hallsRes.json(),
          ]);
          const activitiesWithType = activitiesData.map((item) => ({
            ...item,
            type: "activity",
          }));
          const hallsWithType = hallsData.map((item) => ({
            ...item,
            type: "conferenceHall",
          }));
          // Always show activities first, then conference halls.
          combined = [...activitiesWithType, ...hallsWithType];
        } else if (selectedCategory === "7") {
          // Selected category is Conference Halls: fetch halls only.
          const res = await fetch(
            `${backendURL}/api/conferenceHalls?${params.toString()}`,
            { signal: controller.signal }
          );
          const hallsData = await res.json();
          combined = hallsData.map((item) => ({
            ...item,
            type: "conferenceHall",
          }));
        } else {
          // For any other category, fetch activities only.
          const res = await fetch(
            `${backendURL}/api/activities?${params.toString()}`,
            { signal: controller.signal }
          );
          const activitiesData = await res.json();
          combined = activitiesData.map((item) => ({
            ...item,
            type: "activity",
          }));
        }
        // Set the new data.
        setFilteredItems(combined);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Previous fetch aborted");
        } else {
          console.error("Error fetching filtered items:", error);
        }
      } finally {
        setLoadingItems(false);
      }
    }
    fetchFilteredItems();

    return () => {
      controller.abort();
    };
  }, [backendURL, searchQuery, selectedCategory]);

  // (Optional) Log updated filteredItems state when it changes.
  useEffect(() => {
    console.log("Filtered items updated:", filteredItems);
  }, [filteredItems]);

  const handleSelectForBooking = (item) => {
    if (!user) {
      alert("Please login to book an item.");
      navigate("/login");
    } else {
      // Navigate to detail page based on item type.
      if (item.type === "conferenceHall") {
        navigate(`/conferenceHall/${item.id}`, { state: { hall: item } });
      } else {
        navigate(`/activity/${item.id}`, { state: { activity: item } });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Header & Filters always visible */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Book Your Adventure
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Choose from our exciting range of activities and conference halls
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          {/* Filters */}
          <div className="lg:w-1/4">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <div className="mt-4">
                <label htmlFor="search" className="sr-only">
                  Search items
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    placeholder="Search items..."
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
                  {loadingCategories ? (
                    <option value="">Loading categories...</option>
                  ) : (
                    <>
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="lg:w-3/4">
            {loadingItems ? (
              // Skeleton loader for list items
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="animate-pulse rounded-lg border-2 bg-gray-200 p-4"
                  >
                    <div className="h-32 w-full bg-gray-300 rounded-lg"></div>
                    <div className="mt-4 h-6 bg-gray-300 rounded"></div>
                    <div className="mt-2 h-4 bg-gray-300 rounded"></div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="cursor-pointer rounded-lg border-2 bg-white p-4"
                    onClick={() => handleSelectForBooking(item)}
                  >
                    <div className="block">
                      <img
                        src={
                          item.image_url ||
                          item.image ||
                          "https://via.placeholder.com/400x300?text=Image"
                        }
                        alt={item.name}
                        className="h-32 w-full rounded-lg object-cover"
                      />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.description}
                      </p>
                      <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <dt className="font-medium text-gray-500">
                            {item.type === "conferenceHall" ? "Capacity" : "Duration"}
                          </dt>
                          <dd className="text-gray-900">
                            {item.type === "conferenceHall"
                              ? item.capacity
                              : `${item.duration} ${item.duration_unit || "mins"}`}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium text-gray-500">Price</dt>
                          <dd className="text-gray-900">
                            {item.type === "conferenceHall"
                              ? `₹${item.pricePerMin}`
                              : item.price
                              ? `${item.price}`
                              : "N/A"}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-700">No items found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
