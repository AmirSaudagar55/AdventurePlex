// src/components/ReviewSection.jsx
import React, { useState, useEffect, useContext } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ReviewSection = ({ reviewType, reviewableId }) => {
  // reviewType: "activity" or "conferenceHall"
  // reviewableId: ID of the item being reviewed
  const backendURL =
    "https://5000-idx-adventureplex-1739096860464.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev";

  const { user, token } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch reviews on mount or when reviewType/reviewableId change
  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `${backendURL}/api/reviews?type=${reviewType}&id=${reviewableId}`
      );
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [reviewType, reviewableId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      alert("Please provide a rating");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${backendURL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reviewable_type: reviewType,
          reviewable_id: reviewableId,
          rating,
          review_text: reviewText,
        }),
      });
      if (res.ok) {
        // Clear form and refresh reviews
        setRating(0);
        setReviewText("");
        fetchReviews();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Error submitting review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="my-8 p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      {loadingReviews ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-600">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 border rounded-lg shadow-sm bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {/* Ideally you might display user's name if available */}
                  <span className="font-semibold">
                    User {review.user_id}
                  </span>
                  <div className="flex">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <FaStar
                          key={i}
                          className={`${
                            review.rating > i
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.review_text && (
                <p className="mt-2 text-gray-700">{review.review_text}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {user ? (
        <form onSubmit={handleSubmit} className="mt-6 border-t pt-6">
          <h3 className="text-xl font-semibold mb-2">Add Your Review</h3>
          <div className="flex items-center mb-4">
            {Array(5)
              .fill(0)
              .map((_, i) => {
                const currentRating = i + 1;
                return (
                  <label key={i}>
                    <input
                      type="radio"
                      name="rating"
                      value={currentRating}
                      className="hidden"
                      onClick={() => setRating(currentRating)}
                    />
                    <FaStar
                      className={`cursor-pointer text-2xl ${
                        currentRating <= (hoverRating || rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      onMouseEnter={() => setHoverRating(currentRating)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  </label>
                );
              })}
            <span className="ml-2 text-lg font-medium">{rating} / 5</span>
          </div>
          <textarea
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="4"
            placeholder="Write your review here..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          ></textarea>
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-3 text-white font-semibold hover:bg-indigo-700 transition"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <p className="mt-6 text-center text-gray-600">
          Please <Link className="text-indigo-600 underline" to="/login">login</Link> to add a review.
        </p>
      )}
    </div>
  );
};

export default ReviewSection;
