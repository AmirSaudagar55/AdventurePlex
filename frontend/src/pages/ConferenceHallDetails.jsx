import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import TailwindCarousel from "../components/TailwindCarousel";
import ReviewSection from "../components/ReviewSection";

export default function ConferenceHallDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hallData, setHallData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [carouselImages, setCarouselImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(true);

  // Use your provided backend URL.
  const backendURL =
    "https://5000-idx-adventureplex-1739096860464.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev";

  // Fetch conference hall details.
  useEffect(() => {
    async function fetchHallDetails() {
      try {
        const res = await fetch(`${backendURL}/api/conferenceHalls/${id}`);
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched conference hall details:", data);
          setHallData(data);
        } else {
          console.error("Failed to fetch conference hall details.");
        }
      } catch (error) {
        console.error("Error fetching conference hall details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHallDetails();
  }, [id, backendURL]);

  // Fetch carousel images from the dedicated endpoint.
  useEffect(() => {
    async function fetchHallImages() {
      try {
        const res = await fetch(`${backendURL}/api/conferenceHalls/${id}/images`);
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched conference hall carousel images:", data);
          const urls = data.map((item) => item.imageUrl);
          setCarouselImages(urls);
        } else {
          console.error("Error fetching conference hall images, using main image.");
          setCarouselImages(hallData ? [hallData.image_url] : []);
        }
      } catch (error) {
        console.error("Error fetching conference hall images:", error);
        setCarouselImages(hallData ? [hallData.image_url] : []);
      } finally {
        setImagesLoading(false);
      }
    }
    if (hallData) {
      fetchHallImages();
    }
  }, [id, hallData, backendURL]);

  if (loading || !hallData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading conference hall details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Carousel */}
      <div className="relative h-[60vh]">
        {imagesLoading ? (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <p>Loading images...</p>
          </div>
        ) : (
          <TailwindCarousel
            images={carouselImages.length > 0 ? carouselImages : [hallData.image_url]}
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">{hallData.name}</h1>
            <p className="mt-2 text-lg">
              Location: <span className="font-semibold">{hallData.location}</span>
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

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="md:flex md:justify-between md:space-x-6">
            {/* Conference Hall Details */}
            <div className="md:flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Conference Hall</h2>
              <p className="mt-2 text-lg text-gray-700">{hallData.description}</p>
              <p className="mt-4 text-gray-700">
                <strong>Capacity:</strong> {hallData.capacity}
              </p>
              <p className="mt-2 text-gray-700">
                <strong>Floor Number:</strong> {hallData.floorNumber}
              </p>
              <p className="mt-2 text-gray-700">
                <strong>Price per Minute:</strong> ${hallData.pricePerMin}
              </p>
              <p className="mt-2 text-gray-700">
                <strong>Location:</strong> {hallData.location}
              </p>
              {hallData.features && (
                <div className="mt-4 text-gray-700">
                  <strong>Features:</strong>
                  <ul className="list-disc ml-5">
                    {Object.entries(hallData.features).map(([key, value]) => (
                      <li key={key}>
                        {key}: {value.toString()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {/* Price & Book Now Card */}
            <div className="mt-6 md:mt-0 md:w-auto">
              <div className="bg-gray-50 border rounded-lg p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Price per Minute</h3>
                <p className="text-3xl font-semibold text-indigo-600">${hallData.pricePerMin}</p>
                <button
                  type="button"
                  className="mt-4 w-full rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-lg font-semibold text-white shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => navigate("/conferenceHallBookingStepper", { state: { hall: hallData } })}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
        <ReviewSection reviewType="conferenceHall" reviewableId={hallData.id} />
        {/* Optionally: Related Conference Halls Section */}
      </div>
    </div>
  );
}
