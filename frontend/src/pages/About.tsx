export default function About() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
        <img
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1600"
          alt="Sports facilities"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
        />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">About Us</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Providing world-class sports facilities to athletes and enthusiasts since 2010.
            </p>
          </div>
        </div>
      </div>

      {/* Mission section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Mission</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We are committed to promoting sports and healthy living by providing access to premium
            sports facilities. Our goal is to create an environment where both amateur and
            professional athletes can train, compete, and enjoy their favorite sports.
          </p>
        </div>

        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:gap-x-16">
          <div className="relative pl-9">
            <dt className="inline font-semibold text-gray-900">
              <div className="absolute left-1 top-1 h-5 w-5 text-indigo-600">
                ★
              </div>
              Professional Facilities
            </dt>
            <dd className="inline">
              Our facilities are maintained to international standards, ensuring the best possible
              experience for all users.
            </dd>
          </div>
          <div className="relative pl-9">
            <dt className="inline font-semibold text-gray-900">
              <div className="absolute left-1 top-1 h-5 w-5 text-indigo-600">
                ★
              </div>
              Experienced Staff
            </dt>
            <dd className="inline">
              Our team consists of experienced sports professionals who are always ready to assist
              and guide you.
            </dd>
          </div>
        </dl>
      </div>

      {/* Values section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Values</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We believe in making sports accessible to everyone while maintaining the highest
              standards of quality and service.
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:gap-x-16">
            <div>
              <dt className="font-semibold text-gray-900">Excellence</dt>
              <dd className="mt-1 text-gray-600">
                We strive for excellence in everything we do, from facility maintenance to customer
                service.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Community</dt>
              <dd className="mt-1 text-gray-600">
                We foster a strong sports community by organizing events and tournaments.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}