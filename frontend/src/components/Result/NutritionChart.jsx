import DonutChart from "../Chart/DonutChart";

export default function NutritionChart({ food }) {
  const chartData =
    food && food.nutritionSnapshot
      ? {
          series: [
            food.nutritionSnapshot.carbs || 0,
            food.nutritionSnapshot.fat || 0,
            food.nutritionSnapshot.protein || 0,
          ],
          labels: ["Carbs", "Fat", "Protein"],
          colors: ["#2eb8b0", "#c576e1", "#feb13d"],
          calories: food.nutritionSnapshot.calories || 0,
        }
      : {};
  return (
    <div className="mb-6 mt-3 flex justify-center">
      <div className="max-w-[520px] w-full">
        {food ? (
          <DonutChart chartData={chartData} />
        ) : (
          <div className="w-full h-20 rounded-lg shadow-sm  p-4 md:p-6 bg-neutral-700 animate-pulse" />
        )}
      </div>
    </div>
  );
}
