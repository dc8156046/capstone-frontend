"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { apiService } from "@/services/http"; // Update this path to match your project structure

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
        
        // Call the specific analytics/budget endpoint
        const data = await apiService.post('/analytics/budget', {});
        console.log("Fetched budget data:", data);
        
        setProjects(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching budget data:", err);
        setError(err.message || "Failed to load budget data");
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
        value: project.actual_budget || 0,
        label: project.name || `Project ${index + 1}`,
        color: colors[index % colors.length],
      }))
      .filter((item) => item.value > 0);
  };

  // Format currency for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "CAD",
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

  if (!projects || projects.length === 0) {
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

  // Calculate totals directly from the projects array
  const totalActualBudget = projects.reduce((sum, project) => sum + (project.actual_budget || 0), 0);
  const totalEstimatedBudget = projects.reduce((sum, project) => sum + (project.estimate_budget || 0), 0);

  return (
    <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", display: "flex", flexDirection: "column", alignItems: "center", overflow: "visible" }}>
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
            valueFormatter: (params) => {
              console.log("valueFormatter params:", params);
              if (typeof params?.value !== "number" || isNaN(params.value)) return "N/A";
              return formatCurrency(params.value);
            },
            
          },
        ]}
        width={500}
        height={300}
        tooltip={{ trigger: "item" }}
        slotProps={{
          legend: {
            position: {
              vertical: "middle",
              horizontal: "right",
            },
            direction: "column", 
            itemGap: 12,
          },
        
        }}
        margin={{ right: 200 }}
      />

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Total Actual Budget: {formatCurrency(totalActualBudget)}
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          Total Estimated Budget: {formatCurrency(totalEstimatedBudget)}
        </Typography>
      </Box>
    </Box>
  );
}