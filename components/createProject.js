// create_project.js
"use client";

import React, { useState } from "react";
import { Calendar } from "react-calendar"; // Ensure react-calendar is installed
import "react-calendar/dist/Calendar.css";

const allTasks = {
  foundation: ["Pin Footing", "Wall Pours", "Strip Forms"],
  framing: ["Basement Framing", "Main Floor Wall Framing", "Frame Garage Wall"],
  roughins: ["Electrical", "Plumbing", "HVAC"],
};

const CreateProject = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000));
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [projectData, setProjectData] = useState({
    name: "",
    address: "",
    city: "",
    province: "",
    budget: "",
    status: "Normal",
    priority: "Normal",
    tasks: {
      foundation: [],
      framing: [],
      roughins: [],
    },
  });

  //tasks
  const handleTaskSelection = (category, task) => {
    setProjectData((prevData) => ({
      ...prevData,
      tasks: {
        ...prevData.tasks,
        [category]: prevData.tasks[category].includes(task)
          ? prevData.tasks[category].filter((t) => t !== task)
          : [...prevData.tasks[category], task],
      },
    }));
  };

  const handleCategorySelection = (category) => {
    const allSelected = projectData.tasks[category].length === allTasks[category].length;
    setProjectData((prevData) => ({
      ...prevData,
      tasks: {
        ...prevData.tasks,
        [category]: allSelected ? [] : allTasks[category],
      },
    }));
  };

  // const [taskDropdowns, setTaskDropdowns] = useState({
  //   foundation: false,
  //   framing: false,
  //   roughins: false,
  // });

  const handleCancel = () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel？");

    if (confirmCancel) {
      window.location.href = '/dashboard';
      console.log("Yes");
    } else {
      console.log("No");
    }
  };

  const handleInputChange = (e) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (setDate) => (date) => {
    setDate(date);
    setEndDate(new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000));
  };


  // const toggleDropdown = (category) => {
  //   setTaskDropdowns({
  //     ...taskDropdowns,
  //     [category]: !taskDropdowns[category],
  //   });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(projectData);
    alert("Project Created!");
    window.location.href = '/dashboard';
  };



  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg w-full">
      <h2 className="text-2xl font-bold text-center mb-6">Create a New Project</h2>
      <form>
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-gray-100 p-6 rounded-lg col-span-2 w-full">
            <h3 className="text-lg font-semibold mb-4">1️⃣ Start with the basics</h3>
            <label className="block mb-2">Project Name</label>
            <input type="text" name="name" className="w-full border rounded p-2 mb-4" value={projectData.name} onChange={handleInputChange} />
            
            <label className="block mb-2">Project Address</label>
            <input type="text" name="address" className="w-full border rounded p-2 mb-4" value={projectData.address} onChange={handleInputChange} />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">City</label>
                <select name="city" className="w-full border rounded p-2" value={projectData.city} onChange={handleInputChange}>
                  <option>Calgary</option>
                  <option>Edmonton</option>
                  <option>Toronto</option>
                  <option>Vancouver</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Province</label>
                <select name="province" className="w-full border rounded p-2" value={projectData.province} onChange={handleInputChange}>
                  <option>Alberta</option>
                  <option>Ontario</option>
                  <option>British Columbia</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Priority</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input type="radio" name="priority" value="Normal" checked={projectData.priority === "Normal"} onChange={handleInputChange} className="mr-2" />
                    Normal
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="priority" value="High" checked={projectData.priority === "High"} onChange={handleInputChange} className="mr-2" />
                    High
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block mb-1">
                  Current Status
                </label>
                <select
                  name="status"
                  className="w-full border rounded p-2"
                  value={projectData.status}
                  onChange={handleInputChange}
                >
                  <option value="Normal">In progress</option>
                  <option value="Pending">Pending</option>
                  <option value="Complete">Complete</option>
                  <option value="Delay">Delay</option>
                </select>
              </div>

            </div>


            
            <label className="block mt-4 mb-2">Budget</label>
            <input type="number" name="budget" className="w-full border rounded p-2" value={projectData.budget} onChange={handleInputChange} />
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block mb-2">Start Date</label>
                <input type="text" value={startDate.toLocaleDateString()} readOnly className="w-full border rounded p-2 cursor-pointer" onClick={() => setShowStartCalendar(!showStartCalendar)} />
                  {showStartCalendar && <Calendar onChange={handleDateChange(setStartDate, setEndDate, 2)} value={startDate} />}
              </div>
              <div>
                <label className="block mb-2">Duration</label>
                <input type="text" value={endDate.toLocaleDateString()} readOnly className="w-full border rounded p-2 cursor-pointer" onClick={() => setShowEndCalendar(!showEndCalendar)} />
                  {showEndCalendar && <Calendar onChange={handleDateChange(setEndDate, setStartDate, -2)} value={endDate} />}
              </div>

            </div>

            

          </div>
          
          <div className="bg-gray-100 p-6 rounded-lg col-span-2 w-full">
            <h3 className="font-bold mb-6">2️⃣ Choose tasks</h3>
            {Object.keys(projectData.tasks).map((category) => (
              <div key={category} className="mb-6">
                <input type="checkbox" checked={projectData.tasks[category].length > 0} onChange={() => handleCategorySelection(category)} />
                <label className="ml-2 font-semibold">{category.charAt(0).toUpperCase() + category.slice(1)}</label>
                <div className="ml-4">
                  {allTasks[category].map((task) => (
                    <div key={task}>
                      <input type="checkbox" checked={projectData.tasks[category].includes(task)} onChange={() => handleTaskSelection(category, task)} />
                      <label className="ml-2">{task}</label>
                    </div>
                  ))}
                </div>
              </div>        
            ))}
              <div className="flex space-x-4 mt-6">
                  <button type="button" onClick={handleSubmit} className="bg-gray-500 text-white px-6 py-2 rounded">Add Task</button>
              </div>
          </div>

           

        </div>
        
        <div className="flex justify-end space-x-4 mt-6">
          <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-6 py-2 rounded">Cancel</button>
          <button type="submit" onClick={handleSubmit} className="bg-blue-500 text-white px-6 py-2 rounded">Create</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
