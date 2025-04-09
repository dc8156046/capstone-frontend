// import * as React from "react";
// import { PieChart } from "@mui/x-charts/PieChart";

// export default function ProjectsBudget() {
//   return (
//     <PieChart
//       series={[
//         {
//           data: [
//             { id: 0, value: 10000, label: "Project A", color: "#227B94" },
//             { id: 1, value: 15000, label: "Project B", color: "#5CB5D9" },
//             { id: 2, value: 20000, label: "Project C", color: "#EAB308" },
//           ],
//         },
//       ]}
//       width={500}
//       height={250}
//     />
//   );
// }

"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

export default function ProjectsBudget() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Color palette for the projects
  const colors = [
    "#227B94",
    "#5CB5D9",
    "#EAB308",
    "#34D399",
    "#8B5CF6",
    "#EC4899",
  ];

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/analytics/budget", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Add any required request body here
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, []);

  // Format the API data for the pie chart
  const getPieChartData = () => {
    return projects
      .map((project, index) => ({
        id: index,
        value: project.actual_budget,
        label: project.name,
        color: colors[index % colors.length], // Cycle through colors
      }))
      .filter((item) => item.value > 0); // Only include projects with actual budget > 0
  };

  // Calculate total budget for the summary
  const getTotalBudget = () => {
    return projects.reduce((sum, project) => sum + project.actual_budget, 0);
  };

  // Format currency for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Error loading budget data: {error}</Alert>
      </Box>
    );
  }

  if (projects.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info">No project budget data available</Alert>
      </Box>
    );
  }

  const chartData = getPieChartData();

  if (chartData.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info">All projects have zero budget values</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 600 }}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
        Project Budget Allocation
      </Typography>

      <PieChart
        series={[
          {
            data: chartData,
            highlightScope: { faded: "global", highlighted: "item" },
            innerRadius: 30,
            paddingAngle: 2,
            cornerRadius: 4,
            valueFormatter: (value) => formatCurrency(value),
          },
        ]}
        width={500}
        height={300}
        tooltip={{ trigger: "item" }}
        slotProps={{
          legend: {
            hidden: false,
            position: { vertical: "middle", horizontal: "right" },
          },
        }}
      />

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Total Budget: {formatCurrency(getTotalBudget())}
        </Typography>
      </Box>
    </Box>
  );
}
