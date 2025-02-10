// create_project.js
"use client";

import React, { useState } from "react";
import { Calendar } from "react-calendar"; // Ensure react-calendar is installed
import "react-calendar/dist/Calendar.css";

const CreateProject = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [projectData, setProjectData] = useState({
    name: "",
    address: "",
    city: "",
    province: "",
    budget: "",
    status: "Normal",
    tasks: {
      foundation: [],
      framing: [],
      roughins: [],
    },
  });

  //tasks
  const handleTaskSelection = (category, task) => {
    const tasks = projectData.tasks[category];
    if (tasks.includes(task)) {
      // Remove task if already selected
      setProjectData({
        ...projectData,
        tasks: {
          ...projectData.tasks,
          [category]: tasks.filter((t) => t !== task),
        },
      });
    } else {
      // Add task if not selected
      setProjectData({
        ...projectData,
        tasks: {
          ...projectData.tasks,
          [category]: [...tasks, task],
        },
      });
    }
  };

  const [taskDropdowns, setTaskDropdowns] = useState({
    foundation: false,
    framing: false,
    roughins: false,
  });

  const handleCancel = () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel？");

    if (confirmCancel) {
      window.history.back();
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
  };

  const toggleDropdown = (category) => {
    setTaskDropdowns({
      ...taskDropdowns,
      [category]: !taskDropdowns[category],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(projectData);
    alert("Project Created!");
  };

  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  return (
    <div className="container p-8 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create a New Project</h2>
      <form>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="pname" className="block mb-1">
              Project Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full border rounded p-2"
              value={projectData.name}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="city" className="block mb-1">
              City
            </label>
            <select
              name="city"
              className="w-full border rounded p-2"
              value={projectData.city}
              onChange={handleInputChange}
            >
              <option value="Normal">Calgary</option>
              <option value="Pending">Edmonton</option>
              <option value="Complete">Toronto</option>
              <option value="Delay">Vancouver</option>
            </select>
          </div>
          <div>
            <label htmlFor="province" className="block mb-1">
              Province
            </label>
            <select
              name="province"
              className="w-full border rounded p-2"
              value={projectData.province}
              onChange={handleInputChange}
            >
              <option value="Normal">Alberta</option>
              <option value="Pending">Ontario</option>
              <option value="Delay">British Columbia</option>
            </select>
          </div>
          <div>
            <label htmlFor="address" className="block mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              className="w-full border rounded p-2"
              value={projectData.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="budget" className="block mb-1">
              Budget
            </label>
            <input
              type="number"
              name="budget"
              className="w-full border rounded p-2"
              value={projectData.budget}
              onChange={handleInputChange}
            />
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
              <option value="Normal">Normal</option>
              <option value="Pending">Pending</option>
              <option value="Complete">Complete</option>
              <option value="Delay">Delay</option>
            </select>
          </div>

          <div className="flex space-x-4">
            <div>
              <label htmlFor="start" className="block mb-1">
                Start Date
              </label>
              <input
                type="text"
                value={startDate.toLocaleDateString()}
                onClick={() => setShowStartCalendar(true)}
                readOnly
                className="w-full border rounded p-2"
              />
              {showStartCalendar && (
                <Calendar
                  value={startDate}
                  onChange={handleDateChange(setStartDate)}
                  onClickDay={() => setShowStartCalendar(false)}
                />
              )}
            </div>

            <div>
              <label htmlFor="ddl" className="block mb-1">
                Deadline
              </label>
              <input
                type="text"
                value={endDate.toLocaleDateString()}
                onClick={() => setShowEndCalendar(true)}
                readOnly
                className="w-full border rounded p-2"
              />
              {showEndCalendar && (
                <Calendar
                  value={endDate}
                  onChange={handleDateChange(setEndDate)}
                  onClickDay={() => setShowEndCalendar(false)}
                />
              )}
            </div>
          </div>

          {/* Task Selection Section */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Tasks</h3>
            {["foundation", "framing", "roughins"].map((category) => (
              <div key={category} className="mb-4">
                <button
                  type="button"
                  onClick={() => toggleDropdown(category)}
                  className="w-full bg-gray-200 text-left p-2 rounded mb-2"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
                {taskDropdowns[category] && (
                  <div className="border rounded p-4 bg-white">
                    {["Task 1", "Task 2", "Task 3", "Task 4"].map((task) => (
                      <div key={task} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={`${category}-${task}`}
                          checked={projectData.tasks[category].includes(task)}
                          onChange={() => handleTaskSelection(category, task)}
                          className="mr-2"
                        />
                        <label htmlFor={`${category}-${task}`}>{task}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-10">
          <button
            type="submit"
            onClick={handleSubmit}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
