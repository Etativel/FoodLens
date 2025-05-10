import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import { Tag } from "lucide-react";
import { formatText, toSnakeCase, compressImage } from "../../utils";
import UserContext from "../../contexts/createContext/UserContext";

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
  const { profile } = useContext(UserContext);
  const [intakeStatus, setIntakeStatus] = useState("question");
  const [userResponse, setUserResponse] = useState("");
  // const [isOpen, setIsOpen] = useState(false);
  // const [selected, setSelected] = useState("Default");

  console.log(profile);

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

  useEffect(() => {
    if (intakeStatus === "thanks") {
      const timer = setTimeout(() => {
        setIntakeStatus("hidden");
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [intakeStatus]);

  async function fetchOldModel(label) {
    try {
      const res = await fetch(`http://localhost:3000/food-api/food/${label}`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        console.log(json.data);

        setFood(json.data);
      } else if (res.status === 404) {
        await fetchFromOpenAi(label, image);
      } else {
        throw new Error(res.statusText);
      }
    } catch (err) {
      console.error("Fetch failed, falling back:", err);
      await fetchFromOpenAi(label, image);
    }
  }

  async function fetchFromOpenAi(label, imageDataUrl) {
    try {
      const compressed = await compressImage(imageDataUrl);
      // upload
      const blob = await (await fetch(compressed)).blob();
      const form = new FormData();
      form.append("image", blob, "photo.jpg");
      form.append("input", label);

      const resp = await fetch("http://localhost:3000/openai/food", {
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: form,
      });
      const { recipe, imageUrl } = await resp.json();
      const enriched = {
        ...recipe,
        name: formatText(label),
        predicted_name: label,
      };
      setFood(enriched);
      await storeScanAndRecipe(enriched, "default", imageUrl);
    } catch (err) {
      console.error("OpenAI fallback failed", err);
    }
  }

  async function fetchByVision(imageDataUrl) {
    try {
      const compressed = await compressImage(imageDataUrl);
      // upload
      const blob = await (await fetch(compressed)).blob();
      const form = new FormData();
      form.append("image", blob, "photo.jpg");
      const resp = await fetch("http://localhost:3000/openai/food-vision", {
        method: "POST",
        credentials: "include",
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

  async function saveNewScan() {
    try {
      const compressed = await compressImage(image);
      // upload
      const blob = await (await fetch(compressed)).blob();
      const form = new FormData();
      form.append("image", blob, "photo.jpg");
      form.append("scanMode", isPremium ? "vision" : "default");
      form.append("userId", profile.user.id);
      form.append("recipeId", food.id);
      const response = await fetch(
        "http://localhost:3000/food-api/create/scan",
        {
          method: "POST",
          credentials: "include",
          body: form,
        }
      );
      if (!response.ok) {
        console.log("Error, ", response.statusText);
      }
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log("Failed to create new scan, ", err);
    }
  }

  async function storeScanAndRecipe(recipeData, scanMode, image = "") {
    try {
      // upsert recipe
      const recResp = await fetch("http://localhost:3000/food-api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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

  function handleIntakeResponse(answer) {
    setUserResponse(answer);
    setIntakeStatus("thanks");

    if (answer === "Yes") {
      saveNewScan();
    }
  }
  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fadeIn {
      animation: fadeIn 0.5s ease-out forwards;
    }
  `;

  return (
    <>
      <style>{animationStyles}</style>
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
          {/* Intake Log */}
          {food && intakeStatus !== "hidden" && (
            <div className="bg-neutral-800 flex flex-col px-3 pt-3 pb-3 transition-all duration-300 ease-in-out">
              {intakeStatus === "question" ? (
                <>
                  <div className="text-lg font-semibold text-white">
                    Help us track your daily intake
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-md text-neutral-300">
                      Did you eat this today?
                    </div>
                    <div>
                      <button
                        onClick={() => handleIntakeResponse("Yes")}
                        className="w-10 bg-green-500 rounded-sm font-semibold text-white mx-2 hover:bg-green-600 transition-colors"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => handleIntakeResponse("No")}
                        className="w-10 bg-red-500 rounded-sm font-semibold text-white ml-2 hover:bg-red-600 transition-colors"
                      >
                        No
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="animate-fadeIn flex flex-col items-center py-2">
                  <div className="text-lg font-semibold text-white mb-1">
                    Thank you for your response!
                  </div>
                  <div className="text-md text-neutral-300">
                    {userResponse === "Yes"
                      ? "We've logged this item to your daily intake."
                      : "No problem, we won't add this to your tracking."}
                  </div>
                </div>
              )}
            </div>
          )}

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
      )}
    </>
  );
}
