// utils/nutrition.js
const synonyms = {
  calories: [/^calorie$/i, /^calories$/i],
  protein: [/^protein$/i],
  fat: [/^fat$/i],
  carbs: [
    /^carb$/i,
    /^carbs$/i,
    /^carbohydrate$/i,
    /^carbohydrates$/i,
    /^carbo$/i,
  ],
  fiber: [/^fiber$/i, /^fibre$/i],
  sugar: [/^sugar$/i],
  sodium: [/^sodium$/i, /^salt$/i],
};

export default function normalizeNutrient(name) {
  const lower = name.toLowerCase();
  for (const key in synonyms) {
    if (synonyms[key].some((rx) => rx.test(name))) {
      return key;
    }
  }
  return lower;
}
