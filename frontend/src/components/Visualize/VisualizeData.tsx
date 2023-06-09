import React, { useState } from "react";
import Chart from "chart.js/auto";
import { months } from "../../constants/month";
import { bgcolors } from "../../constants/colors";
import { CategoryScale } from "chart.js";
import PieChart from "./PieChart";
import { BarChart } from "./BarChart";
import ClipSpinner from "../common/ClipSpinner";
// import { BarChart } from "./BarChart";
Chart.register(CategoryScale);
const VisualizeData = ({ expenseData, savingsData }: VisualizeDataProps) => {
  const [stat, setStat] = useState<string>("expenses");
  const [toogleChart, setToogleChart] = useState<string>("PIECHART");
  const data1 = {
    labels: [...months],
    datasets: [
      {
        label: "User Expenses",
        data: expenseData,
        backgroundColor: [...bgcolors],
        borderWidth: 1,
      },
    ],
  };
  const data2 = {
    labels: [...months],
    datasets: [
      {
        label: "User Savings",
        data: savingsData,
        backgroundColor: [...bgcolors],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div>
      <div className="flex flex-col space-y-4">
        <ClipSpinner isLoading={(!expenseData || !savingsData)} />
        <div className=" flex mb-4">
          <select
            className="p-3 rounded-lg bg-white-200 text-black mr-4 border-2 border-white  hover:border-black"
            value={stat}
            onChange={(e) => setStat(e.target.value)}
          >
            <option value="expenses" className="p-1.5 text-black">
              Expenses
            </option>
            <option value="savings" className="p-1.5 text-black">
              Savings
            </option>
          </select>
          <select
            className="p-3 rounded-lg bg-white-200 text-black border-2 border-white  hover:border-black"
            value={toogleChart}
            onChange={(e) => setToogleChart(e.target.value)}
          >
            <option value="PIECHART" className="p-1.5 text-black">
              PieChart
            </option>
            <option value="BARCHART" className="p-1.5 text-black">
              BarChart
            </option>
          </select>
        </div>
        <div className="chart-container mt-2">
          {toogleChart === "PIECHART" ? (
            <PieChart chartData={stat === "expenses" ? data1 : data2} />
          ) : (
            <BarChart chartData={stat === "expenses" ? data1 : data2} />
          )}
        </div>
      </div>
    </div>
  );
};
type VisualizeDataProps = {
  expenseData?: Array<number>;
  savingsData?: Array<number>;
};
export default VisualizeData;
