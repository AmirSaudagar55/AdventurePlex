// src/pages/ProfilePage.tsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect to login if user is not logged in.
  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <div className="flex flex-col items-center">
          <img
            src={user.profilePicture || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500"
          />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          {user.phone && <p className="text-gray-600">{user.phone}</p>}
        </div>
        <div className="mt-6">
          <button
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
            onClick={() => alert("Delete account functionality not implemented.")}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
