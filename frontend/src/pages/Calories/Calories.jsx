import { useState, useEffect, useContext } from "react";
import UserContext from "../../contexts/createContext/UserContext";
import { Flame, Soup } from "lucide-react";
import SearchBar from "../../components/SearchBar/SearchBar";

const NUTRIENTS = {
  protein: "g",
  carbs: "g",
  fat: "g",
  calories: "kcal",
  fiber: "g",
  sodium: "mg",
  sugar: "g",
};

function NutrientTrackerComponent({ totals }) {
  const normalize = (key) => totals?.[key]?.current ?? 0;

  const nutrients = [
    {
      name: "Protein",
      current: normalize("protein") || 0,
      target: 80,
      color: "bg-blue-500",
    },
    {
      name: "Carbs",
      current: normalize("carbs") || 0,
      target: 200,
      color: "bg-green-500",
    },
    {
      name: "Fat",
      current: normalize("fat") || 0,
      target: 90,
      color: "bg-yellow-500",
    },
  ];
  return (
    <div className="mt-4">
      <div className="flex flex-row justify-between gap-4">
        {nutrients.map((nutrient, index) => {
          const percentage = (nutrient.current / nutrient.target) * 100;
          return (
            <div key={index} className="flex-1">
              <div className="mb-1 py-1">
                <span className="text-sm font-medium text-white">
                  {nutrient.name}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div
                  className={`${nutrient.color} h-2.5 rounded-full`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex py-1">
                <span className="text-sm text-white">
                  {nutrient.current}
                  <span className="text-white opacity-[70%]">/</span>
                  {nutrient.target}{" "}
                  <span className="text-white opacity-[70%]">g</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NutrientInfoGraph({ totals, date }) {
  const calorieGoal = 1600;

  const caloriesConsumed = totals.calories?.current || 0;
  const caloriesRemaining = Math.max(0, calorieGoal - caloriesConsumed);
  const caloriePercentage = Math.min(
    100,
    (caloriesConsumed / calorieGoal) * 100
  );

  const circleRadius = 16;
  const circumference = 2 * Math.PI * circleRadius;
  const dashOffset = circumference - (caloriePercentage / 100) * circumference;

  const sodiumPercentage = Math.min((totals.sodium.current / 3000) * 100);

  const fiberPercentage = Math.min((totals.fiber.current / 40) * 100);
  const sugarPercentage = Math.min((totals.sugar.current / 60) * 100);

  return (
    <div className=" flex-1 bg-neutral-900 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -ms-overflow-style:none">
      <div className="flex flex-col ">
        {/* Date */}
        <div className="text-white text-lg font-sm mt-10 mx-3">
          <div className="text-white text-lg font-sm mb-2 mx-3">
            {new Date(date).toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>

        {/* Circular Progress */}
        {totals ? (
          <>
            <div className="mt-1 mx-3 bg-neutral-800 py-4 px-4 rounded-sm flex flex-col">
              <div className="flex w-full justify-between items-center">
                {/* End Circular Progress */}
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col text-white">
                    <span className="flex">
                      <Flame className="text-red-400 mr-2" /> Calorie goal
                    </span>
                    <span className="py-1 text-blue-300 font-semibold">
                      {calorieGoal} kcal
                    </span>
                  </div>
                  <div className="flex flex-col text-white  ">
                    <span className="flex">
                      <Soup className="text-green-300 mr-2" /> Food intake
                    </span>
                    <span className="text-blue-300 font-semibold py-1">
                      {caloriesConsumed} kcal
                    </span>
                  </div>
                </div>
                <div className="relative size-35">
                  <svg
                    className="size-full -rotate-90"
                    viewBox="0 0 36 36"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Background Circle */}
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      className="stroke-current opacity-[20%] text-gray-200"
                      strokeWidth="2"
                    ></circle>
                    {/* Progress Circle */}
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      className="stroke-current text-blue-500"
                      strokeWidth="2"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                    ></circle>
                  </svg>

                  {/* Percentage Text */}
                  <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
                    <span className="text-center text-md block text-gray-400">
                      Remaining
                    </span>
                    <span className="text-center text-lg font-semibold text-blue-500 block">
                      {caloriesRemaining}
                    </span>
                    <span className="text-center text-md text-gray-400 block">
                      Kcal
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <NutrientTrackerComponent totals={totals} />
              </div>
              <div className="mt-5">
                <div class="mb-1 mt-2 flex justify-between text-white">
                  <span className="text-sm font-semibold">Sodium</span>
                  <span className="text-sm">
                    {totals?.sodium.current}
                    <span className="text-white opacity-[70%]">/</span>3000
                    <span className="text-white opacity-[70%]"> mg</span>
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                  <div
                    class="bg-red-500 h-2.5 rounded-full "
                    style={{ width: sodiumPercentage + "%" }}
                  ></div>
                </div>
                <div class="mb-1 mt-2 text-white flex justify-between">
                  <span className="text-sm font-semibold">Fiber</span>
                  <span className="text-sm">
                    {totals?.fiber.current}
                    <span className="text-white opacity-[70%]">/</span>40
                    <span className="text-white opacity-[70%]"> g</span>
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                  <div
                    class="bg-orange-500 h-2.5 rounded-full"
                    style={{ width: fiberPercentage + "%" }}
                  ></div>
                </div>
                <div class="mb-1 mt-2 text-white flex justify-between">
                  <span className="text-sm font-semibold">Sugar</span>
                  <span className="text-sm">
                    {totals?.sugar.current}
                    <span className="text-white opacity-[70%]">/</span>60
                    <span className="text-white opacity-[70%]"> g</span>
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                  <div
                    class="bg-purple-500 h-2.5 rounded-full "
                    style={{ width: sugarPercentage + "%" }}
                  ></div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex">
            <div className="h-60 w-full mt-1 mx-3  rounded-sm flex flex-col animate-pulse bg-neutral-800"></div>
          </div>
        )}
      </div>
    </div>
  );
}
function FoodContent({ foods }) {
  return (
    <div className="flex mx-3 flex-col">
      <div className="text-white mb-2 text-lg font-semibold mt-4">
        What you eat
      </div>
      <div className="flex flex-col gap-2">
        {foods.map((food) => {
          return (
            <div className="flex gap-4 items-center">
              <div
                className="h-20 w-[150px] min-w-[100px] bg-cover bg-center rounded-lg"
                style={{
                  backgroundImage: `url(${food.imageUrl})`,
                }}
              ></div>

              <div className="flex flex-col justify-center text-white">
                <span className="text-lg font-semibold">{food.name}</span>
                <span className="text-sm text-gray-300">{food.summary}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Calories() {
  const { profile } = useContext(UserContext);
  const [dailyTotals, setDailyTotals] = useState([]);

  console.log(dailyTotals);

  console.log(profile?.user?.scans[0].recipe);

  useEffect(() => {
    const scans = profile?.user?.scans || [];
    if (!scans.length) {
      setDailyTotals([]);
      return;
    }
    const normalize = (name) => {
      const lower = name.toLowerCase();
      if (lower === "carbohydrates") return "carbs";
      return lower;
    };

    const groups = scans.reduce((acc, scan) => {
      const dateKey = scan.scannedAt.slice(0, 10);
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          totals: Object.fromEntries(
            Object.entries(NUTRIENTS).map(([key, unit]) => [
              key,
              { current: 0, unit },
            ])
          ),
          recipes: [],
        };
      }
      acc[dateKey].recipes.push({
        name: scan.recipe.name,
        imageUrl: scan.imageUrl,
        summary: scan.recipe.summary,
        nutritionItems: scan.recipe.nutritionItems,
      });

      scan.recipe.nutritionItems.forEach(({ name, value, unit }) => {
        const key = normalize(name);
        if (acc[dateKey].totals[key]) {
          acc[dateKey].totals[key].current += value;
        } else {
          acc[dateKey].totals[key] = { current: value, unit };
        }
      });

      return acc;
    }, {});

    const list = Object.values(groups).sort((a, b) =>
      a.date > b.date ? -1 : 1
    );
    setDailyTotals(list);
  }, [profile]);

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
              <div key={nutrient.date} className={isLast ? "pb-25" : ""}>
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
