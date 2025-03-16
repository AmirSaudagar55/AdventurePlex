import React, { useEffect, useState } from "react";

export default function TailwindCarousel({ images, interval = 3000 }) {
  const [validImages, setValidImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Preload images and filter out invalid ones
  useEffect(() => {
    let isMounted = true; // To avoid setting state on unmounted component
    const loadImages = async () => {
      // Create an array of promises to check each image URL.
      const promises = images.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          // If the image loads successfully, mark it as valid.
          img.onload = () => resolve({ src, valid: true });
          // If there's an error loading the image, mark it as invalid.
          img.onerror = () => resolve({ src, valid: false });
        });
      });
      const results = await Promise.all(promises);
      if (isMounted) {
        // Filter to keep only valid images.
        const valid = results.filter((result) => result.valid).map((result) => result.src);
        setValidImages(valid);
        // Reset currentIndex in case the number of valid images has changed.
        setCurrentIndex(0);
      }
    };
    loadImages();
    return () => {
      isMounted = false;
    };
  }, [images]);

  // Auto-play functionality using validImages
  useEffect(() => {
    if (validImages.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === validImages.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);
    return () => clearInterval(timer);
  }, [validImages, interval]);

  // Render a fallback message if no valid images found.
  if (validImages.length === 0) {
    return (
      <div className="relative w-full h-96 flex items-center justify-center bg-gray-200 rounded-2xl">
        <p className="text-center text-gray-600">No valid images to display.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-2xl h-96 relative">
        {validImages.map((img, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        ))}
      </div>
      {/* Optional: Pagination dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {validImages.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}
