// src/pages/ActivityDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import TailwindCarousel from "../components/TailwindCarousel";

export default function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Use activity data from state if available; otherwise, fetch details from API.
  const [activityData, setActivityData] = useState(location.state?.activity || null);
  const [loading, setLoading] = useState(!activityData);
  const [carouselImages, setCarouselImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [relatedActivities, setRelatedActivities] = useState([]);

  // Fetch full activity details (if not already available)
  useEffect(() => {
    if (!activityData) {
      fetch(`https://5000-idx-adventureplex-1739096860464.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev/api/activities/${id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched activity details:", data);
          setActivityData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching activity details:", err);
          setLoading(false);
        });
    }
  }, [id, activityData]);

  // Always fetch carousel images from the dedicated endpoint.
  useEffect(() => {
    async function fetchCarouselImages() {
      try {
        const response = await fetch(
          `https://5000-idx-adventureplex-1739096860464.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev/api/activities/${id}/images`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched carousel images:", data);
          // Extract image URLs from the returned objects.
          const urls = data.map((item) => item.image_url);
          setCarouselImages(urls);
        } else {
          console.error("Error fetching images:", response.statusText);
          // Fallback: use the main activity image if available.
          setCarouselImages(activityData ? [activityData.image_url] : []);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setCarouselImages(activityData ? [activityData.image_url] : []);
      } finally {
        setImagesLoading(false);
      }
    }
    fetchCarouselImages();
  }, [id, activityData]);

  // Extract category information
  const categoryId =
    (activityData?.Category && activityData.Category.id) ||
    activityData?.category_id ||
    null;
  const categoryName =
    (activityData?.Category && activityData?.Category.name) ||
    activityData?.category ||
    "Unknown";

  // Fetch related activities from the same category (exclude current activity)
  useEffect(() => {
    async function fetchRelated() {
      if (!categoryId) return;
      try {
        const res = await fetch(
          `https://5000-idx-adventureplex-1739096860464.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev/api/activities?category=${categoryId}`
        );
        const data = await res.json();
        // Exclude the current activity
        const filtered = data.filter((act) => act.id !== activityData.id);
        setRelatedActivities(filtered.slice(0, 4));
      } catch (error) {
        console.error("Error fetching related activities:", error);
      }
    }
    if (activityData) {
      fetchRelated();
    }
  }, [activityData, categoryId]);

  if (loading || !activityData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading activity details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Tailwind Carousel */}
      <div className="relative h-[60vh]">
        {imagesLoading ? (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <p>Loading images...</p>
          </div>
        ) : (
          <TailwindCarousel
            images={carouselImages.length > 0 ? carouselImages : [activityData.image_url]}
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
              {activityData.name}
            </h1>
            <p className="mt-2 text-lg">
              Category: <span className="font-semibold">{categoryName}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          to="/book"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-8"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Booking
        </Link>

        {/* Combined Details & Price Card */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="md:flex md:justify-between md:space-x-6">
            {/* Activity Details */}
            <div className="md:flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About this {categoryName.toLowerCase() === "social" ? "Venue" : "Activity"}
              </h2>
              <p className="mt-2 text-lg text-gray-700">{activityData.description}</p>
              {activityData.duration && (
                <p className="mt-4 text-gray-700">
                  <strong>Duration:</strong> {activityData.duration} {activityData.duration_unit || "mins"}
                </p>
              )}
              {activityData.price && (
                <p className="mt-2 text-gray-700">
                  <strong>Price:</strong> {activityData.price}
                </p>
              )}
              {activityData.maximum_group_members_allowed && (
                <p className="mt-2 text-gray-700">
                  <strong>Maximum Group Members:</strong> {activityData.maximum_group_members_allowed}
                </p>
              )}
              {activityData.min_age && (
                <p className="mt-2 text-gray-700">
                  <strong>Minimum Age:</strong> {activityData.min_age} years
                </p>
              )}
              {activityData.min_height && (
                <p className="mt-2 text-gray-700">
                  <strong>Minimum Height:</strong> {activityData.min_height}
                </p>
              )}
              {/* Additional fields as needed */}
            </div>
            {/* Price & Book Now Card – now occupies only the required space */}
            <div className="mt-6 md:mt-0 md:w-auto">
              <div className="bg-gray-50 border rounded-lg p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Price</h3>
                <p className="text-3xl font-semibold text-indigo-600">{activityData.price}</p>
                <button
                  type="button"
                  className="mt-4 w-full rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-lg font-semibold text-white shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() =>
                    navigate("/booking-stepper", { state: { activity: activityData } })
                  }
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Activities Section */}
        {relatedActivities.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Activities</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedActivities.map((act) => (
                <div key={act.id} className="bg-white border rounded-lg p-4 shadow hover:shadow-lg transition">
                  <img
                    src={act.image_url}
                    alt={act.name}
                    className="h-32 w-full object-cover rounded-md"
                  />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{act.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">{act.price}</p>
                  <button
                    onClick={() =>
                      navigate("/booking-stepper", { state: { activity: act } })
                    }
                    className="mt-3 w-full rounded-md bg-indigo-600 hover:bg-indigo-700 text-white py-2 text-sm"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
