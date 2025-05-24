import SearchBar from "../../components/SearchBar/SearchBar";
import { NutrientInfoGraph, FoodContent, Loader, variable } from "../../shared";
import { ScanIcon, Loader2 } from "lucide-react";
import CalorieChart from "./CaloriesLineChart";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import UserContext from "../../contexts/createContext/UserContext";

export default function Calories() {
  const { profile } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  function onSubmit() {
    navigate(`/recipe?query=${encodeURIComponent(search)}`);
  }

  console.log(data);

  useEffect(() => {
    if (!profile) return;
    async function fetchHomeData() {
      try {
        const response = await fetch(`${variable.API_URL}/user/calories`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: profile.user.id,
          }),
        });
        if (!response.ok) {
          console.log("Failed to retrieve home data, ", response.statusText);
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        console.log("internal server error, ", err);
      }
    }
    fetchHomeData();
  }, [profile]);

  // spinner while loading daily totals
  if (loading) {
    return <Loader />;
  }

  // if no entries after loading
  if (!loading && data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-white mt-50 mx-4 text-center">
        <ScanIcon size={48} className="text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Food Entries Yet</h2>
        <p className="text-gray-400 mb-6">
          Start scanning your food to track your daily calories and nutrients.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="lg:mx-20 flex-1 overflow-y-auto bg-neutral-900 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -ms-overflow-style:none">
        <div className="flex flex-col bg-neutral-900 sticky z-10 top-0 h-10 justify-end ">
          <div className="transform translate-y-1/2">
            <SearchBar
              filter={search}
              setFilter={setSearch}
              onSubmit={onSubmit}
            />
          </div>
        </div>

        {data.length >= 1 && (
          <>
            <div className="text-white font-semibold text-lg mt-10 mx-3 lg:mx-0">
              Calories chart
            </div>
            <CalorieChart dailyTotals={data} />
            {data.map((nutrient, index) => {
              const isLast = index === data.length - 1;
              return (
                <div key={nutrient.date} className={`${isLast ? "pb-25" : ""}`}>
                  <NutrientInfoGraph
                    totals={nutrient.totals}
                    date={nutrient.date}
                  />
                  <FoodContent foods={nutrient.recipes} />
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
