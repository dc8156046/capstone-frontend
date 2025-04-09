"use client";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

export default function EachProjectBudget() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const skipAnimation = false;

  useEffect(() => {
    // Function to fetch data from API
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Using the correct API endpoint and POST method
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

    fetchProjects();
  }, []);

  // Format values with dollar sign and K/M suffixes
  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  const highlightScope = {
    highlight: "series",
    fade: "global",
  };

  // Extract project names and data from API response
  const projectNames = projects.map((project) => project.name);

  // Create series data for the chart
  const series = [
    {
      label: "Estimated Budget",
      data: projects.map((project) => project.estimate_budget),
      highlightScope,
    },
    {
      label: "Actual Budget",
      data: projects.map((project) => project.actual_budget),
      highlightScope,
    },
  ];

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
        <Alert severity="error">Error loading data: {error}</Alert>
      </Box>
    );
  }

  if (projects.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info">No project data available</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <BarChart
        height={300}
        series={series}
        skipAnimation={skipAnimation}
        xAxis={[
          {
            data: projectNames,
            scaleType: "band",
          },
        ]}
        yAxis={[
          {
            valueFormatter: formatCurrency, // Format Y-axis values with $ and K/M
          },
        ]}
        slotProps={{
          legend: {
            position: {
              vertical: "top",
              horizontal: "right",
            },
          },
        }}
      />
    </Box>
  );
}
