// src/pages/LoginPage.tsx
import React, { useContext } from "react";
import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (formData: { email: string; password: string }) => {
    try {
      const response = await fetch(
        "https://5000-idx-adventureplex-1739096860464.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev/api/auth/login",
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
        alert(errorData.error || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login.");
    }
  };

  return <AuthForm isSignup={false} onSubmit={handleLogin} />;
}
