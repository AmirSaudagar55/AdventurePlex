// src/components/Navbar.tsx
import { Menu, X, Activity } from "lucide-react";
import { useState, useContext, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Categories", href: "/categories" },
  { name: "Book Now", href: "/book" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <header className="bg-white shadow-sm">
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative"
        aria-label="Top"
      >
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 text-2xl font-bold text-indigo-600"
            >
              <Activity className="h-8 w-8" />
              <span>AdventurePlex</span>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium ${
                  location.pathname === item.href
                    ? "text-indigo-600"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center focus:outline-none"
                >
                  <img
                    src={
                      user.profilePicture ||
                      "https://via.placeholder.com/40"
                    }
                    alt="Profile"
                    className="h-10 w-10 rounded-full"
                  />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                    <Link
                      to="/bookings"
                      className="block px-4 py-2 text-gray-700 hover:bg-indigo-500 hover:text-white transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-indigo-500 hover:text-white transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-500 hover:text-white transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium ${
                    location.pathname === item.href
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <div className="border-t border-gray-200 pt-2">
                  <Link
                    to="/bookings"
                    className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
