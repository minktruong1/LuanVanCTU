import React, { memo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartVertical = ({ nameProduct, soldProduct, note, color, title }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: title,
        position: "bottom",
        font: {
          size: 14,
          weight: "bold",
        },
      },
    },
  };
  const labels = nameProduct;
  const data = {
    labels,
    datasets: [
      {
        label: note,
        data: soldProduct,
        backgroundColor: color,
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default memo(ChartVertical);
