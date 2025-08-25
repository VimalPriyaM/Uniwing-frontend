import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Form, Button, Card } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AiFillDashboard } from "react-icons/ai";
import { MdPermContactCalendar, MdDynamicFeed } from "react-icons/md";
import { TbHelpSquareFilled } from "react-icons/tb";
import { SiGoogleforms } from "react-icons/si";

import { BiSolidEditAlt } from "react-icons/bi";
import "./Event.css";

function Event() {
  const [res, setRes] = useState([]); // Store event data
  const [loading, setLoading] = useState(false); // Loading state
  const [colleges, setColleges] = useState([]); // Store colleges data
  const [collegesLoading, setCollegesLoading] = useState(true); // Loading state for colleges
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [isEdit, setIsEdit] = useState(false); // To track if it's edit mode
  const [currentEvent, setCurrentEvent] = useState({}); // Store current event data for editing
  const id = sessionStorage.getItem("studentId")
  const [formData, setFormData] = useState({
    // Form state for inputs
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    timeFrom: "",
    timeTo: "",
    range: "",
    college: "",
  });
  const [imageFile, setImageFile] = useState(null); // Store the image file
  const nav = useNavigate();

  // Fetch all events
  const handleChange = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/event/getall"
      );
      console.log(response.data.data);
      
      setRes(response.data.data); // Store event data in state
    } catch (error) {
      console.error("Error fetching events:", error.response || error.message);
      Swal.fire("Error!", "Failed to fetch events. Please try again.", "error");
    } finally {
      setLoading(false); // Turn off loading
    }
  };

  // Fetch all colleges
  const fetchColleges = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/college/getallcolleges"
      );
      setColleges(response.data || []); // Ensure colleges are set to an empty array if no data
    } catch (error) {
      console.error(
        "Error fetching colleges:",
        error.response || error.message
      );
      Swal.fire(
        "Error!",
        "Failed to fetch colleges. Please try again.",
        "error"
      );
    } finally {
      setCollegesLoading(false); // Once data is fetched, stop loading
    }
  };

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image change
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Store the selected file
  };

  // Show event details in a Swal modal
  const showEventDetails = (event) => {
    Swal.fire({
      title: event.title,
      html: `
        <p>${event.description}</p>
        <p><strong>Start Date:</strong> ${new Date(
          event.startDate
        ).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> ${new Date(
          event.endDate
        ).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${event.timeFrom} to ${event.timeTo}</p>
        <p><strong>Range:</strong> ${event.range}</p>
        <p><strong>College:</strong> ${event.college?.name || "N/A"}</p>
      `,
      icon: "info",
      confirmButtonText: "Close",
    });
  };

  // Submit the new or updated event
  const submit = async () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.range ||
      !formData.college
    ) {
      Swal.fire("Error!", "Please fill all required fields.", "error");
      return; // Prevent submission if any required field is empty
    }

    // Extract college ID if it's an object
    const collegeId =
      colleges.find((college) => college.name === formData.college)?._id ||
      formData.college;

    const updatedEventData = { ...formData, college: collegeId };

    const apiEndpoint = isEdit
      ? `http://localhost:8080/api/event/update/${currentEvent._id}`
      : `http://localhost:8080/api/event/create/${id}`;
    const method = isEdit ? "put" : "post";

    try {
      const formDataToSend = new FormData();
      for (const key in updatedEventData) {
        formDataToSend.append(key, updatedEventData[key]);
      }
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

console.log("Sending data to API:", Object.fromEntries(formDataToSend.entries()));

      const response = await axios({
        method,
        url: apiEndpoint,
        data: formDataToSend,
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      
      if (response.status === 200 || response.status === 201) {
        Swal.fire(
          "Success!",
          isEdit ? "Event Updated Successfully" : "Event Created Successfully",
          "success"
        );
        handleChange(); // Refresh event data
        setShowModal(false); // Close the modal
        setFormData({
          // Reset form fields
          title: "",
          description: "",
          startDate: "",
          endDate: "",
          timeFrom: "",
          timeTo: "",
          range: "",
          college: "",
        });
        setImageFile(null); // Reset image file
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.";
      console.error("Error:", error);
      Swal.fire("Error!", errorMessage, "error");
    }
  };

  // Open modal for creating new event
  const openEventForm = () => {
    setIsEdit(false); // Set to create mode
    setFormData({
      // Reset form fields
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      timeFrom: "",
      timeTo: "",
      range: "",
      college: "",
    });
    setShowModal(true); // Show modal
    setImageFile(null); // Reset image file
  };

  // Open modal for editing an event
  const edt = (row) => {
    setIsEdit(true); // Set to edit mode
    setCurrentEvent(row); // Set current event data for editing
    setFormData({
      // Populate form with current event data
      title: row.title,
      description: row.description,
      startDate: row.startDate,
      endDate: row.endDate,
      timeFrom: row.timeFrom,
      timeTo: row.timeTo,
      range: row.range,
      college: row.college?.name || "",
    });
    setShowModal(true); // Show the modal
  };

  // Delete an event
  const del = async (id) => {
    try {
      if (!id) {
        Swal.fire("Error!", "Invalid event ID.", "error");
        return;
      }

      const response = await axios.post(
        `http://localhost:8080/api/event/delete/${id}`
      );
      if (response.status === 200) {
        Swal.fire("Success!", "Event Deleted Successfully", "success");
        handleChange(); // Refresh event list
      } else {
        Swal.fire(
          "Error!",
          "Failed to delete event. Please try again.",
          "error"
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error deleting event. Please try again.";
      Swal.fire("Error!", errorMessage, "error");
      console.error("Error deleting event:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    handleChange(); // Fetch events
    fetchColleges(); // Fetch colleges
  }, []);
  
const myposts=()=>{
  nav('/myposts')
}
  return (
    <div className="back">
      <Row>
        <Col md={1} sm={10} xs={11} className="leftbar2">
          <span className="d2" data-tooltip="Dashboard">
            <Link to="/Dashboard" className="nav-link">
              <AiFillDashboard className="dashicon" />
            </Link>
          </span>
          <span className="d2" data-tooltip="Contact">
            <MdPermContactCalendar className="dashicon" />
          </span>
          <span className="d2" onClick={myposts} data-tooltip="Find your posts here">
            <MdDynamicFeed className="dashicon" />
          </span>
          <span className="d2" data-tooltip="Help & Support">
            <TbHelpSquareFilled className="dashicon" />
          </span>
          <span className="d2" data-tooltip="Forms">
            <SiGoogleforms className="dashicon" />
          </span>
        </Col>

        <Col >
          <div className="event-container">
            <button className="btn-create-event" onClick={openEventForm}>
              Create New Event
            </button>

            <div className="d-flex flex-wrap">
              {res.map((event) => (
                <Card key={event._id} className="event-card" style={{ width: "18rem", marginLeft:"10px"}}>
                  <Card.Img
                    variant="top"
                    src={
                      event.image
                        ? `http://localhost:8080${event.image}`
                        : "/uploads/default.jpg"
                    }
                  />
                  <Card.Body className="event-card-body">
                    <Card.Title>{event.title}</Card.Title>
                    
                    <Button onClick={() => showEventDetails(event)} variant="primary">
                      View Details
                    </Button>
                    
                  </Card.Body>
                </Card>
              ))}
            </div>

            {/* Modal Form for Event Creation/Editing */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>
                  {isEdit ? "Edit Event" : "Create New Event"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group controlId="eventTitle">
                    <Form.Label>Event Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      placeholder="Enter Event Title"
                    />
                  </Form.Group>

                  <Form.Group controlId="eventDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      placeholder="Enter Event Description"
                    />
                  </Form.Group>

                  <Form.Group controlId="eventStartDate">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleFormChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="eventEndDate">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleFormChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="eventTimeFrom">
                    <Form.Label>Time From</Form.Label>
                    <Form.Control
                      type="time"
                      name="timeFrom"
                      value={formData.timeFrom}
                      onChange={handleFormChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="eventTimeTo">
                    <Form.Label>Time To</Form.Label>
                    <Form.Control
                      type="time"
                      name="timeTo"
                      value={formData.timeTo}
                      onChange={handleFormChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="eventRange">
                    <Form.Label>Range</Form.Label>
                    <Form.Control
                      type="text"
                      name="range"
                      value={formData.range}
                      onChange={handleFormChange}
                      placeholder="Enter Event Range"
                    />
                  </Form.Group>

                  <Form.Group controlId="eventCollege">
                    <Form.Label>College</Form.Label>
                    <Form.Control
                      as="select"
                      name="college"
                      value={formData.college}
                      onChange={handleFormChange}
                    >
                      <option value="">Select College</option>
                      {colleges.map((college) => (
                        <option key={college._id} value={college.name}>
                          {college.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="eventImage">
                    <Form.Label>Event Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    onClick={submit}
                    style={{ marginTop: "10px" }}
                  >
                    {isEdit ? "Save Changes" : "Create Event"}
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Event;
