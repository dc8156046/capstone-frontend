import { PieChart } from "@mui/x-charts/PieChart";

const projectsData = {
  project1: [
    { id: 0, value: 10000, label: "Category A", color: "#227B94" },
    { id: 1, value: 15000, label: "Category B", color: "#5CB5D9" },
    { id: 2, value: 20000, label: "Category C", color: "#EAB308" },
  ],
  project2: [
    { id: 0, value: 8000, label: "Category X", color: "#227B94" },
    { id: 1, value: 12000, label: "Category Y", color: "#5CB5D9" },
    { id: 2, value: 18000, label: "Category Z", color: "#EAB308" },
  ],
  project3: [
    { id: 0, value: 5000, label: "Category Alpha", color: "#227B94" },
    { id: 1, value: 25000, label: "Category Beta", color: "#5CB5D9" },
    { id: 2, value: 15000, label: "Category Gamma", color: "#EAB308" },
  ],
};

const defaultData = [
  { id: 0, value: 10000, label: "Category A", color: "#227B94" },
  { id: 1, value: 15000, label: "Category B", color: "#5CB5D9" },
  { id: 2, value: 20000, label: "Category C", color: "#EAB308" },
];

export default function CategoryBudget({ title, selectedProject }) {
  const chartData = selectedProject
    ? projectsData[selectedProject] || defaultData
    : defaultData;

  return (
    <PieChart
      series={[
        {
          data: chartData,
        },
      ]}
      width={400}
      height={200}
    />
  );
}
