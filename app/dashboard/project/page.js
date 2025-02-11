import ProgressBar from "@/components/progressBar";

export default function ProjectListPage(){

  const testProjects = [
    {
      id: 1,
      name: "Project Alpha",
      address: "123 Main St, Calgary, AB",
      startDate: new Date("2025-10-01"),
      endDate: new Date("2026-12-15"),
      budget: "$500,000",
      complete: 75,
      status: "In Progress",
    },
    {
      id: 2,
      name: "Project Beta",
      address: "456 Elm St, Edmonton, AB",
      startDate: new Date("2025-09-15"),
      endDate: new Date("2025-10-20"),
      budget: "$750,000",
      complete: 50,
      status: "Pending",
    },
    {
      id: 3,
      name: "Project Gamma",
      address: "789 Oak St, Vancouver, BC",
      startDate: new Date("2025-11-01"),
      endDate: new Date("2026-03-30"),
      budget: "$1,000,000",
      complete: 25,
      status: "Delayed",
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
      <div>{project.status}</div>
    </div>
  ))}
</div>
  );
}
