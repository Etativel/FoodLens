// src/pages/Results.jsx
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import formatText from "../../utils/predictionTextFormatter";
import {
  Tag,
  Fish,
  Milk,
  Hamburger,
  Flame,
  Beef,
  Cookie,
  Wheat,
  Apple,
  Snowflake,
  MessageCircle,
  Book,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";

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
    icon: <Hamburger size={16} className="text-blue-400" />,
  },
];

const ingredients = [
  {
    group: "Fish",
    items: ["4 (5 ounce) cod fillets", "salt and ground black pepper to taste"],
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

const chartData = {
  series: [
    nutritionSnapshot.carbs_g,
    nutritionSnapshot.fat_g,
    nutritionSnapshot.protein_g,
  ],

  labels: ["Carbs", "Fat", "Protein"],
  colors: ["#2eb8b0", "#c576e1", "#feb13d"],
  calories: nutritionSnapshot.calories,
};

function percentage(series, value) {
  const total = series.reduce((sum, v) => sum + v, 0);
  const percent = (value / total) * 100;
  return Math.round(percent);
}

function DonutChart({ chartData }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartOptions = {
    colors: chartData.colors,
    chart: {
      type: "donut",
      height: 200,
      width: 200,
      foreColor: "#ffffff",
    },
    stroke: {
      colors: ["#262626"],
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontFamily: "Inter, sans-serif",
              color: "#ffffff",
              offsetY: 20,
            },
            total: {
              showAlways: true,
              show: true,
              label: "Cal",
              fontSize: "12px",
              color: "#ffffff",
              fontFamily: "Inter, sans-serif",
              formatter: function () {
                return chartData.calories;
              },
            },
            value: {
              show: true,
              fontFamily: "Inter, sans-serif",
              offsetY: -20,
              formatter: function (value) {
                return value + "g";
              },
            },
          },
          size: "90%",
        },
      },
    },
    grid: {
      padding: {
        top: -2,
      },
    },
    labels: chartData.labels,
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
  };

  // Custom legend component
  const CustomLegend = ({ chartData }) => (
    <div className="flex space-y-2 w-full justify-around items-center">
      {chartData.labels.map((label, index) => (
        <div key={index} className="flex items-center mb-2">
          <div className="flex items-center justify-around">
            <div className="flex flex-col items-center">
              <span
                style={{
                  color: chartData.colors[index],
                }}
              >
                {percentage(chartData.series, chartData.series[index])}%
              </span>
              <span className="text-white text-sm">
                {chartData.series[index]}g
              </span>

              <span className="text-white text-sm">{label}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className=" w-full text-white bg-white rounded-lg shadow-sm dark:bg-neutral-800 p-4 md:p-6 border">
      <div className="flex">
        <div className="w-2/3">
          {mounted && (
            <ReactApexChart
              options={chartOptions}
              series={chartData.series}
              type="donut"
              height={100}
              width={100}
            />
          )}
        </div>
        <div className="w-full flex items-center">
          <CustomLegend chartData={chartData} />
        </div>
      </div>
    </div>
  );
}

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [showDetails, setShowDetails] = useState(false);
  const [showCulturalContext, setShowCulturalContext] = useState(false);
  const [showFunFacts, setShowFunFacts] = useState(false);

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
        <div className="w-screen overflow-y-auto lg:flex lg:justify-center ">
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

              <DonutChart chartData={chartData} />

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
                        className="w-5 h-5 text-white  "
                        strokeWidth={2.5}
                      />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  {showCulturalContext && (
                    <div className="py-3 px-3 border-b border-gray-700">
                      <p className="text-neutral-300">{culturalContext}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Fun Facts */}
              <div className="mb-6 mt-3">
                <div className="border-b border-gray-700">
                  <button
                    onClick={() => setShowFunFacts(!showFunFacts)}
                    className="flex items-center justify-between w-full py-3 font-medium text-gray-400 gap-3"
                  >
                    <p className="text-lg flex items-center font-semibold text-white">
                      <MessageCircle
                        className="mr-2 text-green-500"
                        size={20}
                      />
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
                    <div className="py-3 border-b border-gray-700">
                      <ul className="">
                        {funFacts.map((fact, index) => (
                          <li
                            key={index}
                            className="flex items-start text-white p-2"
                          >
                            <div className="h-5 w-5 mr-1 mt-0.5 flex-shrink-0 text-green-500">
                              •
                            </div>
                            <span className="text-neutral-300">{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
