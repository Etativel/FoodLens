import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";

export default function Variations({
  food,
  setShowVariations,
  showVariations,
}) {
  return (
    <div className="mb-6 mt-3">
      <div className="border-b border-gray-700 pb-2">
        <button
          aria-label="show dropdown"
          onClick={() => setShowVariations(!showVariations)}
          className="flex items-center justify-between w-full py-3 font-medium text-gray-400 gap-3"
        >
          <p className="flex items-center text-lg font-semibold text-white">
            <Sparkles className="mr-2 text-purple-400" size={20} />
            Recipe Variations
          </p>
          {showVariations ? (
            <ChevronUp className="w-5 h-5 text-white" strokeWidth={2.5} />
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
                      <p className="text-gray-300 text-md">{variation.add}</p>
                    </div>
                  )}

                  {variation.swap && (
                    <div className="flex gap-2 items-start">
                      <span className="px-2 py-1 bg-purple-800 text-purple-100 text-xs font-medium rounded">
                        Swap
                      </span>
                      <p className="text-gray-300 text-md">{variation.swap}</p>
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
                      <div className="h-4 w-full bg-neutral-700 rounded animate-pulse" />
                    </div>

                    {/* "Swap" block skeleton */}
                    <div className="flex gap-2 items-start">
                      <div className="h-5 w-10 bg-neutral-700 rounded animate-pulse" />
                      <div className="h-4 w-full bg-neutral-700 rounded animate-pulse" />
                    </div>
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
