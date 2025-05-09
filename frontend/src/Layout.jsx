import "./Layout.css";
import BottomNavigation from "./components/Navigation/BottomNavigation";
import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import UserProvider from "./contexts/UserProvider";

function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch("http://localhost:3000/auth/profile", {
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
      <div className="h-screen relative overflow-hidden">
        <Outlet className="content-wrapper" />
        <BottomNavigation />
      </div>
    </UserProvider>
  );
}

export default Layout;
