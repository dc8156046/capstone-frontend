import ProgressBar from "@/components/progressBar";

export default function ProjectListPage(){

  //Mock data
  const testProjects = [
    {
      id: 1,
      name: "Project 1",
      address: "123 Main St, Calgary, AB",
      startDate: new Date("2025.09.30"),
      endDate: new Date("2026.12.14"),
      budget: "$500,000",
      complete: 75,
      status: "In Progress",
    },
    {
      id: 2,
      name: "Project 2",
      address: "435 Street, Vancouver, BC",
      startDate: new Date("2024.05.27"),
      endDate: new Date("2025.03.19"),
      budget: "$750,000",
      complete: 0,
      status: "Upcoming",
    },
    {
      id: 3,
      name: "Project 3",
      address: "564 Ridge, Edmonton, AB",
      startDate: new Date("2025.01.14"),
      endDate: new Date("2025.09.16"),
      budget: "$1,000,000",
      complete: 25,
      status: "Delayed",
    },
    {
      id: 4,
      name: "Project 4",
      address: "786 Point, Calgary, AB",
      startDate: new Date("2025.06.7"),
      endDate: new Date("2026.05.16"),
      budget: "$1,000,000",
      complete: 100,
      status: "Complete",
    },
  ];


  return (
    <div>
  <h2 className="font-bold text-2xl mt-4">Project List</h2>
  <div className="grid grid-cols-7 gap-4 bg-gray-100 p-3 mt-7 text-center border border-gray-300">
    <div className="font-semibold">Projects</div>
    <div className="font-semibold">Address</div>
    <div className="font-semibold">Start</div>
    <div className="font-semibold">Due</div>
    <div className="font-semibold">Budget</div>
    <div className="font-semibold">Complete</div>
    <div className="font-semibold">Status</div>
  </div>
  {testProjects.map((project) => (
    <div
      key={project.id}
      className="grid grid-cols-7 gap-4 p-3 text-center border-b border-gray-200 hover:bg-gray-50"
    >
      <div>{project.name}</div>
      <div>{project.address}</div>
      <div>{project.startDate.toLocaleDateString()}</div>
      <div>{project.endDate.toLocaleDateString()}</div>
      <div>{project.budget}</div>
      <div>
        <ProgressBar percentage={project.complete} />
      </div>
      <div className={project.status === "Delayed" ? "text-red-500" : project.status === "Complete" ? "text-green-500" : ""}>{project.status}</div>
    </div>
  ))}
</div>
  );
}
