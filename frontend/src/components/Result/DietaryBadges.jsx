import { Tag } from "lucide-react";

// Predefined badge lookup
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

// Array of possible colors for new badges
const COLORS = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-600",
  "bg-lime-600",
  "bg-yellow-500",
  "bg-red-400",
  "bg-pink-500",
  "bg-orange-500",
  "bg-rose-600",
  "bg-sky-500",
];

export default function DietaryBadges({ food }) {
  return (
    <div className="mb-6 mt-3">
      <div className="flex flex-wrap gap-2">
        {food
          ? food.badgeKeys.map((key, index) => {
              // lookup for predefined badge
              const badge = badgeLookup[key];
              // use predefined or by index
              const colorClass = badge
                ? badge.color
                : COLORS[index % COLORS.length];
              const icon = badge ? (
                badge.icon
              ) : (
                <Tag size={14} className="opacity-80" />
              );
              const label = badge ? badge.name : key;

              return (
                <span
                  key={key}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${colorClass} text-white text-sm font-medium shadow hover:shadow-md transition-shadow duration-200`}
                  aria-label={label}
                >
                  {icon}
                  <span>{label}</span>
                </span>
              );
            })
          : Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-20 rounded-full bg-neutral-700 animate-pulse"
                />
              ))}
      </div>
    </div>
  );
}
