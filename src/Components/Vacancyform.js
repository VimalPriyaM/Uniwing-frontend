import React, { useState, useEffect } from "react";
import "./Vacancyform.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosCloseCircleOutline } from "react-icons/io";

const Vacancyform = () => {
  const navigate = useNavigate();

  // Initialize form state
  const [formData, setFormData] = useState({
    noOfVacancy: "", // Corrected field name
    description: "",
    rent: "",
    status: "Available", // Status field retained
    college: "",
  });

  const [colleges, setColleges] = useState([]); // State to store fetched colleges

  // Fetch colleges when the component mounts
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get(
          "https://uniwing-backend.onrender.com/api/college/getallcolleges"
        );
        setColleges(response.data); // Assuming response.data contains the college list
      } catch (error) {
        console.error("Error fetching colleges:", error);
      }
    };

    fetchColleges();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve token and studentId from sessionStorage
    const token = sessionStorage.getItem("studentToken");
    const studentId = sessionStorage.getItem("studentId");

    if (!token || !studentId) {
      alert("You are not logged in. Please log in again.");
      navigate("/");
      return;
    }

    try {
      const payload = {
        ...formData,
        studentId, // Attach the studentId to the payload
      };

      console.log("Submitting data: ", payload); // Debugging payload

      // Make the API call with authorization headers
      const res =await axios.post("https://uniwing-backend.onrender.com/api/room/create", payload, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
      });
      console.log(res.data.room._id);
      sessionStorage.setItem('roomid',res.data.room._id)
      alert("Room details updated successfully!");
      navigate("/hostelvacc"); // Redirect back to the main page
    } catch (error) {
      console.error("Error updating room details:", error.response?.data || error);
      alert("Failed to update room details. Please try again.");
    }
  };
const onclose=()=>{
  navigate('/Hostelvacc')
}

  return (
    <div className="form-wrapper"> 
    <div className="vacancy-form-container">
        <button className="close-button" onClick={onclose}><IoIosCloseCircleOutline className="close-button-icon" /></button>
      <h1>Add Room Details</h1>
      <form className="vacancy-form" onSubmit={handleSubmit}>
        <label>
          Number of Vacancies:
          <input
            type="number"
            name="noOfVacancy" // Corrected field name
            value={formData.noOfVacancy}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Room Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Rent (₹):
          <input
            type="text"
            name="rent"
            value={formData.rent}
            onChange={handleChange}
            required
            placeholder="Enter rent amount"
          />
        </label>
        <label>
          Status:
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
          </select>
        </label>
        <label>
          College Name:
          <select
            name="college"
            value={formData.college}
            onChange={handleChange}
            required
          >
            <option value="">Select college</option>
            {colleges.map((college) => (
              <option key={college._id} value={college._id}>
                {college.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Update Room Details</button>
      </form>
    </div>
    </div>
  );
};

export default Vacancyform;
