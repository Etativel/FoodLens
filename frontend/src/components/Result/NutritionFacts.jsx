import {
  Tag,
  Hamburger,
  Flame,
  Beef,
  Cookie,
  Wheat,
  Apple,
  HeartPulse,
} from "lucide-react";

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
                  {item.name === "calories" && (
                    <Flame size={16} className="text-orange-500" />
                  )}
                  {item.name === "protein" && (
                    <Beef size={16} className="text-red-500" />
                  )}
                  {item.name === "fat" && (
                    <Cookie size={16} className="text-yellow-500" />
                  )}
                  {item.name === "carbs" && (
                    <Wheat size={16} className="text-amber-600" />
                  )}

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
                {item.name === "fiber" && (
                  <Wheat size={16} className="text-green-600" />
                )}
                {item.name === "sugar" && (
                  <Apple size={16} className="text-pink-500" />
                )}
                {item.name === "sodium" && (
                  <Hamburger size={16} className="text-blue-400" />
                )}
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
