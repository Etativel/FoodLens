import SearchBar from "../../components/SearchBar/SearchBar";
import { UseDailyTotals } from "../../utils";
import { NutrientInfoGraph, FoodContent } from "../../shared";
import { ScanIcon } from "lucide-react";
import CalorieChart from "./CaloriesLineChart";

export default function Calories() {
  const { dailyTotals } = UseDailyTotals();
  console.log(dailyTotals);
  return (
    <div className="flex flex-col h-screen lg:max-w-[500px] md:max-w-[500px] ">
      <div className=" flex-1 overflow-y-auto bg-neutral-900 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -ms-overflow-style:none">
        <div className="flex flex-col bg-neutral-900 sticky z-10 top-0 h-10 justify-end ">
          <div className="transform translate-y-1/2">
            <SearchBar />
          </div>
        </div>

        {dailyTotals.length >= 1 ? (
          <>
            <div className="text-white font-semibold text-lg mt-10 mx-3">
              Calories chart
            </div>
            <CalorieChart dailyTotals={dailyTotals} />
            {dailyTotals.map((nutrient, index) => {
              const isLast = index === dailyTotals.length - 1;
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
        ) : (
          <div className="flex flex-col items-center justify-center text-white mt-50 mx-4 text-center">
            <ScanIcon size={48} className="text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Food Entries Yet</h2>
            <p className="text-gray-400 mb-6">
              Start scanning your food to track your daily calories and
              nutrients.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
