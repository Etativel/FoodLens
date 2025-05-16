import { normalizeNutrient } from "../../utils";
import {
  Hamburger,
  Flame,
  Beef,
  Cookie,
  Wheat,
  Apple,
  HeartPulse,
} from "lucide-react";

export function NutritionIcon({ name }) {
  const key = normalizeNutrient(name);

  switch (key) {
    case "calories":
      // matches both "calories" and "Calories"
      return <Flame size={16} className="text-orange-500" />;
    case "protein":
      return <Beef size={16} className="text-red-500" />;
    case "fat":
      return <Cookie size={16} className="text-yellow-500" />;
    case "carbs":
      return <Wheat size={16} className="text-amber-600" />;
    case "fiber":
      // you wanted Wheat for fiber?
      return <Wheat size={16} className="text-green-600" />;
    case "sugar":
      return <Apple size={16} className="text-pink-500" />;
    case "sodium":
      return <Hamburger size={16} className="text-blue-400" />;
    default:
      return null;
  }
}

export default function NutritionFacts({
  food,
  setShowNutritionDetails,
  showNutritionDetails,
}) {
  return (
    <div className="mb-6 mt-3 flex justify-center">
      <div className="max-w-[520px] w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <HeartPulse className="mr-2 text-red-400" size={20} />
            <p className="text-lg font-semibold text-white">Nutrition Facts</p>
          </div>

          <button
            aria-label="show dropdown"
            onClick={() => setShowNutritionDetails(!showNutritionDetails)}
            className="text-sm text-neutral-300 hover:text-blue-800 font-medium"
          >
            {showNutritionDetails ? "Show Less" : "Show Details"}
          </button>
        </div>

        {/* Main nutrition stats */}
        <div className="flex gap-2 mt-3 justify-around">
          {food
            ? food.nutritionItems.slice(0, 4).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center flex-col p-2 rounded-lg"
                >
                  <NutritionIcon name={item.name} />

                  <span className="font-bold text-white text-lg mt-1">
                    {item.value}
                    {item.unit}
                  </span>
                  <span className="text-xs text-neutral-300">{item.name}</span>
                </div>
              ))
            : Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-24 w-20 bg-neutral-700 animate-pulse rounded-lg"
                  ></div>
                ))}
        </div>

        {/* Extended nutrition stats */}
        {showNutritionDetails && food ? (
          <div className="flex gap-2 mt-3 justify-around">
            {food.nutritionItems.slice(4).map((item, index) => (
              <div
                key={index}
                className="flex items-center flex-col p-2 rounded-lg max-w-[520px] w-full"
              >
                <NutritionIcon name={item.name} />
                <span className="font-bold text-white text-lg mt-1">
                  {item.value}
                  {item.unit}
                </span>
                <span className="text-xs text-neutral-300">{item.name}</span>
              </div>
            ))}
          </div>
        ) : (
          showNutritionDetails && (
            <div className="flex gap-2 mt-3 justify-around">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-24 w-20 bg-neutral-700 animate-pulse rounded-lg"
                  ></div>
                ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
