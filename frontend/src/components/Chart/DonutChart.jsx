import { useState, useEffect } from "react";
import { percentage } from "../../utils";
import ReactApexChart from "react-apexcharts";

export default function DonutChart({ chartData }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartOptions = {
    colors: chartData.colors,
    chart: {
      type: "donut",
      height: 200,
      width: 200,
      foreColor: "#ffffff",
    },
    stroke: {
      colors: ["#262626"],
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontFamily: "Inter, sans-serif",
              color: "#ffffff",
              offsetY: 20,
            },
            total: {
              showAlways: true,
              show: true,
              label: "Cal",
              fontSize: "12px",
              color: "#ffffff",
              fontFamily: "Inter, sans-serif",
              formatter: function () {
                return chartData.calories;
              },
            },
            value: {
              show: true,
              fontFamily: "Inter, sans-serif",
              offsetY: -20,
              formatter: function (value) {
                return value + "g";
              },
            },
          },
          size: "90%",
        },
      },
    },
    grid: {
      padding: {
        top: -2,
      },
    },
    labels: chartData.labels,
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
  };

  // Custom legend component
  const CustomLegend = ({ chartData }) => (
    <div className="flex space-y-2 w-full justify-around items-center">
      {chartData.labels.map((label, index) => (
        <div key={index} className="flex items-center mb-2">
          <div className="flex items-center justify-around">
            <div className="flex flex-col items-center">
              <span
                style={{
                  color: chartData.colors[index],
                }}
              >
                {percentage(chartData.series, chartData.series[index])}%
              </span>
              <span className="text-white text-sm">
                {chartData.series[index]}g
              </span>

              <span className="text-white text-sm">{label}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className=" w-full text-white bg-white rounded-lg shadow-sm dark:bg-neutral-800 p-4 md:p-6 border border-neutral-400">
      <div className="flex">
        <div className="w-2/3">
          {mounted && (
            <ReactApexChart
              options={chartOptions}
              series={chartData.series}
              type="donut"
              height={100}
              width={100}
            />
          )}
        </div>
        <div className="w-full flex items-center">
          <CustomLegend chartData={chartData} />
        </div>
      </div>
    </div>
  );
}
