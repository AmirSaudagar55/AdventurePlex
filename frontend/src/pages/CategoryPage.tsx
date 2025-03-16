// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]); // Either activities or conference halls
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [loadingItems, setLoadingItems] = useState(true);

  // Replace with your backend URL
  const backendURL = "https://5000-idx-adventureplex-1739096860464.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev";

  // Fetch category details by slug
  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await fetch(`${backendURL}/api/categories/${slug}`);
        if (!res.ok) {
          throw new Error("Category not found");
        }
        const data = await res.json();
        setCategory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCategory(false);
      }
    }
    fetchCategory();
  }, [slug, backendURL]);

  // Once the category is fetched, fetch the corresponding items.
  useEffect(() => {
    async function fetchItems() {
      if (!category) return;
      try {
        let url = "";
        // Check if this category is for conference halls.
        if (
          category.name.toLowerCase() === "conference halls" ||
          category.slug === "conference-halls"
        ) {
          // Fetch conference halls
          url = `${backendURL}/api/conferenceHalls`;
        } else {
          // Fetch activities for the category by filtering on category_id
          url = `${backendURL}/api/activities?category=${category.id}`;
        }
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Error fetching items");
        }
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingItems(false);
      }
    }
    fetchItems();
  }, [category, backendURL]);

  if (loadingCategory || loadingItems) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Category not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
        {/* You may use category.image_url if available; otherwise, fallback */}
        <img
          src={category.image_url || "https://via.placeholder.com/1600x400?text=Category+Image"}
          alt={category.name}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
        />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              {category.name}
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {items.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Link
                key={item.id}
                to={
                  category.name.toLowerCase() === "conference halls" ||
                  category.slug === "conference-halls"
                    ? `/conferenceHall/${item.id}` // Optionally create a dedicated page for conference halls
                    : `/activity/${item.id}`
                }
                state={{ item }}
                className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-h-3 aspect-w-4">
                  <img
                    src={item.image_url || item.image || "https://via.placeholder.com/400x300?text=Image"}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="mt-2 text-sm text-gray-500">{item.description}</p>
                  {item.duration && (
                    <p className="mt-2 text-sm text-gray-700">
                      Duration: {item.duration} {item.duration_unit || "mins"}
                    </p>
                  )}
                  {item.price && (
                    <p className="mt-2 text-sm text-gray-700">Price: {item.price}</p>
                  )}
                  {item.capacity && (
                    <p className="mt-2 text-sm text-gray-700">
                      Capacity: {item.capacity}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-700">No items found for this category.</p>
        )}
      </div>
    </div>
  );
}
