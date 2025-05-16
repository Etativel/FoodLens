import { useState, useEffect } from "react";
import UserContext from "./createContext/UserContext";
import { variable } from "../shared";

export default function UserProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function getProfile(userId) {
    setIsLoading(true);
    try {
      const response = await fetch(`${variable.API_URL}/user/getProfile`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });
      if (!response.ok) {
        console.log(response.statusText);
        setIsLoading(false);
      }
      const profile = await response.json();

      setProfile(profile);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${variable.API_URL}/auth/profile`, {
          credentials: "include",
        });
        const data = await response.json();
        getProfile(data.user.id);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <UserContext.Provider value={{ profile, setProfile, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}
