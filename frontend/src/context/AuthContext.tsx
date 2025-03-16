// src/context/AuthContext.tsx
import { createContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  profilePicture?: string; // if supported by your user model
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (token: string, user: User | null) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  // Debug: log whenever token changes
  useEffect(() => {
    console.log("AuthContext: token changed:", token);
    if (token) {
      localStorage.setItem("token", token);
      // Fetch user info using the token
      fetch(
        "https://5000-idx-adventureplex-1739096860464.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev/api/auth/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched user data:", data);
          if (!data.error) {
            setUser(data);
          } else {
            console.error("Error fetching user:", data.error);
          }
        })
        .catch((err) => console.error("Failed to fetch user", err));
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  // NEW: Check for token in URL query parameters (from Google OAuth)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    if (urlToken) {
      console.log("Found token in URL:", urlToken);
      // Always override with the new token from the URL.
      login(urlToken, null);
      // Remove the token from the URL after setting it.
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  

  const login = (token: string, user: User | null) => {
    console.log("AuthContext login called with token:", token, "user:", user);
    setToken(token);
    if (user) setUser(user);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    console.log("AuthContext logout called");
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
