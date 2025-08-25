import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import img4 from "../Image/bloodcard.png";
import { Row, Col } from "react-bootstrap";
import { TbHelpSquareFilled } from "react-icons/tb";
import { SiGoogleforms } from "react-icons/si";
import { MdDynamicFeed } from "react-icons/md";
import { AiFillDashboard } from "react-icons/ai";
import { MdPermContactCalendar } from "react-icons/md";
import Spinner from "react-bootstrap/Spinner";
import { Link, useNavigate } from "react-router-dom";
import "./Blooddonation.css";

import Swal from 'sweetalert2'



function BloodDonation() {
  const [donation, setDonation] = useState([]);
  const [colleges, setColleges] = useState([]);
  const token = sessionStorage.getItem("studentToken")
  const [loading, setLoading] = useState(false); // Loading state
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    contactNo: "",
    bloodGroup: "",
    hospitalLocation: "",
    description: "",
    studentCollege: "",
  });
const id = sessionStorage.getItem("studentId")
  // Function to fetch all donations
  const fetchDonations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/blooddonation/alldonations"
      );
      setDonation(response.data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  // Function to fetch all colleges
  const fetchColleges = async () => {
    try {
      const college = await axios.get(
        "http://localhost:8080/api/college/getallcolleges"
      );
      setColleges(college.data);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    }
  };


const myposts = ()=>{
  navigate('/myposts')
}

  // Initial fetch on component mount
  useEffect(() => {
    fetchDonations();
    fetchColleges();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8080/api/blooddonation/createdonation/${id}`,
        formData
      );
      console.log("Donation request submitted successfully.", response.data);
      setShowModal(false); // Close modal on successful submission
      setFormData({
        name: "",
        contactNo: "",
        bloodGroup: "",
        hospitalLocation: "",
        description: "",
        status: "",
        studentCollege: "",
      }); // Reset form data
      Swal.fire({
        icon:"success",
        text:"Request Added successfully",
        timer:2000

      })
      fetchDonations(); // Refresh donations list
    } catch (error) {
      console.error("Error submitting donation:", error);
    }
  };

  return (
    <div className="back2">
      <Row>
        <Col md={1} sm={10} xs={11} className="leftbar3">
         
          <span className="d3" data-tooltip="Dashboard">
            <Link to="/Dashboard" className="nav-link">
              <div>
                <AiFillDashboard className="dashicon" />{" "}
              </div>{" "}
            </Link>
          </span>
          <span className="d3" data-tooltip="Contact">
            <MdPermContactCalendar className="dashicon" />
          </span>
          <span onClick={myposts} className="d3" data-tooltip="Find Your Posts here">
            <MdDynamicFeed className="dashicon" />
          </span>
          <span className="d3" data-tooltip="Help & Support">
            <TbHelpSquareFilled className="dashicon" />
          </span>
          <span className="d3" data-tooltip="Forms">
            <SiGoogleforms className="dashicon" />
          </span>
        </Col>
        <Col >
          <div className="event-container" >
            <h2 style={{marginTop:"30px"}}>Blood Donation Feed</h2>
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              className="btn-create-event2"
            >
              + Request
            </Button>
            {loading ? (
              <Spinner animation="border" />
            ) : (
              <div className="d-flex flex-wrap justify-content-left">
                {donation.map((donation) => (
                  <Col key={donation._id} xs={12} sm={6} md={4} className="mb-2">
                    <Card style={{ width: "90%", gap: "10px" }}>
                      <Card.Img variant="top" src={img4} />
                      <Card.Body>
                        <Card.Title>{donation.name}</Card.Title>
                        <Card.Text>
                          <strong>Blood Group:</strong> {donation.bloodGroup}
                        </Card.Text>
                        <Card.Text>
                          <strong>Contact:</strong> {donation.contactNo}
                        </Card.Text>
                        <Card.Text>
                          <strong>Hospital:</strong> {donation.hospitalLocation}
                        </Card.Text>
                        <Card.Text>
                          <strong>Description:</strong> {donation.description}
                        </Card.Text>
                        <Card.Text>
                          <strong>Status:</strong> {donation.status}
                          
                        </Card.Text>

                        <Card.Text>
                          <strong>College:</strong> {donation.studentCollege?.name}
                        </Card.Text>
                        <Card.Text>
                          <strong>City:</strong> {donation.studentCollege?.city?.name}
                        </Card.Text>



                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </div>

            )}

            {/* Modal for adding new donation */}
            {/* Modal for adding new donation */}
            <Modal
              show={showModal}
              size="lg"
              onHide={() => setShowModal(false)}
              className="event-modal2"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  Request Blood
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formContactNo">
                    <Form.Label>Contact No</Form.Label>
                    <Form.Control
                      type="text"
                      name="contactNo"
                      value={formData.contactNo}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBloodGroup">
                    <Form.Label>Blood Group</Form.Label>
                    <Form.Control
                      type="text"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formHospitalLocation">
                    <Form.Label>Hospital Location</Form.Label>
                    <Form.Control
                      type="text"
                      name="hospitalLocation"
                      value={formData.hospitalLocation}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formStatus">
                    <Form.Label>Status</Form.Label>
                    <div>
                      <Form.Check
                        type="radio"
                        label="Active"
                        name="status"
                        value="Active"
                        checked={formData.status === "Active"}
                        onChange={handleChange}
                        required
                      />
                      <Form.Check
                        type="radio"
                        label="Inactive"
                        name="status"
                        value="inactive"
                        checked={formData.status === "inactive"}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formStudentCollege">
                    <Form.Label>Student College</Form.Label>
                    <Form.Control
                      as="select"
                      name="studentCollege"
                      value={formData.studentCollege}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select College</option>
                      {colleges.map((college) => (
                        <option key={college._id} value={college._id}>
                          {college.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  {/* Submit Button Inside the Form */}
                  <Button variant="success" type="submit">
                    Submit
                  </Button>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default BloodDonation;
