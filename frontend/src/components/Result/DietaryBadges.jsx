export default function DietaryBadges({ food, badgeLookup }) {
  return (
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
  );
}
