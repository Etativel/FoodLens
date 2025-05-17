import { Flame, Soup } from "lucide-react";
import { useContext } from "react";
import UserContext from "../contexts/createContext/UserContext";

function AdditionalNutrient({ totals, label, keyName, max, unit, color }) {
  const current = totals?.[keyName]?.current || 0;
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <>
      <div className="mb-1 mt-2 flex justify-between text-white">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-sm">
          {current}
          <span className="text-white opacity-[70%]">/</span>
          {max}
          <span className="text-white opacity-[70%]"> {unit}</span>
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
        <div
          className={`${color} h-2.5 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </>
  );
}

function NutrientTrackerComponent({
  totals,
  proteinLimit,
  carbohydrateLimit,
  fatLimit,
}) {
  const normalize = (key) => totals?.[key]?.current ?? 0;

  const nutrients = [
    {
      name: "Protein",
      current: normalize("protein") || 0,
      target: proteinLimit,
      color: "bg-blue-500",
      accentColor: "bg-blue-600",
    },
    {
      name: "Carbs",
      current: normalize("carbs") || 0,
      target: carbohydrateLimit,
      color: "bg-green-500",
      accentColor: "bg-green-600",
    },
    {
      name: "Fat",
      current: normalize("fat") || 0,
      target: fatLimit,
      color: "bg-yellow-500",
      accentColor: "bg-yellow-600",
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
              <div className="w-full bg-gray-700 rounded-full h-2.5 mb-1">
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

export default function NutrientInfoGraph({ totals, date }) {
  const { profile } = useContext(UserContext);
  if (!profile?.user) {
    return (
      <div className="flex">
        <div className="h-60 w-full mt-1 mx-3 rounded-sm flex flex-col animate-pulse bg-neutral-800"></div>
      </div>
    );
  }
  const {
    calorieLimit,
    sodiumLimit,
    fiberLimit,
    sugarLimit,
    carbohydrateLimit,
    fatLimit,
    proteinLimit,
  } = profile.user;
  const calorieGoal = calorieLimit;

  const caloriesConsumed = totals.calories?.current || 0;
  const caloriesRemaining = Math.max(0, calorieGoal - caloriesConsumed);
  const caloriePercentage = Math.min(
    100,
    (caloriesConsumed / calorieGoal) * 100
  );

  const circleRadius = 16;
  const circumference = 2 * Math.PI * circleRadius;
  const dashOffset = circumference - (caloriePercentage / 100) * circumference;

  const additionalNutrients = [
    {
      label: "Sodium",
      key: "sodium",
      max: sodiumLimit,
      unit: "mg",
      color: "bg-red-500",
      accentColor: "bg-red-600",
    },
    {
      label: "Fiber",
      key: "fiber",
      max: fiberLimit,
      unit: "g",
      color: "bg-purple-500",
      accentColor: "bg-purple-600",
    },
    {
      label: "Sugar",
      key: "sugar",
      max: sugarLimit,
      unit: "g",
      color: "bg-orange-500",
      accentColor: "bg-orange-600",
    },
  ];

  return (
    <div className=" flex-1 bg-neutral-900 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -ms-overflow-style:none">
      <div className="flex flex-col ">
        {/* Date */}
        <div className="text-white text-lg font-sm mt-5 mx-3">
          <div className="text-white text-lg font-sm   font-semibold">
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
                      className="stroke-current text-blue-400"
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
                    <span className="text-center text-lg font-semibold text-blue-300 block">
                      {caloriesRemaining}
                    </span>
                    <span className="text-center text-md text-gray-400 block">
                      Kcal
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <NutrientTrackerComponent
                  totals={totals}
                  proteinLimit={proteinLimit}
                  carbohydrateLimit={carbohydrateLimit}
                  fatLimit={fatLimit}
                />
              </div>
              <div className="mt-5">
                {additionalNutrients.map((nutrient) => (
                  <AdditionalNutrient
                    key={nutrient.key}
                    totals={totals}
                    label={nutrient.label}
                    keyName={nutrient.key}
                    max={nutrient.max}
                    unit={nutrient.unit}
                    color={nutrient.color}
                  />
                ))}
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
