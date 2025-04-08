"use client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { projectAPI } from "@/services/createProject";

const CreateProject = () => {
  const [step, setStep] = useState(1);
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
      const citiesResponse = await projectAPI.getCitiesByProvince(province_id);
      if (citiesResponse && Array.isArray(citiesResponse)) {
        setCities(citiesResponse);
        if (citiesResponse.length > 0) {
          setProjectData((prev) => ({ ...prev, city: citiesResponse[0].id }));
        } else {
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

  // Fetch provinces and cities
  const fetchLocations = async () => {
    try {
      const provincesResponse = await projectAPI.getAllProvinces();
      if (provincesResponse && Array.isArray(provincesResponse)) {
        setProvinces(provincesResponse);
        if (provincesResponse.length > 0) {
          const defaultProvince = provincesResponse[0].id;
          setProjectData((prev) => ({ ...prev, province: defaultProvince }));
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

  useEffect(() => {
    fetchTasks();
    fetchLocations();
  }, []);

  // Handle task selection
  const handleTaskSelection = (categoryId, taskId) => {
    setProjectData((prevData) => {
      const currentTaskIds = [...(prevData.task_ids || [])];
      const taskIndex = currentTaskIds.indexOf(taskId);
      if (taskIndex !== -1) {
        currentTaskIds.splice(taskIndex, 1);
      } else {
        currentTaskIds.push(taskId);
      }
      const category = tasks.find((cat) => cat.id === categoryId);
      if (!category) return prevData;

      const categoryTaskIds = category.children.map((task) => task.id);
      const anyTaskSelected = categoryTaskIds.some((id) =>
        currentTaskIds.includes(id)
      );

      if (anyTaskSelected) {
        if (!currentTaskIds.includes(category.id)) {
          currentTaskIds.push(category.id);
        }
      } else {
        currentTaskIds = currentTaskIds.filter((id) => id !== category.id);
      }

      return { ...prevData, task_ids: currentTaskIds };
    });
  };

  // Handle category selection
  const handleCategorySelection = (categoryId) => {
    const category = tasks.find((cat) => cat.id === categoryId);
    if (!category) return;

    setProjectData((prevData) => {
      const currentTaskIds = [...(prevData.task_ids || [])];
      const categoryTaskIds = category.children.map((task) => task.id);
      const allSelected = [category.id, ...categoryTaskIds].every((taskId) =>
        currentTaskIds.includes(taskId)
      );

      let updatedTaskIds;
      if (allSelected) {
        updatedTaskIds = currentTaskIds.filter(
          (id) => ![category.id, ...categoryTaskIds].includes(id)
        );
      } else {
        updatedTaskIds = [...currentTaskIds];
        [category.id, ...categoryTaskIds].forEach((taskId) => {
          if (!updatedTaskIds.includes(taskId)) {
            updatedTaskIds.push(taskId);
          }
        });
      }

      return { ...prevData, task_ids: updatedTaskIds };
    });
  };

  // Handle cancel
  const handleCancel = () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel?");
    if (confirmCancel) {
      window.location.href = "/dashboard";
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "province" || name === "city") return;
    setProjectData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    setProjectData((prev) => ({ ...prev, province: provinceId }));
    await fetchCitiesForProvince(provinceId);
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setProjectData((prev) => ({ ...prev, city: cityId }));
  };

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

    try {
      setIsSubmitting(true);
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
      const response = await projectAPI.createProject(payload);
      toast.success("Project created successfully!");
      console.log("Project created:", response.data);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Next button
  const handleNext = () => {
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
    setStep(2);
  };

  // Handle Back button
  const handleBack = () => {
    setStep(1);
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
        Create a New Project (Step {step} of 2)
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="bg-gray-100 p-6 rounded-lg w-full max-w-2xl mx-auto">
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

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-6 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-blue-500 text-white px-6 py-2 rounded"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Task Selection */}
        {step === 2 && (
          <div className="bg-gray-100 p-6 rounded-lg w-full max-w-2xl mx-auto">
            <h3 className="font-bold mb-6 text-lg">2️⃣ Choose tasks</h3>
            <div className="grid grid-cols-2 gap-4 max-w-[600px] p-4 min-h-[300px]">
              {tasks.map((category) => (
                <div key={category.id} className="mb-6">
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

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-500 text-white px-6 py-2 rounded"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-6 py-2 rounded"
              >
                {isSubmitting ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateProject;
