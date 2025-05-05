// src/pages/Results.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatText } from "../../utils";
import DonutChart from "../../components/chart/DonutChart";
import {
  Tag,
  Hamburger,
  Flame,
  Beef,
  Cookie,
  Wheat,
  Apple,
  MessageCircle,
  Book,
  ChevronDown,
  ChevronUp,
  Clock,
  NotepadText,
  Utensils,
  HeartPulse,
  Lightbulb,
  Sparkles,
} from "lucide-react";

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

const dummy = {
  summary:
    "A refreshing, tangy dish made with fresh seafood marinated in citrus juices, often paired with onions, cilantro, and chili peppers.",

  nutritionSnapshot: {
    calories: 200,
    protein: 25,
    fat: 6,
    carbs: 15,
    fiber: 3,
    sugar: 5,
    sodium: 400,
  },
  nutritionItems: [
    {
      name: "calories",
      value: 200,
      unit: "kcal",
    },
    {
      name: "protein",
      value: 25,
      unit: "g",
    },
    {
      name: "fat",
      value: 6,
      unit: "g",
    },
    {
      name: "carbs",
      value: 15,
      unit: "g",
    },
    {
      name: "fiber",
      value: 3,
      unit: "g",
    },
    {
      name: "sugar",
      value: 5,
      unit: "g",
    },
    {
      name: "sodium",
      value: 400,
      unit: "mg",
    },
  ],
  badgeKeys: ["Gluten-Free", "Dairy-Free", "No-Cook"],
  ingredients: [
    {
      group: "Main Ingredients",
      items: [
        "1 lb fresh fish (e.g., sea bass), diced",
        "1 cup lime juice",
        "1/2 cup red onion, thinly sliced",
        "1 jalapeño, seeded and chopped",
        "1/4 cup fresh cilantro, chopped",
      ],
    },
    {
      group: "Optional Ingredients",
      items: ["1 avocado, diced", "1/2 cup tomato, diced", "Salt to taste"],
    },
  ],
  instructions: [
    {
      step: 1,
      description:
        "In a large bowl, combine the fish and lime juice, ensuring the fish is fully submerged.",
      duration: "10 min",
    },
    {
      step: 2,
      description:
        "Cover and refrigerate for 15-20 minutes or until the fish turns opaque.",
      duration: "20 min",
    },
    {
      step: 3,
      description:
        "Add the red onion, jalapeño, and cilantro to the fish mixture.",
      duration: "5 min",
    },
    {
      step: 4,
      description: "Season with salt to taste and gently mix.",
      duration: "2 min",
    },
    {
      step: 5,
      description:
        "Optionally, fold in avocado and tomato just before serving.",
      duration: "2 min",
    },
  ],
  tips: [
    "Ensure the fish is very fresh as it is the key ingredient.",
    "Feel free to use a mix of citrus juices like lime, lemon, and orange.",
    "Keep the ceviche cold, both during preparation and serving, to maintain freshness.",
    "You can use shrimp or scallops as an alternative to fish.",
    "Serve with tortilla chips or lettuce cups for added crunch.",
  ],
  variations: [
    {
      name: "Tropical Ceviche",
      add: "diced mango or pineapple",
      swap: "jalapeño for a milder bell pepper",
    },
    {
      name: "Peruvian Ceviche",
      add: "a pinch of corn and sweet potato slices",
      swap: "jalapeño with Aji amarillo paste",
    },
    {
      name: "Spicy Mexican Ceviche",
      add: "extra chili peppers",
      swap: "lime juice with a mix of lime and orange juices",
    },
  ],
  culturalContext:
    "Ceviche is a beloved dish in Latin American cuisine, particularly in coastal regions, where fresh seafood is abundant.",
  funFacts: [
    "Ceviche is believed to have originated in Peru.",
    "It is recognized as part of Peru's national heritage and is often served with side dishes like corn and sweet potatoes.",
    "The citrus in ceviche not only adds flavor but chemically 'cooks' the seafood through a process known as denaturation.",
    "March 28 is International Ceviche Day.",
  ],
};

export default function Results() {
  const { state } = useLocation();

  const [showDetails, setShowDetails] = useState(false);
  const [showCulturalContext, setShowCulturalContext] = useState(true);
  const [showFunFacts, setShowFunFacts] = useState(true);
  const [showTips, setShowTips] = useState(true);
  const [showVariations, setShowVariations] = useState(true);
  const [food, setFood] = useState(null);
  // const [isFetching, setIsFetching] = useState(false);
  // const [isOpenAiFetch, setIsOpenAiFetch] = useState(false);
  const { image, prediction } = state || {};

  useEffect(() => {
    if (!prediction) return;
    const label = prediction.predicted_label;
    // setIsFetching(true);

    fetch(`http://localhost:3000/food-api/food/${label}`)
      .then((res) => {
        if (res.ok) {
          return res.json().then((data) => {
            setFood(data.data);
          });
        } else if (res.status === 404) {
          return fetchFromOpenAi(label);
        } else {
          throw new Error(res.statusText);
        }
      })
      .catch(() => {
        return fetchFromOpenAi(label);
      });
    // .finally(() => {
    //   setIsFetching(false);
    // });
  }, [prediction]);

  async function fetchFromOpenAi() {
    // setIsOpenAiFetch(true);
    try {
      setTimeout(() => {
        setFood(dummy);
        // setIsOpenAiFetch(false);
      }, 5000);
    } catch (err) {
      console.error("OpenAI fetch failed:", err);
      // setIsOpenAiFetch(false);
    }
  }

  if (!image || !prediction) {
    return <Navigate to="/" replace />;
  }

  // if (isFetching) {
  //   return (
  //     <div className="w-screen h-screen flex items-center justify-center bg-neutral-800">
  //       <div className="mt-4 w-5 h-5 border-t-2 border-blue-500 rounded-full animate-spin" />
  //     </div>
  //   );
  // }

  // if (!food) {
  //   return (
  //     <div className="w-screen h-screen flex items-center justify-center bg-neutral-800 flex-col">
  //       <div className="mt-4 w-5 h-5 border-t-2 border-blue-500 rounded-full animate-spin" />
  //       <p className="text-sm text-gray-300">Processing</p>
  //     </div>
  //   );
  // }

  const chartData =
    food && food.nutritionSnapshot
      ? {
          series: [
            food.nutritionSnapshot.carbs || 0,
            food.nutritionSnapshot.fat || 0,
            food.nutritionSnapshot.protein || 0,
          ],
          labels: ["Carbs", "Fat", "Protein"],
          colors: ["#2eb8b0", "#c576e1", "#feb13d"],
          calories: food.nutritionSnapshot.calories || 0,
        }
      : {};

  return (
    <>
      {!image ? (
        <div className="w-screen h-screen bg-white">No data</div>
      ) : (
        <div className="w-screen overflow-y-auto lg:flex lg:justify-center bg-neutral-800 lg:max-w-[600px]">
          {/* Image Picture */}
          <div
            className="h-80 inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${image})`,
            }}
          ></div>
          <div className="px-3 py-3">
            <div>
              <p className="text-lg font-semibold text-white">
                {formatText(prediction.predicted_label)}
              </p>
              {food ? (
                <p className="py-2 text-sm text-neutral-300">{food.summary}</p>
              ) : (
                <div className="py-2 h-10 mt-4 w-full bg-neutral-700 rounded animate-pulse"></div>
              )}
            </div>

            {/* Dietary Badges */}
            <div className="mb-6 mt-3">
              <div className="flex flex-wrap gap-2">
                {food
                  ? food.badgeKeys.map((key) => {
                      const badge = badgeLookup[key];
                      if (!badge) return null;
                      return (
                        <span
                          key={badge.name}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${badge.color} text-white text-sm font-medium shadow hover:shadow-md transition-shadow duration-200`}
                          aria-label={badge.name}
                        >
                          {badge.icon}
                          <span>{badge.name}</span>
                        </span>
                      );
                    })
                  : Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={i}
                          className="h-8 w-20 rounded-full bg-neutral-700 animate-pulse"
                        ></div>
                      ))}
              </div>
            </div>

            {/* Nutrition Facts */}
            <div className="mb-6 mt-3 flex justify-center">
              <div className="max-w-[520px] w-full">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <HeartPulse className="mr-2 text-red-400" size={20} />
                    <p className="text-lg font-semibold text-white">
                      Nutrition Facts
                    </p>
                  </div>

                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-sm text-neutral-300 hover:text-blue-800 font-medium"
                  >
                    {showDetails ? "Show Less" : "Show Details"}
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
                          <span className="text-xs text-neutral-300">
                            {item.name}
                          </span>
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
                {showDetails && food ? (
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
                        <span className="text-xs text-neutral-300">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  showDetails && (
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

            {/* DonutChart or its skeleton */}
            <div className="mb-6 mt-3 flex justify-center">
              <div className="max-w-[520px] w-full">
                {food ? (
                  <DonutChart chartData={chartData} />
                ) : (
                  <div className="w-full h-20 rounded-lg shadow-sm  p-4 md:p-6 bg-neutral-700 animate-pulse" />
                )}
              </div>
            </div>

            {/* Ingredients or its skeleton */}
            <div className="mb-6 mt-3">
              <p className="text-lg font-semibold text-white mb-2 flex items-center">
                <NotepadText className="mr-2 text-orange-500" size={20} />
                Ingredients
              </p>
              <div className="border border-transparent p-2 rounded-sm bg-neutral-800">
                {food?.ingredients ? (
                  // real ingredients list
                  food.ingredients.map((group, groupIndex) => (
                    <div key={groupIndex} className="mb-3">
                      <p className="text-md font-sm font-semibold text-white mb-1 pl-1">
                        {group.groupName}
                      </p>
                      <ul className="space-y-2 pl-3">
                        {group.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-center">
                            <div className="h-2 w-2 mr-2 mt-0.5 flex-shrink-0 rounded-full border-2 border-neutral-300" />
                            <span className="text-white">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  // skeleton placeholder
                  <div className="space-y-5 pl-3">
                    {[0, 1, 2, 4, 5, 6].map((_, ii) => (
                      <div
                        key={ii}
                        className="h-3 w-full bg-neutral-700 rounded animate-pulse"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Instructions or its skeleton */}
            <div className="mb-6 mt-3">
              <p className="text-lg font-semibold text-white mb-2 flex items-center">
                <Utensils className="mr-2 text-slate-400" size={20} />
                Instructions
              </p>
              <div className="border border-transparent p-2 rounded-sm bg-neutral-800">
                {food?.instructions ? (
                  // real instruction list
                  food.instructions.map((direction, index) => (
                    <div key={index} className="flex mb-2">
                      <div className="mr-2 flex-shrink-0">
                        <div className="text-white text-sm font-semibold">
                          {direction.stepNumber}
                        </div>
                      </div>
                      <div>
                        <p className="text-white">{direction.description}</p>
                        {direction.duration && (
                          <p className="text-sm text-neutral-300 flex items-center mt-1">
                            <Clock size={14} className="mr-1" />
                            {direction.duration}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  // skeleton placeholder
                  <div className="space-y-4">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-start">
                        {/* step number skeleton */}
                        <div className="mr-2 flex-shrink-0">
                          <div className="h-4 w-4 bg-neutral-700 rounded-full animate-pulse" />
                        </div>
                        {/* description skeleton */}
                        <div className="flex-1 space-y-2">
                          <div className="h-10 w-full bg-neutral-700 rounded animate-pulse" />
                          <div className="h-3 w-15 bg-neutral-700 rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tips or its skeleton */}
            <div className="mb-6 mt-3">
              <div className="border-b border-gray-700 pb-2">
                <button
                  onClick={() => setShowTips(!showTips)}
                  className="flex items-center justify-between w-full py-3 font-medium text-gray-400 gap-3"
                >
                  <p className="flex items-center text-lg font-semibold text-white">
                    <Lightbulb className="mr-2 text-yellow-400" size={20} />
                    Chef’s Tips
                  </p>
                  {showTips ? (
                    <ChevronUp
                      className="w-5 h-5 text-white"
                      strokeWidth={2.5}
                    />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>

                {showTips && (
                  <div className="border-gray-700">
                    {food?.tips ? (
                      <ul>
                        {food.tips.map((tip, index) => (
                          <li
                            key={index}
                            className="flex items-start text-white p-2"
                          >
                            <div className="h-4 w-4 mt-0.5 flex-shrink-0 text-yellow-400">
                              •
                            </div>
                            <span className="text-white">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      // skeleton placeholder
                      <div className="space-y-2 p-2">
                        {[0, 1, 2].map((_, i) => (
                          <div key={i} className="flex items-center">
                            {/* bullet skeleton */}
                            <div className="h-4 w-4 mr-2 bg-neutral-700 rounded-full animate-pulse" />
                            {/* text skeleton */}
                            <div className="h-10 w-full bg-neutral-700 rounded animate-pulse" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Variations or its skeleton */}
            <div className="mb-6 mt-3">
              <div className="border-b border-gray-700 pb-2">
                <button
                  onClick={() => setShowVariations(!showVariations)}
                  className="flex items-center justify-between w-full py-3 font-medium text-gray-400 gap-3"
                >
                  <p className="flex items-center text-lg font-semibold text-white">
                    <Sparkles className="mr-2 text-purple-400" size={20} />
                    Recipe Variations
                  </p>
                  {showVariations ? (
                    <ChevronUp
                      className="w-5 h-5 text-white"
                      strokeWidth={2.5}
                    />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>

                {showVariations && (
                  <div className="border-gray-700">
                    {food?.variations ? (
                      // real variations list
                      food.variations.map((variation, index) => (
                        <div
                          key={index}
                          className="p-3 border-t border-gray-700 first:border-t-0"
                        >
                          <p className="text-white font-medium mb-2">
                            {variation.name}
                          </p>

                          {variation.add && (
                            <div className="flex gap-2 items-start mb-1">
                              <span className="px-2 py-1 bg-green-800 text-green-100 text-xs font-medium rounded w-[45px] flex justify-center shrink-0">
                                Add
                              </span>
                              <p className="text-gray-300 text-sm">
                                {variation.add}
                              </p>
                            </div>
                          )}

                          {variation.swap && (
                            <div className="flex gap-2 items-start">
                              <span className="px-2 py-1 bg-purple-800 text-purple-100 text-xs font-medium rounded">
                                Swap
                              </span>
                              <p className="text-gray-300 text-sm">
                                {variation.swap}
                              </p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      // skeleton placeholder
                      <div className="space-y-4 p-2">
                        {[0, 1, 2].map((_, i) => (
                          <div
                            key={i}
                            className=" pt-2 border-t border-neutral-700 first:border-t-0"
                          >
                            {/* title skeleton */}
                            <div className="h-5 w-1/3 bg-neutral-700 rounded animate-pulse mb-2" />

                            {/* "Add" block skeleton */}
                            <div className="flex gap-2 items-start mb-1">
                              <div className="h-5 w-10 bg-neutral-700 rounded animate-pulse" />
                              <div className="h-4 w-3/4 bg-neutral-700 rounded animate-pulse" />
                            </div>

                            {/* "Swap" block skeleton */}
                            <div className="flex gap-2 items-start">
                              <div className="h-5 w-10 bg-neutral-700 rounded animate-pulse" />
                              <div className="h-4 w-3/4 bg-neutral-700 rounded animate-pulse" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Cultural Context or its skeleton */}
            <div className="mb-6 mt-3">
              <div className="border-b border-gray-700">
                <button
                  onClick={() => setShowCulturalContext(!showCulturalContext)}
                  className="flex items-center justify-between w-full py-3 font-medium text-gray-400 gap-3"
                >
                  <p className="flex items-center text-lg font-semibold text-white">
                    <Book className="mr-2 text-blue-500" size={20} />
                    Cultural Context
                  </p>
                  {showCulturalContext ? (
                    <ChevronUp
                      className="w-5 h-5 text-white"
                      strokeWidth={2.5}
                    />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>

                {showCulturalContext && (
                  <div className="pb-2 px-3 border-b border-neutral-700">
                    {food?.culturalContext ? (
                      // real cultural context
                      <p className="text-white">{food.culturalContext}</p>
                    ) : (
                      // skeleton placeholder
                      <div className="">
                        <div className="h-10 w-full bg-neutral-700 rounded animate-pulse" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Fun Facts or its skeleton */}
            <div className="mb-6 mt-3">
              <div className="border-b border-gray-700">
                <button
                  onClick={() => setShowFunFacts(!showFunFacts)}
                  className="flex items-center justify-between w-full py-3 font-medium text-gray-400 gap-3"
                >
                  <p className="text-lg flex items-center font-semibold text-white">
                    <MessageCircle className="mr-2 text-green-500" size={20} />
                    Fun Facts
                  </p>
                  {showFunFacts ? (
                    <ChevronUp
                      strokeWidth={2.5}
                      className="w-5 h-5 text-white"
                    />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                {showFunFacts && (
                  <div className="pb-3 border-b border-gray-700">
                    {food?.funFacts ? (
                      // real fun facts list
                      <ul>
                        {food.funFacts.map((fact, index) => (
                          <li
                            key={index}
                            className="flex items-start text-white p-2"
                          >
                            <div className="h-5 w-5 mr-1 mt-0.5 flex-shrink-0 text-green-500">
                              •
                            </div>
                            <span className="text-white">{fact}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      // skeleton placeholder
                      <div className="space-y-3">
                        {[0, 1, 2].map((_, i) => (
                          <div key={i} className="flex items-start p-2">
                            {/* bullet skeleton */}
                            <div className="h-5 w-5 mr-2 bg-neutral-700 rounded-full animate-pulse" />
                            {/* text bar skeleton */}
                            <div className="h-10 w-full bg-neutral-700 rounded animate-pulse" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
