import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Tag, ChevronDown, ChevronUp } from "lucide-react";
import { formatText, toSnakeCase } from "../../utils";
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

const badgeLookup = {
  "Low-Carb": {
    name: "Low-Carb",
    color: "bg-emerald-500",
    icon: <Tag size={14} className="opacity-80" />,
  },
  "High-Protein": {
    name: "High-Protein",
    color: "bg-blue-500",
    icon: <Tag size={14} className="opacity-80" />,
  },
  "Gluten-Free": {
    name: "Gluten-Free",
    color: "bg-purple-500",
    icon: <Tag size={14} className="opacity-80" />,
  },
  Vegan: {
    name: "Vegan",
    color: "bg-green-600",
    icon: <Tag size={14} className="opacity-80" />,
  },
  Vegetarian: {
    name: "Vegetarian",
    color: "bg-lime-600",
    icon: <Tag size={14} className="opacity-80" />,
  },
  "Dairy-Free": {
    name: "Dairy-Free",
    color: "bg-yellow-500",
    icon: <Tag size={14} className="opacity-80" />,
  },
  "Low-Calorie": {
    name: "Low-Calorie",
    color: "bg-red-400",
    icon: <Tag size={14} className="opacity-80" />,
  },
  "Keto-Friendly": {
    name: "Keto-Friendly",
    color: "bg-pink-500",
    icon: <Tag size={14} className="opacity-80" />,
  },
  Paleo: {
    name: "Paleo",
    color: "bg-orange-500",
    icon: <Tag size={14} className="opacity-80" />,
  },
  "Heart-Healthy": {
    name: "Heart-Healthy",
    color: "bg-rose-600",
    icon: <Tag size={14} className="opacity-80" />,
  },
  "Low-Sodium": {
    name: "Low-Sodium",
    color: "bg-sky-500",
    icon: <Tag size={14} className="opacity-80" />,
  },
};

export default function Results() {
  const { state } = useLocation();
  const [showNutritionDetails, setShowNutritionDetails] = useState(false);
  const [showCulturalContext, setShowCulturalContext] = useState(true);
  const [showFunFacts, setShowFunFacts] = useState(true);
  const [showTips, setShowTips] = useState(true);
  const [showVariations, setShowVariations] = useState(true);
  const [food, setFood] = useState(null);
  const { image, prediction } = state || {};
  const fetchGuard = useRef(false);
  // const [isOpen, setIsOpen] = useState(false);
  // const [selected, setSelected] = useState("Default");

  const isPremium = false;

  useEffect(() => {
    // Guard double fetch on strict mode
    if ((!prediction && !image) || fetchGuard.current) return;
    fetchGuard.current = true;

    if (isPremium) {
      fetchByVision(image);
    } else {
      const label = prediction?.predicted_label;
      if (!label) {
        console.error("No label available for premium fetch");
        return;
      }

      fetchOldModel(label);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prediction, image, isPremium]);

  async function fetchOldModel(label) {
    try {
      const res = await fetch(`http://localhost:3000/food-api/food/${label}`);
      if (res.ok) {
        const json = await res.json();
        setFood(json.data);
      } else if (res.status === 404) {
        await fetchFromOpenAi(label);
      } else {
        throw new Error(res.statusText);
      }
    } catch (err) {
      console.error("Fetch failed, falling back:", err);
      await fetchFromOpenAi(label);
    }
  }
  async function fetchFromOpenAi(label) {
    try {
      const resp = await fetch("http://localhost:3000/openai/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: label }),
      });
      const { recipe } = await resp.json();
      const enriched = {
        ...recipe,
        name: formatText(label),
        predicted_name: label,
      };
      setFood(enriched);
      await storeScanAndRecipe(enriched, "default", "");
    } catch (err) {
      console.error("OpenAI fallback failed", err);
    }
  }

  async function fetchByVision(imageDataUrl) {
    try {
      const img = new Image();
      img.src = imageDataUrl;
      await new Promise((r, e) => {
        img.onload = r;
        img.onerror = e;
      });
      const maxDim = 1024;
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > height && width > maxDim) {
        height = (height * maxDim) / width;
        width = maxDim;
      } else if (height > maxDim) {
        width = (width * maxDim) / height;
        height = maxDim;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL("image/jpeg", 0.7);

      // upload
      const blob = await (await fetch(compressed)).blob();
      const form = new FormData();
      form.append("image", blob, "photo.jpg");
      const resp = await fetch("http://localhost:3000/openai/food-vision", {
        method: "POST",
        body: form,
      });
      if (!resp.ok) throw new Error(`Vision API ${resp.status}`);

      const { recipe, imageUrl } = await resp.json();

      setFood(recipe);

      const formatPredictedName = toSnakeCase(recipe.predicted_label);
      const visionRecipe = {
        ...recipe,
        predicted_name: formatPredictedName,
      };

      await storeScanAndRecipe(visionRecipe, "vision", imageUrl);
    } catch (err) {
      console.error("Vision fetch failed", err);
    }
  }

  async function storeScanAndRecipe(recipeData, scanMode, image = "") {
    try {
      // upsert recipe
      const recResp = await fetch("http://localhost:3000/food-api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipe: recipeData, imageUrl: image, scanMode }),
      });
      if (!recResp.ok) throw new Error("Recipe save failed");
      await recResp.json();
    } catch (err) {
      console.error("Store recipe/scan failed", err);
    }
  }

  // const toggleDropdown = () => {
  //   setIsOpen(!isOpen);
  // };

  // const selectOption = (option) => {
  //   setSelected(option);
  //   setIsOpen(false);
  // };

  if (!image || !prediction) {
    return <Navigate to="/home" replace />;
  }

  return (
    <>
      {!image ? (
        <div className="w-screen h-screen bg-white">No data</div>
      ) : (
        <div className="w-screen overflow-y-auto lg:flex lg:justify-center bg-neutral-800 lg:max-w-[600px] lg:flex-col">
          {/* Image Picture */}
          <div
            className="h-80 inset-0 bg-cover bg-center  lg:max-w-[600px]"
            style={{
              backgroundImage: `url(${image})`,
            }}
          ></div>
          <div className="px-3 py-3">
            <div>
              <div className="flex justify-between">
                {food ? (
                  <p className="text-lg font-semibold text-white">
                    {isPremium
                      ? food.name
                      : formatText(prediction.predicted_label)}
                  </p>
                ) : (
                  <p className="py-2 h-10 mt-4 w-full bg-neutral-700 rounded animate-pulse"></p>
                )}

                {/* {food ? (
                  <div className="relative w-48">
                    <button
                      onClick={toggleDropdown}
                      className="flex items-center justify-between ml-auto px-2 py-2 text-sm font-sm text-white bg-neutral-700 border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 "
                    >
                      <span>Prediction: {selected}</span>
                      <ChevronDown
                        className={`w-4 h-4 ml-2 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-neutral-700 rounded-md shadow-lg">
                        <ul className="py-1 overflow-auto text-sm text-white max-h-60">
                          <li
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                              selected === "Default" ? "" : ""
                            }`}
                            onClick={() => selectOption("Default")}
                          >
                            Default
                          </li>
                          <li
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                              selected === "Vision" ? "" : ""
                            }`}
                            onClick={() => selectOption("Vision")}
                          >
                            Vision
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  ""
                )} */}
              </div>

              {food ? (
                <p className="py-2 text-sm text-neutral-300">{food.summary}</p>
              ) : (
                <div className="py-2 h-10 mt-4 w-full bg-neutral-700 rounded animate-pulse"></div>
              )}
            </div>

            {/* Dietary Badges */}
            <DietaryBadges food={food} badgeLookup={badgeLookup} />
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
      )}
    </>
  );
}
