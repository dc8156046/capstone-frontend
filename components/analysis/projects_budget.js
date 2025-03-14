import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export default function ProjectsBudget() {
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: 10000, label: "Project A", color: "#227B94" },
            { id: 1, value: 15000, label: "Project B", color: "#5CB5D9" },
            { id: 2, value: 20000, label: "Project C", color: "#EAB308" },
          ],
        },
      ]}
      width={500}
      height={250}
    />
  );
}
