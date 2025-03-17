"use client";
import React, { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts";
import Box from "@mui/material/Box";
import { projectAPI } from "@/services/createProject";

const CategoryDurationChart = () => {
  const [categories, setCategories] = useState([]);
  const [durationData, setDurationData] = useState([]);
  const [taskCountData, setTaskCountData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch category data from the API
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        // Assuming getAllTasks() returns category data like in your CreateProject component
        const response = await projectAPI.getAllTasks();
        
        if (response && Array.isArray(response)) {
          // Extract category names for x-axis labels
          const categoryNames = response.map(category => category.name);
          
          // Calculate average durations for each category
          const durations = response.map(category => {
            // Calculate average duration for tasks in this category
            return category.children && category.children.length > 0
              ? category.children.reduce((sum, task) => sum + (task.estimated_duration || 0), 0) / category.children.length
              : 0;
          });
          
          // Get task counts for each category
          const taskCounts = response.map(category => 
            category.children ? category.children.length : 0
          );
          
          setCategories(categoryNames);
          setDurationData(durations);
          setTaskCountData(taskCounts);
        } else {
          setCategories([]);
          setDurationData([]);
          setTaskCountData([]);
          setError("No data available");
        }
      } catch (err) {
        console.error("Error fetching category data:", err);
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading chart data...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center h-64 flex items-center justify-center">{error}</div>;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold text-[#444444] mb-4">
          Project Category Duration Comparison
        </h2>
        
        {categories.length > 0 ? (
          <LineChart
            width={600}
            height={300}
            series={[
              { 
                data: durationData, 
                label: "Avg Duration (days)", 
                yAxisId: "leftAxisId",
                color: "#8884d8"
              },
              { 
                data: taskCountData, 
                label: "Task Count", 
                yAxisId: "rightAxisId",
                color: "#82ca9d"
              },
            ]}
            xAxis={[{ 
              scaleType: "point", 
              data: categories,
              tickLabelStyle: {
                angle: 45,
                textAnchor: 'start',
                fontSize: 12
              }
            }]}
            yAxis={[
              { 
                id: "leftAxisId",
                label: "Average Duration (days)" 
              }, 
              { 
                id: "rightAxisId",
                label: "Number of Tasks"
              }
            ]}
            rightAxis="rightAxisId"
            sx={{
              ".MuiLineElement-root": {
                strokeWidth: 2,
              },
              ".MuiMarkElement-root": {
                stroke: "none",
                fill: "currentColor",
                r: 4,
              },
            }}
          />
        ) : (
          <div className="text-center py-10">No category data available</div>
        )}
      </div>
    </Box>
  );
};

export default CategoryDurationChart;