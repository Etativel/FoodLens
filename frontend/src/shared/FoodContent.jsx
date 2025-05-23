import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
function FoodCard({ food, redirectToDetails }) {
  const [showNutrient, setShowNutrient] = useState(false);

  return (
    <div className="flex gap-4 items-start ">
      <div
        onClick={() => redirectToDetails(food.id, food.recipe, food.imageUrl)}
        className="h-20 w-[150px] min-w-[100px] bg-cover bg-center rounded-lg mt-2"
        style={{ backgroundImage: `url(${food.imageUrl})` }}
      ></div>

      <div className="flex flex-col justify-center text-white max-w-xs overflow-hidden">
        <div className="flex justify-between">
          <span
            onClick={() =>
              redirectToDetails(food.id, food.recipe, food.imageUrl)
            }
            className="text-lg font-semibold truncate  pr-2 "
          >
            {food.name}
          </span>
          <button
            aria-label="show dropdown"
            onClick={() => setShowNutrient((prev) => !prev)}
          >
            {showNutrient ? (
              <ChevronUp className="w-5 h-5 text-white" strokeWidth={2.5} />
            ) : (
              <ChevronDown className="w-5 h-5 text-white" strokeWidth={2.5} />
            )}
          </button>
        </div>

        <span
          onClick={() => redirectToDetails(food.id, food.recipe, food.imageUrl)}
          className="text-sm text-gray-300"
        >
          {food.summary}
        </span>
        <div className="flex flex-wrap gap-2 mt-1">
          {food.nutritionItems &&
            food.nutritionItems.map((item) => {
              let borderColor = "border-gray-400";
              switch (item.name.toLowerCase()) {
                case "protein":
                  borderColor = "border-blue-400";
                  break;
                case "carbs":
                  borderColor = "border-yellow-400";
                  break;
                case "fat":
                  borderColor = "border-green-400";
                  break;
                case "calories":
                  borderColor = "border-red-400";
                  break;
                case "sodium":
                  borderColor = "border-purple-400";
                  break;
                case "fiber":
                  borderColor = "border-teal-400";
                  break;
                case "sugar":
                  borderColor = "border-pink-400";
                  break;
              }

              return (
                <div
                  key={item.id || item.name}
                  className={`bg-gray-800 border ${borderColor} px-3 py-1 rounded-full text-xs font-medium ${
                    showNutrient ? "" : "hidden"
                  }`}
                >
                  {item.name}: {item.value}
                  {item.unit}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default function FoodContent({ foods }) {
  const navigate = useNavigate();
  function redirectToDetails(id, recipe, image) {
    navigate(`/scan/${id}`, {
      state: { recipe, image },
    });
  }
  return (
    <div className="flex mx-3 flex-col ">
      <div className="text-white mb-2 text-lg font-semibold mt-4">
        Food you eat
      </div>
      <div className="flex flex-col gap-2">
        {foods.map((food, idx) => (
          <FoodCard
            key={idx}
            food={food}
            redirectToDetails={redirectToDetails}
          />
        ))}
      </div>
    </div>
  );
}
