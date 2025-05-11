import SearchBar from "../../components/SearchBar/SearchBar";
import { UseDailyTotals } from "../../utils";
import { NutrientInfoGraph, FoodContent } from "../../shared";

export default function Calories() {
  const { dailyTotals } = UseDailyTotals();

  return (
    <div className="flex flex-col h-screen lg:max-w-[500px] md:max-w-[500px]">
      <div className=" flex-1 overflow-y-auto bg-neutral-900 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -ms-overflow-style:none">
        <div className="flex flex-col bg-neutral-900 sticky z-10 top-0 h-10 justify-end ">
          <div className="transform translate-y-1/2">
            <SearchBar />
          </div>
        </div>
        {dailyTotals &&
          dailyTotals.map((nutrient, index) => {
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
      </div>
    </div>
  );
}
