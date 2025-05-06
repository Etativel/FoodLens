import { Lightbulb, ChevronUp, ChevronDown } from "lucide-react";

export default function Tips({ food, showTips, setShowTips }) {
  return (
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
            <ChevronUp className="w-5 h-5 text-white" strokeWidth={2.5} />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>

        {showTips && (
          <div className="border-gray-700">
            {food?.tips ? (
              <ul>
                {food.tips.map((tip, index) => (
                  <li key={index} className="flex items-start text-white p-2">
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
  );
}
