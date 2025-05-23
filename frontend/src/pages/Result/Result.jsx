import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import { Loader2, BadgeAlert } from "lucide-react";
import { formatText, toSnakeCase, compressImage } from "../../utils";
import UserContext from "../../contexts/createContext/UserContext";
import { variable } from "../../shared";

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
  const { image, prediction, scanCredit, isPremium } = state || {};
  const fetchGuard = useRef(false);
  const { profile } = useContext(UserContext);
  const [intakeStatus, setIntakeStatus] = useState("question");
  const [userResponse, setUserResponse] = useState("");
  const [isFetchingScan, setIsFetchingScan] = useState(false);
  const [scanData, setScanData] = useState(null);
  const loadingMessages = [
    "Identifying…",
    "This may take a moment…",
    "Mapping your food in detail…",
    "Scanning food content…",
  ];
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);
  const [isVisible, setIsVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  // const [foodOnSave, setFoodOnSave] = useState(null);
  // const [isOpen, setIsOpen] = useState(false);
  // const [selected, setSelected] = useState("Default");

  useEffect(() => {
    if (food) return;
    let idx = 0;
    const interval = setInterval(() => {
      // fade-out
      setIsVisible(false);

      setTimeout(() => {
        idx = (idx + 1) % loadingMessages.length;
        setCurrentMessage(loadingMessages[idx]);
        // fade-in
        setIsVisible(true);
      }, 1000);
    }, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [food]);

  useEffect(() => {
    // Guard double fetch on strict mode
    if ((!prediction && !image) || fetchGuard.current) return;
    fetchGuard.current = true;
    const defaultModelCache = JSON.parse(localStorage.getItem("defaultModel"));
    const visionModelCache = JSON.parse(localStorage.getItem("visionModel"));

    if (isPremium || scanCredit > 0) {
      if (visionModelCache) {
        setFood(visionModelCache);
        return;
      }
      fetchByVision(image);
    } else {
      const label = prediction?.predicted_label;
      if (!label) {
        console.error("No label available for premium fetch");
        return;
      }
      if (defaultModelCache) {
        setFood(defaultModelCache);
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
      const res = await fetch(`${variable.API_URL}/food-api/food/${label}`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        localStorage.setItem("defaultModel", JSON.stringify(json.data));

        setFood(json.data);

        saveNewScan(json.data.id, "default");
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

      const resp = await fetch(`${variable.API_URL}/openai/food`, {
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
      // setFood(enriched);
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
      const resp = await fetch(`${variable.API_URL}/openai/food-vision`, {
        method: "POST",
        credentials: "include",
        body: form,
      });
      if (!resp.ok) throw new Error(`Vision API ${resp.status}`);

      const { recipe, imageUrl } = await resp.json();

      // setFood(recipe);

      const formatPredictedName = toSnakeCase(recipe.predicted_label);
      const visionRecipe = {
        ...recipe,
        predicted_name: formatPredictedName,
      };
      await reduceUserCredit(profile.user.id);
      await storeScanAndRecipe(visionRecipe, "vision", imageUrl);
    } catch (err) {
      console.error("Vision fetch failed", err);
    }
  }

  async function saveNewScan(recipeId, scanMode) {
    try {
      setIsFetchingScan(true);
      const compressed = await compressImage(image);
      // upload
      const blob = await (await fetch(compressed)).blob();
      const form = new FormData();
      form.append("image", blob, "photo.jpg");
      form.append("scanMode", scanMode);
      form.append("userId", profile.user.id);
      form.append("recipeId", recipeId);
      const response = await fetch(`${variable.API_URL}/food-api/create/scan`, {
        method: "POST",
        credentials: "include",
        body: form,
      });
      if (!response.ok) {
        setIsFetchingScan(false);
        console.log("Error, ", response.statusText);
      }
      const data = await response.json();

      setScanData(data.scan);
      setIsFetchingScan(false);
    } catch (err) {
      setIsFetchingScan(false);
      console.log("Failed to create new scan, ", err);
    }
  }

  async function storeScanAndRecipe(recipeData, scanMode, image = "") {
    try {
      // upsert recipe
      const recResp = await fetch(`${variable.API_URL}/food-api/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ recipe: recipeData, imageUrl: image, scanMode }),
      });
      if (!recResp.ok) throw new Error("Recipe save failed");
      const { recipe, scan } = await recResp.json();

      setFood(recipe);
      setScanData(scan);

      if (scanMode === "default") {
        localStorage.setItem("defaultModel", JSON.stringify(recipe));
      } else {
        localStorage.setItem("visionModel", JSON.stringify(recipe));
      }
    } catch (err) {
      console.error("Store recipe/scan failed", err);
    }
  }

  async function reduceUserCredit(userId) {
    try {
      const response = await fetch(`${variable.API_URL}/user/reduceCredit`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });
      if (!response.ok) {
        console.log(response.statusText);
      }
      return;
    } catch (err) {
      console.log("Internal server error", err);
    }
  }

  // const toggleDropdown = () => {
  //   setIsOpen(!isOpen);
  // };

  // const selectOption = (option) => {
  //   setSelected(option);
  //   setIsOpen(false);
  // };

  async function saveIntake() {
    try {
      const response = await fetch(`${variable.API_URL}/food-api/save-log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: profile.user.id,
          scanId: scanData.id,
          notes: "",
        }),
      });
      if (!response.ok) {
        console.log("Failed to save log, ", response.statusText);
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (!image) {
    return <Navigate to="/home" replace />;
  }

  function handleIntakeResponse(answer) {
    setUserResponse(answer);
    setIntakeStatus("thanks");

    if (answer === "Yes") {
      saveIntake();
    }
  }
  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-1px); }
      to { opacity: 1; transform: translateY(0); }
    }
        @keyframes slideIn {
      from { opacity: 0; transform: translateX(-100%); }
      to { opacity: 1; transform: translateX(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.5s ease-out forwards;
    }
         .animate-slideIn {
      animation: slideIn 0.5s ease-out forwards;
    }
  `;

  const getAnimationClass = () => {
    if (intakeStatus === "question") {
      return "animate-slideIn";
    } else {
      return "animate-fadeIn";
    }
  };

  return (
    <>
      <style>{animationStyles}</style>

      {!image ? (
        <div className="w-screen h-screen bg-white">No data</div>
      ) : (
        <div className="w-screen overflow-y-auto  bg-neutral-800  flex-col items-center">
          {/* Image Picture */}
          <div className=" lg:max-w-[1000px] mx-auto">
            <div
              className="h-80 inset-0 bg-cover bg-center  "
              style={{
                backgroundImage: `url(${image})`,
              }}
            ></div>

            {!food && (
              <div className="absolute inset-0 overflow-hidden h-80 lg:max-w-[1000px] mx-auto">
                <div className="scan-line" />
              </div>
            )}
          </div>
          {!food && (
            <div
              className={`
     text-white flex justify-center font-semibold
    transition-opacity duration-1000 pt-3 ease-in-out
    ${isVisible ? "opacity-100" : "opacity-0"}
  `}
            >
              {currentMessage}
            </div>
          )}
          {/* Intake Log */}
          <IntakeNotification
            intakeStatus={intakeStatus}
            scanData={scanData}
            food={food}
            handleIntakeResponse={handleIntakeResponse}
            getAnimationClass={getAnimationClass}
            isFetchingScan={isFetchingScan}
            userResponse={userResponse}
          />

          <div className="px-3 py-3 lg:max-w-[1000px] mx-auto">
            <div>
              <div className="flex justify-between">
                {food ? (
                  <p className="text-xl font-semibold text-white">
                    {/* {isPremium
                      ? food.name
                      : formatText(prediction.predicted_label)} */}
                    {food.name}
                  </p>
                ) : (
                  <p className="py-2 h-10 mt-4 w-full bg-neutral-700 rounded animate-pulse"></p>
                )}

                {food ? (
                  <div className="relative inline-block">
                    <button
                      type="button"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                      className="p-1 rounded-full hover:bg-red-50 transition-colors duration-200 focus:outline-none "
                    >
                      <BadgeAlert className="w-5 h-5 text-red-500" />
                    </button>

                    <div
                      role="tooltip"
                      className={`absolute z-50 px-4 py-3 text-sm text-white bg-neutral-700 rounded-xl shadow-lg border border-neutral-700 backdrop-blur-sm
                      top-1/2 right-full mr-3 -translate-y-1/2 w-64
                      transition-all duration-200 ease-out
                      ${
                        showTooltip
                          ? "opacity-100 visible scale-100"
                          : "opacity-0 invisible scale-95"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="font-medium text-md text-white">
                          {scanCredit <= 0 ? "Standard Model" : "Vision Model"}
                        </div>
                        <div className="text-gray-300 text-sm leading-relaxed">
                          {scanCredit <= 0
                            ? "Standard scanning is powered by the 101-food model, a curated dataset of 101 common foods without using any credits."
                            : "Advanced scanning is enabled using vision AI. When credits are depleted, the system will automatically switch to the standard model."}
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-gray-700">
                          <span className="text-sm text-gray-400">
                            Credits remaining
                          </span>
                          <span className="text-sm font-medium text-blue-400">
                            {scanCredit === 0 ? scanCredit : scanCredit - 1}
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-neutral-700 border-r border-b border-neutral-700 rotate-45"></div>
                    </div>
                  </div>
                ) : null}
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
            <IntakeNotification
              intakeStatus={intakeStatus}
              scanData={scanData}
              food={food}
              handleIntakeResponse={handleIntakeResponse}
              getAnimationClass={getAnimationClass}
              isFetchingScan={isFetchingScan}
              userResponse={userResponse}
              pb="10"
              px="0"
              mb="10"
            />
          </div>
        </div>
      )}
    </>
  );
}

function IntakeNotification({
  intakeStatus,
  scanData,
  food,
  handleIntakeResponse,
  getAnimationClass,
  isFetchingScan,
  userResponse,
  px = "3",
  pb = "3",
  mb = "0",
}) {
  return (
    <>
      {food && intakeStatus !== "hidden" && scanData && (
        <div
          className={`bg-neutral-800 flex flex-col px-${px} pt-3 pb-${pb} transition-all duration-300 lg:max-w-[1000px] mx-auto ease-in-out mb-${mb} ${getAnimationClass()}`}
        >
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
                    aria-label="save intake"
                    onClick={() => handleIntakeResponse("Yes")}
                    className="w-10 bg-green-500 rounded-sm font-semibold text-white mx-2 hover:bg-green-600 transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    aria-label="do not save intake"
                    onClick={() => handleIntakeResponse("No")}
                    className="w-10 bg-red-500 rounded-sm font-semibold text-white ml-2 hover:bg-red-600 transition-colors"
                  >
                    No
                  </button>
                </div>
              </div>
            </>
          ) : isFetchingScan ? (
            <div className="animate-fadeIn flex flex-col items-center py-2">
              <Loader2 className="animate-spin h-6 w-6 text-white mb-2" />
              <span className="text-md text-white font-medium">
                Saving your response...
              </span>
            </div>
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
    </>
  );
}
