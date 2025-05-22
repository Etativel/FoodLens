import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { variable, Loader } from "../../shared";

import {
  DietaryBadges,
  NutritionFacts,
  NutritionChart,
  Ingredients,
  Instructions,
  Tips,
  Variations,
  CulturalContext,
  FunFacts,
} from "../../components/Result";

export default function ScanDetails() {
  const { foodId } = useParams();
  const { state } = useLocation();
  const { image, recipe } = state || {};
  const [showNutritionDetails, setShowNutritionDetails] = useState(false);
  const [showCulturalContext, setShowCulturalContext] = useState(true);
  const [showFunFacts, setShowFunFacts] = useState(true);
  const [showTips, setShowTips] = useState(true);
  const [showVariations, setShowVariations] = useState(true);
  const [food, setFood] = useState(recipe ?? null);

  useEffect(() => {
    async function fetchFoodDetails() {
      try {
        const response = await fetch(`${variable.API_URL}/food-api/${foodId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          console.log("Failed to retrieve food details, ", response.statusText);
        }

        const data = await response.json();
        console.log("raw API response:", data);
        setFood(data.data);
      } catch (err) {
        console.log(err);
      }
    }
    if (recipe) {
      setFood(recipe);
    } else {
      fetchFoodDetails();
    }
  }, [recipe, foodId]);

  if (!food) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader />;
      </div>
    );
  }

  return (
    <>
      <div className="w-screen overflow-y-auto  bg-neutral-800  flex-col items-center">
        {/* Image Picture */}
        <div className=" lg:max-w-[1000px] mx-auto">
          <div
            className="h-80 inset-0 bg-cover bg-center "
            style={{
              backgroundImage: `url(${image})`,
            }}
          ></div>
        </div>

        <div className="px-3 py-3 lg:max-w-[1000px] mx-auto">
          <div>
            <div className="flex justify-between">
              {food ? (
                <p className="text-xl font-semibold text-white">{food.name}</p>
              ) : (
                <p className="py-2 h-10 mt-4 w-full bg-neutral-700 rounded animate-pulse"></p>
              )}
            </div>

            {food ? (
              <p className="py-2 text-md text-neutral-300">{food.summary}</p>
            ) : (
              <div className="py-2 h-10 mt-4 w-full bg-neutral-700 rounded animate-pulse"></div>
            )}
          </div>

          {/* Dietary Badges */}
          <DietaryBadges food={food} />
          <NutritionFacts
            food={food}
            setShowNutritionDetails={setShowNutritionDetails}
            showNutritionDetails={showNutritionDetails}
          />
          <NutritionChart food={food} />
          <Ingredients food={food} />
          <Instructions food={food} />
          <Tips setShowTips={setShowTips} showTips={showTips} food={food} />
          <Variations
            setShowVariations={setShowVariations}
            showVariations={showVariations}
            food={food}
          />
          <CulturalContext
            food={food}
            setShowCulturalContext={setShowCulturalContext}
            showCulturalContext={showCulturalContext}
          />
          <FunFacts
            food={food}
            setShowFunFacts={setShowFunFacts}
            showFunFacts={showFunFacts}
          />
        </div>
      </div>
    </>
  );
}
