import { MessageCircle, ChevronUp, ChevronDown } from "lucide-react";

export default function FunFacts({ food, setShowFunFacts, showFunFacts }) {
  return (
    <div className="mb-6 mt-3">
      <div className="border-b border-gray-700">
        <button
          aria-label="show dropdown"
          onClick={() => setShowFunFacts(!showFunFacts)}
          className="flex items-center justify-between w-full py-3 font-medium text-gray-400 gap-3"
        >
          <p className="text-lg flex items-center font-semibold text-white">
            <MessageCircle className="mr-2 text-green-500" size={20} />
            Fun Facts
          </p>
          {showFunFacts ? (
            <ChevronUp strokeWidth={2.5} className="w-5 h-5 text-white" />
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
                  <li key={index} className="flex items-start text-white p-2">
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
  );
}
