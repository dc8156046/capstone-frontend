// create_project.js
"use client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from "react";
import { Calendar } from "react-calendar"; // Ensure react-calendar is installed
import "react-calendar/dist/Calendar.css";
// import { AddTaskDialog } from './addTask';
// import { apiService } from "@/services/http"; 
import { projectAPI } from '@/services/createProject'; 
import { useEffect } from "react";

// const allTasks = {
//   foundation: ["Pin Footing", "Footing Forms with Rebar", "Footing Pour","Wall Forms and Rebar","Wall Pours","Strip Forms","Crane Forms","Tap Spray","Weeping Tile and Gravel","Foundation Inspection","Excavation Backfill"],
//   framing: ["Basement Framing/Subfloor Dlivery", "Main Floor Wall Framing", "Frame Garage Wall","Basment Partition Walls","Mainfloor Subfloor","Mainfloor Wall Delivery","Form for Center Concrete Wall","Pour Center Concrete Wall","Strip Forms and Remove From Site","2nd Subfloor Delivery","Frame 2nd Subfloor","Frame 2nd Floor Wall","Truss Delivery","Truss Install/Sheathing","Window and Door Install"],
//   roughins: ["Plumbing groundworks", "Basement Slab Pre","Basement Slab Concr3ete Pour","ABS Plumbing Roughins","insulation/poly/dry","HVAC Roughin","Gasline Install","Frame Bulkheads and Complete Backframing","Electrical Roughins","Firestopping","Inspection","Progress Inspection"],
//   Exterior_Finsihses:["Roofings","Siding","Windows","Doors","Eavestrough","Soffits/fascia/banc","Stucco Paper and wire","Stucco Scratch coa","Stucco color"],
//   Insulation_and_Drywal:["Spray Foam","Batt Insulation","Drywall","Taping","Ceiling","Sanding","Prime","Drywall Toughup"], 
//   Interior :["Interior Finishg","Millwork","Countertop Templating","1st Coat of Trim. Paint and Spray","Coutnertop Install","Tile Floors and Wall","Hardwood Floors","Hard Baseboard","Carpet Installs","Lock Outs Shelving","Shower Doors and Mirros","Plumbing Finals","Electrical Finals","HVAC Finals","Window Lock Outs"],
//   Exterior_Site_Work:["Site Services Install","Driveway Prep","Driveway Pour","Garage Pad Prep","Garage Pad Pour","Sidewalk Prep","Sidewalk Pour","Landscaping","Fence","Deck","Balcony Railing"],
//   Garages :["Garage Forming","Install Rebar, Poly","Pour Concrete Slab","Frame Garage","Install Shinglees","Stucco Paper and Wire","Stucco Scratch Coat","Stucco Colour Coat"]

// };



const CreateProject = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000));
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [cities, setCities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectData, setProjectData] = useState({
    name: "",
    address: "",
    city: "",
    province: "",
    budget: "",
    priority: "Low",
    duration: "2",
    tasks: {}
  });
 
  const fetchTasks = async () => {
      const response = await projectAPI.getAllTasks();
      console.log(response);
      if (response) {
        if (Array.isArray(response)) {
          setTasks(response);
        } else {
          setTasks([]);
        }
      }
  };
 
 
  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      // Fetch cities
      const citiesResponse = await projectAPI.getAllCities();
      if (citiesResponse && Array.isArray(citiesResponse)) {
        setCities(citiesResponse);
        // Set default city if available
        if (citiesResponse.length > 0) {
          setProjectData(prev => ({ ...prev, city: citiesResponse[0].name }));
        }
      }

      // Fetch provinces
      const provincesResponse = await projectAPI.getAllProvinces();
      if (provincesResponse && Array.isArray(provincesResponse)) {
        setProvinces(provincesResponse);
        // Set default province if available
        if (provincesResponse.length > 0) {
          setProjectData(prev => ({ ...prev, province: provincesResponse[0].name }));
        }
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div>Loading locations...</div>;
  }


  // const [startDate, setStartDate] = useState(new Date());
  // const [endDate, setEndDate] = useState(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000));
  // const [showStartCalendar, setShowStartCalendar] = useState(false);
  // // const [showEndCalendar, setShowEndCalendar] = useState(false);
  // const [projectData, setProjectData] = useState({
  //   name: "",
  //   address: "",
  //   city: "",
  //   province: "",
  //   budget: "",
  //   // status: "Normal",
  //   priority: "Low",
  //   duration: "2",
  //   tasks: {
  //     foundation: [],
  //     framing: [],
  //     roughins: [],
  //     Exterior_Finsihses: [],
  //     Insulation_and_Drywal:[],
  //     Interior:[],
  //     Exterior_Site_Work:[],
  //     Garages:[],
  //   },
  // });

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
    const confirmCancel = window.confirm("Are you sure you want to cancel?");

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

  //API connect:
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation (keep your existing validation)
    const form = e.target;
    if (!form.checkValidity()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }
    
    // Additional validations (keep your existing validations)
    if (!projectData.name || projectData.name.trim() === "") {
      toast.error("Project Name cannot be empty.");
      return;
    }
    
    if (!projectData.address || projectData.address.trim() === "") {
      toast.error("Project Address cannot be empty.");
      return;
    }
    
    if (!projectData.budget || projectData.budget < 0) {
      toast.error("Budget cannot be negative.");
      return;
    }
    
    // More validations...
    
    // If all checks pass, proceed to API call
    try {
      setLoading(true);
      // Create a formatted payload object
      const payload = {
        name: projectData.name,
        address: projectData.address,
        city: projectData.city,
        province: projectData.province,
        budget: parseFloat(projectData.budget),
        priority: projectData.priority,
        duration: parseInt(projectData.duration),
        startDate: startDate.toISOString(),
        tasks: projectData.tasks
      };
      
      // Make API call to create project using projectAPI service
      const response = await projectAPI.createProject(payload);
      
      // Handle successful response
      toast.success("Project created successfully!");
      console.log('Project created:', response.data);
      
      // Redirect to the project details page or dashboard
      setTimeout(() => {
        window.location.href = `/projects/${response.data.id}`;
        // Or just go to dashboard
        // window.location.href = '/dashboard';
      }, 2000);
      
    } catch (error) {
      // Handle API errors
      console.error("Error creating project:", error);
      
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        const errorMessage = error.response.data.message || "Failed to create project. Please try again.";
        toast.error(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request
        toast.error("Error setting up request. Please try again.");
      }
    }finally{
      setLoading(false);
    }
  };

  //before API:
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //    // Ensure that the form is valid before proceeding
  //   const form = e.target;

  //   // Check if the form is valid
  //   if (!form.checkValidity()) {
  //     // Trigger built-in form validation
  //     toast.error("Please fill in all required fields correctly.");
  //     return;
  //   }

  //   // Check if the project name is empty
  //   if (!projectData.name || projectData.name.trim() === "") {
  //     toast.error("Project Name cannot be empty.");
  //     return;
  //   }

  //   // Check if the project address is empty
  //   if (!projectData.address || projectData.address.trim() === "") {
  //     toast.error("Project Address cannot be empty.");
  //     return;
  //   }

  //   // Check if the budget is empty or negative
  //   if (!projectData.budget || projectData.budget < 0) {
  //     toast.error("Budget cannot be empty or negative.");
  //     return;
  //   }
  //   // Validate Project Name
  //   if (projectData.name.length > 50) {
  //     toast.error("Project Name cannot exceed 50 characters.");
  //     return;
  //   }

  //   // Validate Address
  //   if (projectData.address.length > 100) {
  //     toast.error("Project Address cannot exceed 100 characters.");
  //     return;
  //   }

  //   // Validate Budget (should not be negative)
  //   if (projectData.budget < 0) {
  //     toast.error("Budget cannot be a negative number.");
  //     return;
  //   }

  //   // Validate Duration (should not be negative)
  //   if (projectData.duration < 0) {
  //     toast.error("Duration cannot be a negative number.");
  //     return;
  //   }

  //   // If all checks pass
  //   console.log(projectData);
  //   toast.success("Project Created!");
  //   window.location.href = '#';
  // };




//className="max-w-full mx-auto bg-white p-8 shadow-lg rounded-lg w-full"
  return (
    <div>
      {/* Toast Container to show the toasts */}
      <ToastContainer />
      <h2 className="text-2xl font-bold text-center mb-6">Create a New Project</h2>
      <form>
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-gray-100 p-6 rounded-lg col-span-1 w-full">
            <h3 className="text-lg font-semibold mb-4">1️⃣ Start with the basics</h3>
            <label className="block mb-2">Project Name *</label>
            <input type="text" required  name="name" className="w-full border rounded p-2 mb-4" value={projectData.name} onChange={handleInputChange} />
            
            <label className="block mb-2">Project Address *</label>
            <input type="text" required  name="address" className="w-full border rounded p-2 mb-4" value={projectData.address} onChange={handleInputChange} />
            
            <div className="grid grid-cols-2 gap-4">
              {/* <div>
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
              </div> */}
              <div>
        <label className="block mb-2">City</label>
        <select 
          name="city" 
          className="w-full border rounded p-2" 
          value={projectData.city} 
          onChange={handleInputChange}
        >
          {cities.length > 0 ? (
            cities.map(city => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))
          ) : (
            <option>No cities available</option>
          )}
        </select>
      </div>
      <div>
        <label className="block mb-2">Province</label>
        <select 
          name="province" 
          className="w-full border rounded p-2" 
          value={projectData.province} 
          onChange={handleInputChange}
        >
          {provinces.length > 0 ? (
            provinces.map(province => (
              <option key={province.id} value={province.name}>
                {province.name}
              </option>
            ))
          ) : (
            <option>No provinces available</option>
          )}
        </select>
      </div>

              <div>
                <label className="block mb-1">Priority</label>
                <div className="flex space-x-4">
                <label className="flex items-center">
                    <input type="radio" name="priority" value="Low" checked={projectData.priority === "Low"} onChange={handleInputChange} className="mr-2" />
                    Low
                  </label>
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

              {/* <div>
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
              </div> */}

            </div>

            <label className="block mt-4 mb-2">Budget *</label>
            <input  required  type="number" name="budget" className="w-full border rounded p-2" value={projectData.budget} onChange={handleInputChange} />
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block mb-2">Start Date</label>
                <input type="text" value={startDate.toLocaleDateString()} readOnly className="w-full border rounded p-2 cursor-pointer" onClick={() => setShowStartCalendar(!showStartCalendar)} />
                  {showStartCalendar && <Calendar onChange={handleDateChange(setStartDate, setEndDate, 2)} value={startDate} />}
              </div>
              <div>
                <label className="block mb-2">Duration</label>
                {/* <input type="text" value={endDate.toLocaleDateString()} readOnly className="w-full border rounded p-2 cursor-pointer" onClick={() => setShowEndCalendar(!showEndCalendar)} />
                  {showEndCalendar && <Calendar onChange={handleDateChange(setEndDate, setStartDate, -2)} value={endDate} />} */}
                <input type="number" name="duration" className="w-full border rounded p-2 mb-4" value={projectData.duration} onChange={handleInputChange} />
              </div>

            </div>

            

          </div>
          
          <div className="bg-gray-100 p-6 rounded-lg col-span-1 w-full">
            <h3 className="font-bold mb-6">2️⃣ Choose tasks</h3>
            {/* {Object.keys(projectData.tasks).map((category) => (
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
            ))} */}
              {/* <div className="flex space-x-4 mt-6">
                  <button type="button" onClick={handleSubmit} className="bg-gray-500 text-white px-6 py-2 rounded">Add Task</button>
              </div> */}
            {tasks.map((category) => (
            <div key={category.id} className="mb-6">
              <input
                    type="checkbox"
                    // checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategorySelection(category.id)}
                  />
              <label className="ml-2 font-semibold">{category.name}</label>
              <div className="ml-4">
                {category.children.map((task) => (
                  <div key={task.id}>
                  <input
                              type="checkbox"
                              // checked={selectedTasks.includes(task.id)}
                              onChange={() => handleTaskSelection(task.id)}
                            />
                  <label className="ml-2">{task.name}</label>
              </div>
              ))}
            </div>
          </div>
    ))}
              <div>
                <p>*To customize tasks, please go to the project details page.</p>
              </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 mt-6">
          <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-6 py-2 rounded">Cancel</button>
          <button type="submit" onClick={handleSubmit} disabled={loading} className="bg-blue-500 text-white px-6 py-2 rounded"> {loading ? "Creating..." : "Create"}</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
