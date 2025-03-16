// src/pages/SignupPage.tsx
import React, { useContext, useState } from "react";
import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [serverError, setServerError] = useState("");

  // Updated formData includes firstName, lastName, email, password, phone.
  const handleSignup = async (formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    try {
      const response = await fetch(
        "https://5000-idx-adventureplex-1739096860464.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        const data = await response.json();
        // Call context login. User info will be fetched by the AuthContext.
        login(data.token, null);
        navigate("/");
      } else {
        const errorData = await response.json();
        setServerError(errorData.error || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setServerError("An error occurred during signup.");
    }
  };

  return <AuthForm isSignup={true} onSubmit={handleSignup} serverError={serverError} />;
}
