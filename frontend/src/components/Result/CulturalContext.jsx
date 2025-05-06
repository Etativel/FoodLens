import { Book, ChevronUp, ChevronDown } from "lucide-react";

export default function CulturalContext({
  food,
  showCulturalContext,
  setShowCulturalContext,
}) {
  return (
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
            <ChevronUp className="w-5 h-5 text-white" strokeWidth={2.5} />
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
  );
}
