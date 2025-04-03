"use client";
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";

export default function EachProjectBudget() {
  const seriesNb = 2; // Number of series to display
  const itemNb = 5; // Number of items to display
  const skipAnimation = false; // Whether to skip animation
  const projectNames = [
    "Project A",
    "Project B",
    "Project C",
    "Project D",
    "Project E",
  ];
  // Format values with dollar sign and K/M suffixes
  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

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
        yAxis={[
          {
            valueFormatter: formatCurrency, // Format Y-axis values with $ and K/M
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
    label: "Estimated Costs",
    data: [
      2423000, 2210000, 764000, 1879000, 1478000, 1373000, 1891000, 2171000,
      620000, 1269000, 724000, 1707000, 1188000, 1879000, 626000, 1635000,
      2177000, 516000, 1793000, 1598000,
    ],
  },
  {
    label: "Actual Costs",
    data: [
      2362000, 2254000, 1962000, 1336000, 586000, 1069000, 2194000, 1629000,
      2173000, 2031000, 1757000, 862000, 2446000, 910000, 2430000, 2300000,
      805000, 1835000, 1684000, 2197000,
    ],
  },
].map((s) => ({ ...s, highlightScope }));
