"use client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import { Calendar } from "react-calendar"; // Ensure react-calendar is installed
import "react-calendar/dist/Calendar.css";
import { projectAPI } from "@/services/createProject";

const CreateProject = () => {
  // State declarations
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  );
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [cities, setCities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectData, setProjectData] = useState({
    name: "",
    address: "",
    city: 0,
    province: 0,
    budget: 0,
    priority: "low",
    duration: "",
    task_ids: [],
  });

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const response = await projectAPI.getAllTasks();
      if (response && Array.isArray(response)) {
        setTasks(response);

        // Initialize tasks object structure based on categories from API
        const initialTasksState = {};
        response.forEach((category) => {
          initialTasksState[category.id] = [];
        });

        setProjectData((prev) => ({
          ...prev,
          tasks: initialTasksState,
        }));
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks. Please refresh the page.");
    }
  };

  // Fetch cities based on the selected province
  const fetchCitiesForProvince = async (province_id) => {
    try {
      // Use an updated API call that supports filtering by province
      const citiesResponse = await projectAPI.getCitiesByProvince(province_id);

      if (citiesResponse && Array.isArray(citiesResponse)) {
        setCities(citiesResponse);

        // Set default city if available
        if (citiesResponse.length > 0) {
          setProjectData((prev) => ({ ...prev, city: citiesResponse[0].id }));
        } else {
          // Clear city if no cities available
          setProjectData((prev) => ({ ...prev, city: 0 }));
        }
      } else {
        setCities([]);
        setProjectData((prev) => ({ ...prev, city: 0 }));
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
      setProjectData((prev) => ({ ...prev, city: 0 }));
    }
  };

  // Fetch provinces first, then cities based on selected province
  const fetchLocations = async () => {
    try {
      // Fetch provinces
      const provincesResponse = await projectAPI.getAllProvinces();
      if (provincesResponse && Array.isArray(provincesResponse)) {
        setProvinces(provincesResponse);

        // Set default province if available
        if (provincesResponse.length > 0) {
          const defaultProvince = provincesResponse[0].id;
          setProjectData((prev) => ({ ...prev, province: defaultProvince }));

          // Fetch cities for the default province
          await fetchCitiesForProvince(defaultProvince);
        }
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
      toast.error("Failed to load locations. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchTasks();
    fetchLocations();
  }, []);

  // Handle task selection
  const handleTaskSelection = (categoryId, taskId) => {
    setProjectData((prevData) => {
      const currentTaskIds = [...(prevData.task_ids || [])];

      // Check if the task is already selected
      const taskIndex = currentTaskIds.indexOf(taskId);

      // If task is already selected, remove it, otherwise add it
      if (taskIndex !== -1) {
        currentTaskIds.splice(taskIndex, 1);
      } else {
        currentTaskIds.push(taskId);
      }

      const category = tasks.find((cat) => cat.id === categoryId);
      if (!category) return prevData;

      const categoryTaskIds = category.children.map((task) => task.id);

      // Check if any task in the category is selected
      const anyTaskSelected = categoryTaskIds.some((id) =>
        currentTaskIds.includes(id)
      );

      if (anyTaskSelected) {
        // If at least one task is selected, ensure categoryId is also selected
        if (!currentTaskIds.includes(category.id)) {
          currentTaskIds.push(category.id);
        }
      } else {
        // If no task is selected, remove categoryId from the list
        currentTaskIds = currentTaskIds.filter((id) => id !== category.id);
      }

      return {
        ...prevData,
        task_ids: currentTaskIds,
      };
    });
  };

  // Handle category selection (select/deselect all tasks in a category)
  const handleCategorySelection = (categoryId) => {
    const category = tasks.find((cat) => cat.id === categoryId);
    if (!category) return;

    setProjectData((prevData) => {
      const currentTaskIds = [...(prevData.task_ids || [])];
      const categoryTaskIds = category.children.map((task) => task.id);

      // Check if all category tasks are already selected
      // const allSelected = categoryTaskIds.every((taskId) =>
      //   currentTaskIds.includes(taskId)
      // );

      const allSelected = [category.id, ...categoryTaskIds].every((taskId) =>
        currentTaskIds.includes(taskId)
      );

      let updatedTaskIds;
      if (allSelected) {
        // If all tasks are selected, remove them all
        updatedTaskIds = currentTaskIds.filter(
          //(id) => !categoryTaskIds.includes(id)
          (id) => ![category.id, ...categoryTaskIds].includes(id)
        );
      } else {
        // Otherwise, add all missing tasks
        updatedTaskIds = [...currentTaskIds];
        // categoryTaskIds.forEach((taskId) => {
        //   if (!updatedTaskIds.includes(taskId)) {
        //     updatedTaskIds.push(taskId);
        //   }
        // });
        [category.id, ...categoryTaskIds].forEach((taskId) => {
          if (!updatedTaskIds.includes(taskId)) {
            updatedTaskIds.push(taskId);
          }
        });
      }

      return {
        ...prevData,
        task_ids: updatedTaskIds,
      };
    });
  };

  // Handle cancel button
  const handleCancel = () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel?");
    if (confirmCancel) {
      window.location.href = "/dashboard";
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Skip province and city as they are handled by specific functions
    if (name === "province" || name === "city") return;

    setProjectData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    setProjectData((prev) => ({ ...prev, province: provinceId }));

    // Fetch cities for the selected province
    await fetchCitiesForProvince(provinceId);
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setProjectData((prev) => ({ ...prev, city: cityId }));
  };

  // Handle date changes
  const handleDateChange = (date) => {
    setStartDate(date);
    setEndDate(
      new Date(
        date.getTime() + parseInt(projectData.duration) * 24 * 60 * 60 * 1000
      )
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!projectData.name || projectData.name.trim() === "") {
      toast.error("Project Name cannot be empty.");
      return;
    }

    if (!projectData.address || projectData.address.trim() === "") {
      toast.error("Project Address cannot be empty.");
      return;
    }

    if (
      !projectData.budget ||
      isNaN(parseFloat(projectData.budget)) ||
      parseFloat(projectData.budget) < 0
    ) {
      toast.error("Budget must be a positive number.");
      return;
    }

    // If all checks pass, proceed to API call
    try {
      setIsSubmitting(true);
      // Create a formatted payload object
      const payload = {
        name: projectData.name,
        address: projectData.address,
        city_id: projectData.city,
        province_id: projectData.province,
        budget: parseFloat(projectData.budget),
        priority: projectData.priority,
        estimated_duration: parseInt(projectData.duration),
        start_date: startDate.toISOString(),
        task_ids: projectData.task_ids,
      };

      console.log("Payload:", payload);
      // Make API call to create project
      const response = await projectAPI.createProject(payload);
      // Handle successful response
      toast.success("Project created successfully!");
      console.log("Project created:", response.data);

      // Redirect to the project details page or dashboard
      setTimeout(() => {
        // window.location.href = `/projects/${response.data.id}`;
      }, 2000);
    } catch (error) {
      // Handle API errors
      console.error("Error creating project:", error);

      if (error.response) {
        const errorMessage =
          error.response.data.message ||
          "Failed to create project. Please try again.";
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("Error setting up request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div>
      <ToastContainer />
      <h2 className="text-2xl font-bold text-center mb-6">
        Create a New Project
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-6 gap-8">
          {/* Left side - Project details */}
          <div className="bg-gray-100 p-6 rounded-lg col-span-3 w-full">
            <h3 className="text-lg font-semibold mb-4">
              1️⃣ Start with the basics
            </h3>
            <label className="block mb-2">Project Name *</label>
            <input
              type="text"
              required
              name="name"
              className="w-full border rounded p-2 mb-4"
              value={projectData.name}
              onChange={handleInputChange}
            />

            <label className="block mb-2">Project Address *</label>
            <input
              type="text"
              required
              name="address"
              className="w-full border rounded p-2 mb-4"
              value={projectData.address}
              onChange={handleInputChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Province</label>
                <select
                  name="province"
                  className="w-full border rounded p-2"
                  value={projectData.province}
                  onChange={handleProvinceChange}
                >
                  {provinces.length > 0 ? (
                    provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))
                  ) : (
                    <option>No provinces available</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block mb-2">City</label>
                <select
                  name="city"
                  className="w-full border rounded p-2"
                  value={projectData.city}
                  onChange={handleCityChange}
                  disabled={cities.length === 0}
                >
                  {cities.length > 0 ? (
                    cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))
                  ) : (
                    <option>No cities available</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block mb-1">Priority</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value="low"
                      checked={projectData.priority === "low"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Low
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value="medium"
                      checked={projectData.priority === "medium"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Normal
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value="high"
                      checked={projectData.priority === "high"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    High
                  </label>
                </div>
              </div>
            </div>

            <label className="block mt-4 mb-2">Budget *</label>
            <input
              required
              type="number"
              name="budget"
              className="w-full border rounded p-2"
              value={projectData.budget}
              onChange={handleInputChange}
            />

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block mb-2">Start Date</label>
                <input
                  type="text"
                  value={startDate.toLocaleDateString()}
                  readOnly
                  className="w-full border rounded p-2 cursor-pointer"
                  onClick={() => setShowStartCalendar(!showStartCalendar)}
                />
                {showStartCalendar && (
                  <Calendar onChange={handleDateChange} value={startDate} />
                )}
              </div>
              <div>
                <label className="block mb-2">Duration (Days)</label>
                <input
                  type="number"
                  name="duration"
                  className="w-full border rounded p-2 mb-4"
                  value={projectData.duration}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Right side - Tasks */}
          <div className="bg-gray-100 p-6 rounded-lg col-span-3 w-full ">
            <h3 className="font-bold mb-6 text-lg">2️⃣ Choose tasks</h3>
            <div className="flex flex-wrap justify-between max-w-[600px] gap-4 min-h-[300px]">
              {tasks.map((category) => (
                <div key={category.id} className="mb-6 w-56">
                  <input
                    type="checkbox"
                    checked={
                      category.children.length > 0 &&
                      category.children.every((task) =>
                        projectData.task_ids.includes(task.id)
                      )
                    }
                    onChange={() => handleCategorySelection(category.id)}
                  />
                  <label className="ml-2 font-semibold">{category.name}</label>
                  <div className="ml-4">
                    {category.children.map((task) => (
                      <div key={task.id}>
                        <input
                          type="checkbox"
                          checked={
                            projectData.task_ids.includes(task.id) || false
                          }
                          onChange={() =>
                            handleTaskSelection(category.id, task.id)
                          }
                        />
                        <label className="ml-2">{task.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <p>*To customize tasks, please go to the project details page.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white px-6 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
