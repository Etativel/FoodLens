import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

export default function CalorieChart({ dailyTotals }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (dailyTotals?.length > 0) {
      const sorted = [...dailyTotals].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setData(sorted);
    }
  }, [dailyTotals]);

  useEffect(() => {
    if (chartRef.current && !chartInstance.current && data.length > 0) {
      const ctx = chartRef.current.getContext("2d");

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: data.map((item) =>
            new Date(item.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          ),
          datasets: [
            {
              label: "Calories (kcal)",
              data: data.map((item) => item.totals.calories.current),
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderWidth: 2,
              pointBackgroundColor: "#3b82f6",
              pointRadius: 5,
              pointHoverRadius: 7,
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Calories (kcal)",
                color: "#ffffff",
              },
              ticks: {
                color: "#ffffff",
              },
              grid: {
                color: "#ffffff",
              },
            },
            x: {
              title: {
                display: true,
                text: "Date",
                color: "#ffffff",
              },
              ticks: {
                color: "#ffffff",
                maxRotation: 45,
                minRotation: 45,
              },
              grid: {
                color: "#ffffff",
              },
            },
          },

          plugins: {
            title: {
              display: true,
              text: "Daily Calorie Intake",
              font: {
                size: 16,
                weight: "bold",
              },
              color: "#ffffff",
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              titleFont: {
                size: 14,
              },
              bodyFont: {
                size: 14,
              },
              padding: 10,
            },
            legend: {
              labels: {
                color: "#ffffff",
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data]);

  return (
    <div className="flex flex-col items-center p-4 bg-neutral-800 rounded-lg shadow-md mt-2 mx-3    ">
      <div className="w-full h-64">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
