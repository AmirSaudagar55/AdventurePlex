import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categories } from '../data/categories';
import { activities } from '../data/activities';

export default function Home() {
  const featuredActivities = activities.slice(0, 4);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&q=80&w=1600"
            alt="Adventure activities"
          />
          <div className="absolute inset-0 bg-gray-500 mix-blend-multiply" />
        </div>
        <div className="relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <h1 className="text-center text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Your Ultimate Adventure Awaits
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-center text-xl text-white">
            Discover a world of excitement with our diverse range of sports, adventures, and entertainment activities.
          </p>
          <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
            <Link
              to="/book"
              className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 sm:px-8"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Explore Our Categories
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Find your perfect adventure across our diverse range of activities
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="aspect-h-2 aspect-w-3">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />
              </div>
              <div className="absolute bottom-0 p-6">
                <h3 className="text-xl font-bold text-white">{category.name}</h3>
                <p className="mt-2 text-sm text-gray-200">{category.description}</p>
                <div className="mt-4 flex items-center text-white">
                  <span className="text-sm font-medium">Explore</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Activities */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Featured Activities
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Popular experiences loved by our adventurers
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredActivities.map((activity) => (
              <div
                key={activity.id}
                className="group relative overflow-hidden rounded-lg bg-white shadow"
              >
                <div className="aspect-h-3 aspect-w-4">
                  <img
                    src={activity.image}
                    alt={activity.name}
                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{activity.name}</h3>
                  <p className="mt-2 text-sm text-gray-500">{activity.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-medium text-indigo-600">
                      ${activity.price}
                    </span>
                    <Link
                      to="/book"
                      className="rounded-md bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}