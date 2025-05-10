import { Tag } from "lucide-react";

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
  // Helper to pick a random color
  const getRandomColor = () =>
    COLORS[Math.floor(Math.random() * COLORS.length)];

  return (
    <div className="mb-6 mt-3">
      <div className="flex flex-wrap gap-2">
        {food
          ? food.badgeKeys.map((key) => {
              const colorClass = getRandomColor();
              return (
                <span
                  key={key}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${colorClass} text-white text-sm font-medium shadow hover:shadow-md transition-shadow duration-200`}
                  aria-label={key}
                >
                  <Tag size={14} className="opacity-80" />
                  <span>{key}</span>
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
