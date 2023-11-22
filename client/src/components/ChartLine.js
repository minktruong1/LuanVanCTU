import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartLine = ({
  OderDatasets1,
  OderDatasets2,
  OderDatasets3,
  DataFor,
  DataType,
  label,
}) => {
  const options =
    label === "yearProfit"
      ? {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              position: "bottom",
              text: "Biểu đồ lợi nhuận trong năm",
              font: {
                size: 18,
              },
            },
          },
        }
      : label === "quarterProfit"
      ? {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              position: "bottom",
              text: "Biểu đồ lợi nhuận theo quý",
              font: {
                size: 18,
              },
            },
          },
        }
      : label === "yearOrder"
      ? {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              position: "bottom",
              text: "Biểu đồ số đơn hàng nhận được theo năm",
              font: {
                size: 18,
              },
            },
          },
        }
      : label === "quarterOrder"
      ? {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              position: "bottom",
              text: "Biểu đồ số đơn hàng nhận được theo quý",
              font: {
                size: 18,
              },
            },
          },
        }
      : {};

  const labels =
    DataFor === "quarter"
      ? ["Quý 1", "Quý 2", "Quý 3", "Quý 4"]
      : [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ];
  const datasets =
    DataType === "profit"
      ? [
          {
            label: "VNĐ",
            data: OderDatasets1,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.5)",
          },
        ]
      : DataType === "order"
      ? [
          {
            label: "Hủy",
            data: OderDatasets1,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
          {
            label: "Hoàn thành",
            data: OderDatasets2,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.5)",
          },
          {
            label: "Tổng cộng",
            data: OderDatasets3,
            borderColor: "rgb(54, 162, 235)",
            backgroundColor: "rgba(54, 162, 235, 0.5)",
          },
        ]
      : [];

  const data = {
    labels,
    datasets,
  };
  return <Line options={options} data={data} />;
};

export default ChartLine;
