// src/components/AuthForm.tsx
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";

interface AuthFormProps {
  isSignup: boolean;
  onSubmit: (formData: {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    phone?: string;
  }) => void;
  serverError?: string;
}

export default function AuthForm({ isSignup, onSubmit, serverError }: AuthFormProps) {
  const [formData, setFormData] = useState<{
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    phone?: string;
  }>(
    isSignup
      ? { firstName: "", lastName: "", email: "", password: "", phone: "" }
      : { email: "", password: "" }
  );
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Client-side validations
  const validateForm = () => {
    const errorsArray: string[] = [];
    if (isSignup) {
      if (!formData.firstName?.trim()) {
        errorsArray.push("First Name is required.");
      }
      if (!formData.lastName?.trim()) {
        errorsArray.push("Last Name is required.");
      }
      if (!formData.phone?.trim()) {
        errorsArray.push("Phone Number is required.");
      } else {
        // Basic phone number check (digits, optional '+' at start, minimum 10 digits)
        const phoneRegex = /^\+?[0-9]{10,}$/;
        if (!phoneRegex.test(formData.phone)) {
          errorsArray.push("Please enter a valid phone number.");
        }
      }
    }
    if (!formData.email?.trim()) {
      errorsArray.push("Email is required.");
    } else {
      // Basic email pattern check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errorsArray.push("Please enter a valid email address.");
      }
    }
    if (!formData.password) {
      errorsArray.push("Password is required.");
    } else {
      // Password must be at least 6 characters with at least one uppercase and one lowercase letter.
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
      if (!passwordRegex.test(formData.password)) {
        errorsArray.push("Password must be at least 6 characters long and include both uppercase and lowercase letters.");
      }
    }
    return errorsArray;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    onSubmit(formData);
  };

  // Redirect to Google OAuth route on click.
  const handleGoogleSignIn = () => {
    window.location.href =
      "https://5000-idx-adventureplex-1739096860464.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev/api/auth/google";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          {isSignup ? "Sign Up" : "Login"}
        </h2>
        {/* Display server error (if any) */}
        {serverError && (
          <div className="mb-4">
            <p className="text-red-500 text-sm text-center">{serverError}</p>
          </div>
        )}
        {/* Display client-side validation errors */}
        {errors.length > 0 && (
          <div className="mb-4">
            {errors.map((error, index) => (
              <p key={index} className="text-red-500 text-sm">
                {error}
              </p>
            ))}
          </div>
        )}
        <form className="mt-6" onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName || ""}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName || ""}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 6 characters, including uppercase and lowercase letters.
            </p>
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <div className="relative flex items-center justify-center my-6">
          <div className="w-full border-t border-gray-300"></div>
          <span className="absolute bg-white px-2 text-gray-500 text-sm">OR</span>
        </div>
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition duration-200"
        >
          <FcGoogle className="text-2xl mr-2" /> Sign in with Google
        </button>
        <p className="mt-4 text-sm text-center text-gray-600">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <a href={isSignup ? "/login" : "/signup"} className="text-blue-500 hover:underline ml-1">
            {isSignup ? "Login" : "Sign Up"}
          </a>
        </p>
      </div>
    </div>
  );
}
