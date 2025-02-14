import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { categories } from '../data/categories';
import { activities } from '../data/activities';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = categories.find((c) => c.slug === slug);
  const categoryActivities = activities.filter((a) => a.category === slug);

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Category not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
        <img
          src={category.image}
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

      {/* Activities grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categoryActivities.map((activity) => (
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
                <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="font-medium text-gray-500">Duration</dt>
                    <dd className="text-gray-900">{activity.duration} min</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">Min Age</dt>
                    <dd className="text-gray-900">{activity.minAge}+ years</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">Group Size</dt>
                    <dd className="text-gray-900">Up to {activity.maxParticipants}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">Price</dt>
                    <dd className="text-gray-900">${activity.price}</dd>
                  </div>
                </dl>
                <div className="mt-6">
                  <Link
                    to="/book"
                    className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
  );
}