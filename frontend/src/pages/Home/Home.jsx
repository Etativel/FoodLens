import SearchBar from "../../components/SearchBar/SearchBar";
import foodLensIcon from "../../assets/icons/FoodLensIcon.png";
import { Flame, Soup } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/createContext/UserContext";

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

function Home() {
  const { profile } = useContext(UserContext);
  const [totals, setTotals] = useState({
    protein: { current: 0, unit: "g" },
    carbs: { current: 0, unit: "g" },
    fat: { current: 0, unit: "g" },
    calories: { current: 0, unit: "kcal" },
    fiber: { current: 0, unit: "g" },
    sodium: { current: 0, unit: "mg" },
    sugar: { current: 0, unit: "g" },
  });
  const calorieGoal = 1600;

  console.log(totals);

  useEffect(() => {
    const scans = profile?.user?.scans || [];
    const baseTotals = {
      protein: { current: 0, unit: "g" },
      carbs: { current: 0, unit: "g" },
      fat: { current: 0, unit: "g" },
      calories: { current: 0, unit: "kcal" },
      fiber: { current: 0, unit: "g" },
      sodium: { current: 0, unit: "mg" },
      sugar: { current: 0, unit: "g" },
    };

    if (!scans.length) {
      setTotals(baseTotals);
      return;
    }

    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )}`;

    const todayScans = scans.filter(
      ({ scannedAt }) => scannedAt.slice(0, 10) === todayStr
    );

    const normalize = (name) => {
      const lower = name.toLowerCase();
      if (lower === "carbohydrates") return "carbs";
      return lower;
    };

    const rawTotals = todayScans.reduce(
      (acc, scan) => {
        scan.recipe.nutritionItems.forEach(({ name, value, unit }) => {
          const key = normalize(name);

          if (!acc[key]) {
            acc[key] = {
              name: key,
              current: 0,
              unit,
              color: "",
            };
          }

          acc[key].current += value;
        });

        return acc;
      },
      { ...baseTotals }
    );

    setTotals(rawTotals);
  }, [profile]);

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
    <div className="flex flex-col h-screen lg:max-w-[500px] md:max-w-[500px]">
      <div className="flex flex-col bg-neutral-900 sticky z-10 top-0 h-10 justify-end ">
        {/* <div className="bg-neutral-800 z-10 mb-auto flex justify-between">
          <div>Location</div>
          <div>Lang</div>
        </div> */}
        <div className="transform translate-y-1/2">
          {/* translate-y-1/2*/}
          <SearchBar />
        </div>
      </div>

      <div className=" flex-1 overflow-y-auto bg-neutral-900 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -ms-overflow-style:none">
        <div className="flex flex-col  pb-20">
          {/* Date */}
          <div className="text-white text-lg font-sm mt-10 mx-3">
            <p>Today, May 09</p>
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

          <div className="flex justify-evenly mt-10 mb-10">
            <div className="flex flex-col justify-center items-center h-20 w-24 bg-neutral-800 text-gray-300 hover:bg-blue-500 hover:text-white drop-shadow-xl hover:shadow-[0_0_16px_rgba(59,130,246,0.5)] rounded-sm transition-colors duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#b388ff"
                className="h-8 w-8"
              >
                <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                <path
                  fillRule="evenodd"
                  d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                  clipRule="evenodd"
                />
              </svg>

              <p className="font-semibold text-md text-natural-400">Scan</p>
            </div>
            <div className="flex flex-col justify-center items-center h-20 w-24 bg-neutral-800 text-gray-300 hover:bg-blue-500 hover:text-white drop-shadow-xl hover:shadow-[0_0_16px_rgba(59,130,246,0.5)] rounded-sm transition-colors duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#feae30"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M6.32 1.827a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V19.5a3 3 0 0 1-3 3H6.75a3 3 0 0 1-3-3V4.757c0-1.47 1.073-2.756 2.57-2.93ZM7.5 11.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H8.25a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H8.25Zm-.75 3a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H8.25a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V18a.75.75 0 0 0-.75-.75H8.25Zm1.748-6a.75.75 0 0 1 .75-.75h.007a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.007a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.335.75.75.75h.007a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-.007Zm-.75 3a.75.75 0 0 1 .75-.75h.007a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.007a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.335.75.75.75h.007a.75.75 0 0 0 .75-.75V18a.75.75 0 0 0-.75-.75h-.007Zm1.754-6a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-.008Zm-.75 3a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V18a.75.75 0 0 0-.75-.75h-.008Zm1.748-6a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-.008Zm-8.25-6A.75.75 0 0 1 8.25 6h7.5a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75v-.75Zm9 9a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-2.25Z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="font-semibold text-md">Calories</p>
            </div>
            <div className="flex flex-col justify-center items-center h-20 w-24 bg-neutral-800 text-gray-300 hover:bg-blue-500 hover:text-white drop-shadow-xl hover:shadow-[0_0_16px_rgba(59,130,246,0.5)] rounded-sm transition-colors duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#30bf85"
                className="h-8 w-8"
              >
                <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
                <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
              </svg>

              <p className="font-semibold text-md">Recipes</p>
            </div>
          </div>

          {/* Trending Recipes */}
          {/* <div className=" mx-3 flex flex-col mt-2 ">
            <span className="text-lg font-semibold text-white">
              Trending Recipes
            </span>
            <div className="overflow-x-auto whitespace-nowrap mt-2 mb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -ms-overflow-style:none ">
              <div className="inline-block mx-1">
                <div className="bg-transparent rounded-sm h-40 w-50 flex flex-col justify-end overflow-hidden">
                  <div className="h-full w-full">
                    <img
                      src="https://www.allrecipes.com/thmb/RMuYXLYcV_DKnGuYwc1x0jLrYTo=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/256306-mexican-hash-4x3-ea7194e395e34ada9378707e4b793da1.jpg"
                      alt="Fried rice"
                      className="h-full w-full object-cover rounded-t-sm"
                    />
                  </div>

                  <div className="bg-neutral-800 text-white pl-2 font-semibold py-1 rounded-b-sm">
                    Fried rice
                  </div>
                </div>
              </div>

              <div className="inline-block mx-1">
                <div className="bg-transparent rounded-sm h-40 w-50 flex flex-col justify-end overflow-hidden">
                  <div className="h-full w-full">
                    <img
                      src="https://www.allrecipes.com/thmb/SbPEC3DrpMgxVWzVw2yf1-aEOjU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/11699665-meat-lovers-cheddar-biscuit-sandwich-4x3-6f9dd7c9e0194501ab8ff8a346eb0d30.jpg"
                      alt="Fried rice"
                      className="h-full w-full object-cover rounded-t-sm"
                    />
                  </div>

                  <div className="bg-neutral-800 text-white pl-2 font-semibold py-1 rounded-b-sm">
                    Fried rice
                  </div>
                </div>
              </div>
              <div className="inline-block mx-1">
                <div className="bg-transparent rounded-sm h-40 w-50 flex flex-col justify-end overflow-hidden">
                  <div className="h-full w-full">
                    <img
                      src="https://www.allrecipes.com/thmb/SbPEC3DrpMgxVWzVw2yf1-aEOjU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/11699665-meat-lovers-cheddar-biscuit-sandwich-4x3-6f9dd7c9e0194501ab8ff8a346eb0d30.jpg"
                      alt="Fried rice"
                      className="h-full w-full object-cover rounded-t-sm"
                    />
                  </div>

                  <div className="bg-neutral-800 text-white pl-2 font-semibold py-1 rounded-b-sm">
                    Fried rice
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Local Foods */}
          {/* <div className=" mx-3 flex flex-col mt-7">
            <span className="text-lg font-semibold text-white">
              Your Local Food
            </span>
            <div className="overflow-x-auto whitespace-nowrap mt-2 mb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -ms-overflow-style:none">
              <div className="inline-block mx-1">
                <div className="bg-transparent rounded-sm h-40 w-50 flex flex-col justify-end overflow-hidden">
                  <div className="h-full w-full">
                    <img
                      src="https://www.allrecipes.com/thmb/SbPEC3DrpMgxVWzVw2yf1-aEOjU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/11699665-meat-lovers-cheddar-biscuit-sandwich-4x3-6f9dd7c9e0194501ab8ff8a346eb0d30.jpg"
                      alt="Fried rice"
                      className="h-full w-full object-cover rounded-t-sm"
                    />
                  </div>

                  <div className="bg-neutral-800 text-white pl-2 font-semibold py-1 rounded-b-sm">
                    Fried rice
                  </div>
                </div>
              </div>

              <div className="inline-block mx-1">
                <div className="bg-transparent rounded-sm h-40 w-50 flex flex-col justify-end overflow-hidden">
                  <div className="h-full w-full">
                    <img
                      src="https://www.allrecipes.com/thmb/SbPEC3DrpMgxVWzVw2yf1-aEOjU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/11699665-meat-lovers-cheddar-biscuit-sandwich-4x3-6f9dd7c9e0194501ab8ff8a346eb0d30.jpg"
                      alt="Fried rice"
                      className="h-full w-full object-cover rounded-t-sm"
                    />
                  </div>

                  <div className="bg-neutral-800 text-white pl-2 font-semibold py-1 rounded-b-sm">
                    Fried rice
                  </div>
                </div>
              </div>
              <div className="inline-block mx-1">
                <div className="bg-transparent rounded-sm h-40 w-50 flex flex-col justify-end overflow-hidden">
                  <div className="h-full w-full">
                    <img
                      src="https://www.allrecipes.com/thmb/SbPEC3DrpMgxVWzVw2yf1-aEOjU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/11699665-meat-lovers-cheddar-biscuit-sandwich-4x3-6f9dd7c9e0194501ab8ff8a346eb0d30.jpg"
                      alt="Fried rice"
                      className="h-full w-full object-cover rounded-t-sm"
                    />
                  </div>

                  <div className="bg-neutral-800 text-white pl-2 font-semibold py-1 rounded-b-sm">
                    Fried rice
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Topics */}
          {/* <div className="px-3 pt-3 flex flex-col mt-7 bg-neutral-800  ">
            <span className="text-lg font-semibold text-white">Topics</span>
            <div className="overflow-x-auto whitespace-nowrap mt-2 mb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -ms-overflow-style:none">
              <div className="inline-block mx-1">
                <div className="bg-transparent rounded-sm h-40 w-50 flex flex-col justify-end overflow-hidden">
                  <div className="h-full w-full">
                    <img
                      src="https://www.allrecipes.com/thmb/FmMHiogj-CWhU1lY4iXTyWeVmEQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/11699652-strawberry-banana-blended-baked-oats-4x3-58bc4afb95364c8da217c3bec2d57b4a.jpg"
                      alt="Fried rice"
                      className="h-full w-full object-cover rounded-t-sm"
                    />
                  </div>

                  <div className="bg-neutral-800 text-white pl-2 font-semibold py-1 rounded-b-sm">
                    Fried rice
                  </div>
                </div>
              </div>

              <div className="inline-block mx-1 border-t border-t-solid border-t-1px">
                <div className="bg-transparent rounded-sm h-40 w-50 flex flex-col justify-end overflow-hidden">
                  <div className="h-full w-full">
                    <img
                      src="https://www.allrecipes.com/thmb/SbPEC3DrpMgxVWzVw2yf1-aEOjU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/11699665-meat-lovers-cheddar-biscuit-sandwich-4x3-6f9dd7c9e0194501ab8ff8a346eb0d30.jpg"
                      alt="Fried rice"
                      className="h-full w-full object-cover rounded-t-sm"
                    />
                  </div>

                  <div className="bg-neutral-800 text-white pl-2 font-semibold py-1 rounded-b-sm">
                    Fried rice
                  </div>
                </div>
              </div>
              <div className="inline-block mx-1">
                <div className="bg-transparent rounded-sm h-40 w-50 flex flex-col justify-end overflow-hidden">
                  <div className="h-full w-full">
                    <img
                      src="https://www.allrecipes.com/thmb/SbPEC3DrpMgxVWzVw2yf1-aEOjU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/11699665-meat-lovers-cheddar-biscuit-sandwich-4x3-6f9dd7c9e0194501ab8ff8a346eb0d30.jpg"
                      alt="Fried rice"
                      className="h-full w-full object-cover rounded-t-sm"
                    />
                  </div>

                  <div className="bg-neutral-800 text-white pl-2 font-semibold py-1 rounded-b-sm">
                    Fried rice
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          <div className="h-40 flex justify-center items-center bg-neutral-800 text-white flex-col border-t border-neutral-600">
            <img className="size-15" src={foodLensIcon} alt="" />
            <p className="text-[#8e8e8e] font-semibold">
              The Nutritionist in Your Pocket
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
