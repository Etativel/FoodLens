// src/pages/Results.jsx
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import formatText from "../../utils/predictionTextFormatter";
import {
  Tag,
  Fish,
  Milk,
  Flame,
  Beef,
  Cookie,
  Wheat,
  Apple,
  Snowflake,
} from "lucide-react";
import {
  Clock,
  ChefHat,
  Target,
  AlertCircle,
  ArrowRight,
  Droplet,
  Book,
  PlusCircle,
  Lightbulb,
  History,
  Award,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [showDetails, setShowDetails] = useState(false);

  const badges = [
    {
      name: "Low-Carb",
      color: "bg-emerald-500",
      icon: <Tag size={8} className="opacity-80" />,
    },
    {
      name: "High-Protein",
      color: "bg-blue-500",
      icon: <Tag size={8} className="opacity-80" />,
    },
    {
      name: "Gluten-Free",
      color: "bg-purple-500",
      icon: <Tag size={8} className="opacity-80" />,
    },
  ];

  // const dietaryTags = [
  //   {
  //     name: "Pescatarian",
  //     color: "bg-cyan-500",
  //     icon: <Fish size={8} className="opacity-80" />,
  //   },
  //   {
  //     name: "Dairy",
  //     color: "bg-amber-400",
  //     icon: <Milk size={8} className="opacity-80" />,
  //   },
  // ];

  const nutritionSnapshot = {
    calories: 364,
    protein_g: 31,
    fat_g: 15,
    carbs_g: 23,
    fiber_g: 6,
    sugar_g: 4,
    sodium_mg: 202,
  };

  const nutritionItems = [
    {
      name: "Calories",
      value: nutritionSnapshot.calories,
      unit: "",
      icon: <Flame size={16} className="text-orange-500" />,
    },
    {
      name: "Protein",
      value: nutritionSnapshot.protein_g,
      unit: "g",
      icon: <Beef size={16} className="text-red-500" />,
    },
    {
      name: "Fat",
      value: nutritionSnapshot.fat_g,
      unit: "g",
      icon: <Cookie size={16} className="text-yellow-500" />,
    },
    {
      name: "Carbs",
      value: nutritionSnapshot.carbs_g,
      unit: "g",
      icon: <Wheat size={16} className="text-amber-600" />,
    },
    {
      name: "Fiber",
      value: nutritionSnapshot.fiber_g,
      unit: "g",
      icon: <Wheat size={16} className="text-green-600" />,
    },
    {
      name: "Sugar",
      value: nutritionSnapshot.sugar_g,
      unit: "g",
      icon: <Apple size={16} className="text-pink-500" />,
    },
    {
      name: "Sodium",
      value: nutritionSnapshot.sodium_mg,
      unit: "mg",
      icon: <Snowflake size={16} className="text-blue-400" />,
    },
  ];

  const ingredients = [
    {
      group: "Fish",
      items: [
        "4 (5 ounce) cod fillets",
        "salt and ground black pepper to taste",
      ],
    },
    {
      group: "Coating",
      items: ["3 tablespoons butter, melted", "2 tablespoons sesame seeds"],
    },
    {
      group: "Veggies",
      items: [
        "2 (6 ounce) packages sugar snap peas",
        "3 cloves garlic, thinly sliced",
      ],
    },
    {
      group: "Garnish",
      items: ["1 medium orange, cut into wedges"],
    },
  ];

  const instructions = [
    {
      step: 1,
      description: "Brush the air fryer basket … and preheat to 400°F (200°C).",
      duration: "2 mins",
    },
    {
      step: 2,
      description:
        "Thaw fish if frozen; blot dry … sprinkle with salt and pepper.",
    },
    {
      step: 3,
      description:
        "Brush melted butter on both sides of the cod fillets. Press sesame seeds onto one side of each fillet.",
    },
    {
      step: 4,
      description:
        "Place cod in the preheated air fryer basket, sesame-side up. Cook for 8 minutes.",
    },
    {
      step: 5,
      description:
        "Cook fish 5–6 more minutes or until flaky. Serve with snap peas and orange wedges.",
    },
  ];

  const culturalContext =
    "This style of sesame-crusted fish is popular in modern American fusion cuisine, combining Asian flavors with Western cooking techniques.";

  const funFacts = [
    "Sesame seeds are one of the oldest oilseed crops, domesticated over 3,000 years ago.",
    "Sugar snap peas were developed in the 1970s by crossing snow peas and garden peas.",
  ];

  if (!state?.prediction || !state?.image) {
    return <Navigate to="/" replace />;
  }

  const { image, prediction } = state;
  console.log(state);
  return (
    <>
      {!image ? (
        <div className="w-screen h-screen bg-white">No data</div>
      ) : (
        <div className="w-screen lg:flex lg:justify-center">
          <div className="bg-neutral-800 lg:max-w-[600px]">
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

                <p className="py-2 text-sm text-neutral-300">
                  A quick, healthy cod dish crusted in sesame and served with
                  crisp sugar snap peas.
                </p>
              </div>

              {/* Dietary Badges */}
              <div className="mb-6 mt-3">
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge, index) => (
                    <div
                      key={index}
                      className={`px-3 py-1 rounded-full ${badge.color} text-white font-medium text-sm flex items-center justify-center gap-1 shadow-sm hover:shadow-md transition-shadow duration-200`}
                    >
                      {badge.icon}
                      <span>{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nutrition Facts */}
              <div className="mb-6 mt-3 ">
                <div className=" ">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-white">
                      Nutrition Facts
                    </p>
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="text-sm text-neutral-300 hover:text-blue-800 font-medium"
                    >
                      {showDetails ? "Show Less" : "Show Details"}
                    </button>
                  </div>

                  {/* Main nutrition stats */}
                  <div className="flex gap-2 mt-3 justify-around">
                    {nutritionItems.slice(0, 4).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center flex-col p-2 rounded-lg "
                      >
                        {item.icon}
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

                  {/* Extended nutrition stats */}
                  {showDetails && (
                    <div className="flex  gap-2 mt-3 justify-around">
                      {nutritionItems.slice(4).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center flex-col p-2 rounded-lg "
                        >
                          {item.icon}
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
                  )}
                </div>
              </div>

              {/* Ingredients  */}
              <div className="mb-6 mt-3">
                <p className="text-lg font-semibold text-white mb-2">
                  Ingredients
                </p>
                <div className="border border-transparent p-2 rounded-sm bg-neutral-700">
                  {ingredients.map((group, groupIndex) => (
                    <div key={groupIndex} className="mb-3 ">
                      <p className="text-md font-sm font-semibold text-white mb-1 pl-1">
                        {group.group}
                      </p>
                      <ul className="space-y-2 pl-3">
                        {group.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-center">
                            <div className="h-2 w-2 mr-2 mt-0.5 flex-shrink-0 rounded-full border-2 border-neutral-300"></div>
                            <span className="text-white">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-6 mt-3">
                <p className="text-lg font-semibold text-white mb-2">
                  Instructions
                </p>
                <div className="border border-transparent p-2 rounded-sm bg-neutral-700">
                  {instructions.map((direction, index) => (
                    <div key={index} className="flex">
                      <div className="mr-2 flex-shrink-0 ">
                        <div className=" text-white text-sm font-semibold">
                          {direction.step}
                        </div>
                      </div>
                      <div className="mb-2">
                        <p className="text-white">{direction.description}</p>
                        {direction.duration && (
                          <p className="text-sm text-neutral-300 flex items-center mt-1">
                            <Clock size={14} className="mr-1" />
                            {direction.duration}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cultural Context */}
              <div>
                <h3 className="flex items-center text-lg font-medium text-gray-800 mb-3">
                  <Book className="mr-2 text-blue-500" size={20} />
                  Cultural Context
                </h3>
                <p className="bg-white p-3 rounded-lg border border-gray-200">
                  {culturalContext}
                </p>
              </div>

              {/* Fun Facts */}
              <div>
                <h3 className="flex items-center text-lg font-medium text-gray-800 mb-3">
                  <MessageCircle className="mr-2 text-green-500" size={20} />
                  Fun Facts
                </h3>
                <ul className="space-y-3">
                  {funFacts.map((fact, index) => (
                    <li
                      key={index}
                      className="flex items-start bg-white p-3 rounded-lg border border-gray-200"
                    >
                      <div className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-green-500">
                        •
                      </div>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Dietary Type */}
              {/* <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Dietary Type
              </h4>
              <div className="flex flex-wrap gap-2">
                {dietaryTags.map((tag, index) => (
                  <div
                    key={index}
                    className={`px-3 py-1 rounded-full ${tag.color} text-white font-medium text-sm flex items-center justify-center gap-1 shadow-sm hover:shadow-md transition-shadow duration-200`}
                  >
                    {tag.icon}
                    <span>{tag.name}</span>
                  </div>
                ))}
              </div>
            </div> */}

              <button className="text-white" onClick={() => navigate(-1)}>
                ← Try again
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
