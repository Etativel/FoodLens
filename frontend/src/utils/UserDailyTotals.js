import UserContext from "../contexts/createContext/UserContext";
import { useState, useContext, useEffect } from "react";

const NUTRIENTS = {
  protein: "g",
  carbs: "g",
  fat: "g",
  calories: "kcal",
  fiber: "g",
  sodium: "mg",
  sugar: "g",
};

export default function UseDailyTotals() {
  const { profile } = useContext(UserContext);
  const [dailyTotals, setDailyTotals] = useState([]);

  console.log(dailyTotals);

  console.log(profile?.user?.scans[0].recipe);

  useEffect(() => {
    const scans = profile?.user?.scans || [];
    if (!scans.length) {
      setDailyTotals([]);
      return;
    }
    const normalize = (name) => {
      const lower = name.toLowerCase();
      if (lower === "carbohydrates") return "carbs";
      return lower;
    };

    const groups = scans.reduce((acc, scan) => {
      const dateKey = scan.scannedAt.slice(0, 10);
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          totals: Object.fromEntries(
            Object.entries(NUTRIENTS).map(([key, unit]) => [
              key,
              { current: 0, unit },
            ])
          ),
          recipes: [],
        };
      }
      acc[dateKey].recipes.push({
        name: scan.recipe.name,
        imageUrl: scan.imageUrl,
        summary: scan.recipe.summary,
        nutritionItems: scan.recipe.nutritionItems,
      });

      scan.recipe.nutritionItems.forEach(({ name, value, unit }) => {
        const key = normalize(name);
        if (acc[dateKey].totals[key]) {
          acc[dateKey].totals[key].current += value;
        } else {
          acc[dateKey].totals[key] = { current: value, unit };
        }
      });

      return acc;
    }, {});

    const list = Object.values(groups).sort((a, b) =>
      a.date > b.date ? -1 : 1
    );
    setDailyTotals(list);
  }, [profile]);
  return { dailyTotals, profile };
}
