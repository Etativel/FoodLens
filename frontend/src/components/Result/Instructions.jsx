import { Utensils, Clock } from "lucide-react";

export default function Instructions({ food }) {
  return (
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
                  {direction.stepNumber || direction.step}
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
  );
}
