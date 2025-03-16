// src/pages/Categories.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use the provided production backend URL.
  const backendURL =
    "https://5000-idx-adventureplex-1739096860464.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev/api/categories";

  useEffect(() => {
    fetch(backendURL)
      .then(response => response.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setLoading(false);
      });
  }, [backendURL]);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
        <img
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1600"
          alt="Sports and activities"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
        />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Activity Categories
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Explore our diverse range of activities and find your perfect adventure
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {loading ? (
          // Skeleton loader grid while categories are loading.
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse rounded-lg bg-gray-200 p-6"
              >
                <div className="h-48 w-full bg-gray-300 rounded"></div>
                <div className="mt-4 h-6 bg-gray-300 rounded"></div>
                <div className="mt-2 h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-h-2 aspect-w-3">
                  <img
                    src={category.image_url || "https://via.placeholder.com/400x300?text=Category"}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />
                </div>
                <div className="absolute bottom-0 p-6">
                  <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                  <p className="mt-2 text-sm text-gray-200">{category.description}</p>
                  <div className="mt-4 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white/20">
                    Explore Activities
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
