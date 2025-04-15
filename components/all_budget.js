// "use client";
// import { useState, useEffect } from "react";
// import Box from "@mui/material/Box";
// import { BarChart } from "@mui/x-charts/BarChart";
// import CircularProgress from "@mui/material/CircularProgress";
// import Alert from "@mui/material/Alert";

// export default function EachProjectBudget() {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const skipAnimation = false;

//   useEffect(() => {
//     // Function to fetch data from API
//     const fetchProjects = async () => {
//       try {
//         setLoading(true);
//         // Using the correct API endpoint and POST method
//         const response = await fetch("/analytics/budget", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           // Add any required request body here
//           body: JSON.stringify({}),
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         setProjects(data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchProjects();
//   }, []);

//   // Format values with dollar sign and K/M suffixes
//   const formatCurrency = (value) => {
//     if (value >= 1000000) {
//       return `$${(value / 1000000).toFixed(1)}M`;
//     } else if (value >= 1000) {
//       return `$${(value / 1000).toFixed(0)}K`;
//     }
//     return `$${value}`;
//   };

//   const highlightScope = {
//     highlight: "series",
//     fade: "global",
//   };

//   // Extract project names and data from API response
//   const projectNames = projects.map((project) => project.name);

//   // Create series data for the chart
//   const series = [
//     {
//       label: "Estimated Budget",
//       data: projects.map((project) => project.estimate_budget),
//       highlightScope,
//     },
//     {
//       label: "Actual Budget",
//       data: projects.map((project) => project.actual_budget),
//       highlightScope,
//     },
//   ];

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ p: 2 }}>
//         <Alert severity="error">Error loading data: {error}</Alert>
//       </Box>
//     );
//   }

//   if (projects.length === 0) {
//     return (
//       <Box sx={{ p: 2 }}>
//         <Alert severity="info">No project data available</Alert>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ width: "100%" }}>
//       <BarChart
//         height={300}
//         series={series}
//         skipAnimation={skipAnimation}
//         xAxis={[
//           {
//             data: projectNames,
//             scaleType: "band",
//           },
//         ]}
//         yAxis={[
//           {
//             valueFormatter: formatCurrency, // Format Y-axis values with $ and K/M
//           },
//         ]}
//         slotProps={{
//           legend: {
//             position: {
//               vertical: "top",
//               horizontal: "right",
//             },
//           },
//         }}
//       />
//     </Box>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { apiService } from "@/services/http"; // Update this path to match your project structure

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
        
        // Using your apiService instead of direct fetch
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

  if (!projects || projects.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info">No project data available</Alert>
      </Box>
    );
  }

  // Extract project names and data from API response
  const projectNames = projects.map((project) => project.name);

  // Create series data for the chart
  const series = [
    {
      label: "Estimated Budget",
      data: projects.map((project) => project.estimate_budget || 0),
      highlightScope,
      color: "#5CB5D9",
    },
    {
      label: "Actual Budget",
      data: projects.map((project) => project.actual_budget || 0),
      highlightScope,
      color: "#EAB308",
    },
  ];

  // Calculate chart dimensions based on number of projects
  const chartHeight = Math.max(300, projects.length * 40); // Increase height for more projects
  const marginLeft = Math.max(60, getLongestTextWidth(projectNames));

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
        Project Budget Comparison
      </Typography>
      
      <BarChart
        height={chartHeight}
        series={series}
        skipAnimation={skipAnimation}
        layout="horizontal" // Using horizontal layout
        xAxis={[
          {
            valueFormatter: formatCurrency, // Format X-axis values with $ and K/M for horizontal layout
          },
        ]}
        yAxis={[
          {
            data: projectNames,
            scaleType: "band", // This is the key fix - using band scale type on y-axis for horizontal layout
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
        margin={{ left: marginLeft, right: 20, top: 60, bottom: 30 }}
        tooltip={{ trigger: "item" }}
      />
    </Box>
  );
}

// Helper function to estimate text width for proper margin
function getLongestTextWidth(textArray) {
  if (!textArray || textArray.length === 0) return 60;
  
  // Roughly estimate text width (about 8px per character)
  const longestText = textArray.reduce((longest, current) => 
    current.length > longest.length ? current : longest, "");
  
  return Math.min(200, longestText.length * 8); // Cap at 200px
}