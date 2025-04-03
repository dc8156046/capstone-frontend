"use client";
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";

export default function EachProjectDuration() {
  const seriesNb = 2; // Number of series to display
  const itemNb = 10; // Number of items to display
  const skipAnimation = false; // Whether to skip animation
  const projectNames = [
    "Project A",
    "Project B",
    "Project C",
    "Project D",
    "Project E",
    "Project F",
    "Project G",
    "Project H",
    "Project I",
    "Project J",
    "Project K",
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <BarChart
        height={300}
        series={series
          .slice(0, seriesNb)
          .map((s) => ({ ...s, data: s.data.slice(0, itemNb) }))}
        skipAnimation={skipAnimation}
        xAxis={[
          {
            data: projectNames.slice(0, itemNb),
            scaleType: "band",
          },
        ]}
      />
    </Box>
  );
}

const highlightScope = {
  highlight: "series",
  fade: "global",
};

const series = [
  {
    label: "Estimated Duration",
    data: [
      120, 1000, 764, 890, 600, 345, 1020, 1010, 620, 1269, 724, 999, 1188,
      1210, 626, 630, 555, 516, 775, 516, 120, 1000,
    ],
    color: "#EAB308",
  },
  {
    label: "Actual Duration",
    data: [
      200, 980, 800, 802, 624, 555, 958, 1024, 589, 1245, 720, 954, 1021, 1211,
      658, 699, 501, 525, 748, 555, 200, 980,
    ],
    color: "#5CB5D9",
  },
].map((s) => ({ ...s, highlightScope }));
