import { useState, useEffect } from "react";
import { variable } from "./shared";
import { Navigate } from "react-router-dom";

export default function Redirection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${variable.API_URL}/auth/profile`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not authenticated");
      })
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="sign-in" />;
  }

  if (isAuthenticated) {
    return <Navigate to="home" />;
  }
  return "";
}
