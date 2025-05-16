import { NotepadText } from "lucide-react";

export default function Ingredients({ food }) {
  return (
    <div className="mb-6 mt-3">
      <p className="text-lg font-semibold text-white mb-2 flex items-center">
        <NotepadText className="mr-2 text-orange-500" size={20} />
        Ingredients
      </p>
      <div className="border border-transparent p-2 rounded-sm bg-neutral-800">
        {food?.ingredients ? (
          food.ingredients.map((group, groupIndex) => {
            // pick label available
            const title =
              group.groupName || group.group || `Group ${groupIndex + 1}`;

            return (
              <div key={group.id ?? groupIndex} className="mb-3">
                <p className="text-md font-sm font-semibold text-white mb-1 pl-1">
                  {title}
                </p>
                <ul className="space-y-2 pl-3">
                  {group.items.map((entry, itemIndex) => {
                    // Handle different object structure

                    // if entry is a string, render it directly; otherwise pull out entry.item
                    const text = typeof entry === "string" ? entry : entry.item;

                    // // use entry.id when available, else fall back to index
                    const key =
                      typeof entry === "object" && entry.id
                        ? entry.id
                        : itemIndex;

                    // console.log(typeof entry);
                    // console.log(key);

                    return (
                      <li key={key} className="flex items-center">
                        <div className="h-2 w-2 mr-2 mt-0.5 flex-shrink-0 rounded-full border-2 border-neutral-300" />
                        <span className="text-white">{text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })
        ) : (
          // skeleton placeholder
          <div className="space-y-5 pl-3">
            {[0, 1, 2, 3, 4].map((_, ii) => (
              <div
                key={ii}
                className="h-3 w-full bg-neutral-700 rounded animate-pulse"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
