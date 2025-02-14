import { Activity, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { categories } from "../data/categories";

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Link
              to="/"
              className="flex items-center space-x-2 text-2xl font-bold text-indigo-600"
            >
              <Activity className="h-8 w-8" />
              <span>AdventurePlex</span>
            </Link>
            <p className="text-gray-500 text-sm">
              Your ultimate destination for sports, adventure, and
              entertainment.
            </p>
            <div className="flex space-x-6">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500"
              >
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Categories
                </h3>
                <ul className="mt-4 space-y-4">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        to={`/category/${category.slug}`}
                        className="text-base text-gray-500 hover:text-gray-900"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      to="/about"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} AdventurePlex. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
