import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import UserProvider from "./contexts/UserProvider";
import { Navigate } from "react-router-dom";
import { variable } from "./shared";
import { useLocation } from "react-router-dom";

export default function AppLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  useEffect(() => {
    if (location.pathname !== "/results") {
      localStorage.removeItem("defaultModel");
      localStorage.removeItem("visionModel");
    }
  }, [location]);

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

  return (
    <UserProvider>
      <Outlet />
    </UserProvider>
  );
}
