import UserContext from "../contexts/createContext/UserContext";
import { useState, useContext, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

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
  const [history, setHistory] = useState([]);

  //   console.log(profile?.user?.scans[0].recipe);

  useEffect(() => {
    const scans = profile?.user?.scans || [];

    const seen = new Set();
    const uniqueScans = scans.filter((scan) => {
      if (seen.has(scan.recipeId)) {
        seen.add(scan.recipeId);
        return true;
      } else {
        seen.add(scan.recipeId);
        return true;
      }
    });

    const sortedScans = uniqueScans
      .map((scan) => ({
        ...scan,
        formattedScannedAt: dayjs
          .utc(scan.scannedAt)
          .tz("Asia/Jakarta")
          .format("MMM DD, YYYY, HH:mm"),
      }))
      .sort((a, b) => new Date(b.scannedAt) - new Date(a.scannedAt));

    setHistory(sortedScans);

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
      const dateKey = dayjs
        .utc(scan.scannedAt)
        .tz("Asia/Jakarta")
        .format("YYYY-MM-DD");

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
  return { dailyTotals, profile, history };
}
