import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./MyPosts.css"; // Import your custom CSS for styling
import { IoIosCloseCircleOutline } from "react-icons/io";
import './BloodDonation/Blooddonation.css'
import { FaCheckCircle } from "react-icons/fa";
import { Col, Card, Button } from "react-bootstrap";
import { FcDeleteDatabase } from "react-icons/fc";

const MyPosts = () => {
  const [rooms, setRooms] = useState([]);
  const [donation, setDonation] = useState([]);
  const [myevents, setMyevents] = useState([]);
  const navigate = useNavigate();

  // Fetch student ID and JWT token from session storage

  const token = sessionStorage.getItem("studentToken");
  const studentId = sessionStorage.getItem("studentId");

  useEffect(() => {
    if (studentId && token) {
      const fetchRooms = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/room/getbyid/${studentId}`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          setRooms(response.data);
        } catch (error) {
          console.error("Error fetching rooms:", error);
          // Redirect to login page if user is not authenticated
          if (error.response && error.response.status === 401) {
            navigate("/");
          } 
        }
      };

      fetchRooms();
    } else {
      // Redirect to login page if user is not authenticated
      navigate("/login");
    }
  }, [studentId, token, navigate]);

  const handleEdit = async (id, currentStatus) => {
    const newStatus = currentStatus === "Available" ? "Occupied" : "Available";

    try {
      const response = await axios.put(
        `http://localhost:8080/api/room/updatestatus/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Room status updated to ${newStatus}!`,
        timer: 1500,
        showConfirmButton: false,
      });

      // Update UI without re-fetching
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room._id === id ? { ...room, status: newStatus } : room
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update room status.",
      });
    }
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/room/delete/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Room deleted successfully.",
        timer: 1500,
        showConfirmButton: false
      });

      // Update state to remove the deleted room from UI
      setRooms((prevRooms) => prevRooms.filter((room) => room._id !== id));

    } catch (error) {
      console.error("Error deleting room:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete room. Please try again.",
      });
    }
  };

  const onclose = () => {
    navigate('/Dashboard')
  };

  //blood donation details
  useEffect(() => {
    // Redirect if no token or studentId
    if (!token || !studentId) {
      navigate('/');
      return;
    }


    const fetchDonations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/blooddonation/donationperson/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDonation(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching donations:", error);

        if (error.response?.status === 401) {
          // Unauthorized – token likely expired
          navigate('/');
        }
      }
    };

    fetchDonations();
  }, [studentId, token, navigate]);



  //function to update status:
  const updatestatus = async (id, currentStatus) => {
    const token = sessionStorage.getItem("studentToken"); // make sure token is fetched
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
      const res = await axios.put(
        `http://localhost:8080/api/blooddonation/donationstatus/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      Swal.fire({
        icon: "success",
        text: "Status updated successfully.",
        timer: 2000,
        showConfirmButton: false
      });


      setDonation((prevDonations) =>
        prevDonations.map((donation) =>
          donation._id === id ? { ...donation, status: newStatus } : donation
        )
      );

    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update status. Please try again."
      });
    }
  };


  //function to delete the donations 
  const deleterequest = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/blooddonation/deletedonation/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Request deleted successfully.",
        timer: 1500,
        showConfirmButton: false
      });

      // Update state to remove the deleted room from UI
      setDonation((prevReq) => prevReq.filter((donation) => donation._id !== id));

    } catch (error) {
      console.error("Error deleting room:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete room. Please try again.",
      });
    }
  };

  //event details:
  useEffect(() => {
    // Redirect if no token or studentId
    if (!token || !studentId) {
      navigate('/');
      return;
    }


    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/event/getbyid/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  setMyevents(response.data.data || []);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching donations:", error);

        if (error.response?.status === 401) {
          // Unauthorized – token likely expired
          navigate('/');
        } 
      }
    };

    fetchEvents();
  }, [studentId, token, navigate]);



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

      } else {
        Swal.fire(
          "Error!",
          "Failed to delete event. Please try again.",
          "error"
        );
      }
        setMyevents((prevReq) => prevReq.filter((myevents) => myevents._id !== id));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error deleting event. Please try again.";
      Swal.fire("Error!", errorMessage, "error");
      console.error("Error deleting event:", error);
    }
  };

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

  return (
    <div className="post-wrapper">
      <div className="my-posts-container">
        <button className="close-button" onClick={onclose}><IoIosCloseCircleOutline className="close-button-icon" /></button>
        <h1>My Posts</h1>

        {/* blood donation */}
        <h1 style={{ textAlign: "left" }}>Blood Donation Details</h1>
        <div className="d-flex flex-wrap justify-content-left">
          { donation.length === 0 ?(<p>No Blood Requests Found</p>): (donation.map((donation) => (
            <Col key={donation._id} xs={12} sm={6} md={4} className="mb-2">
              <Card style={{ width: "90%", gap: "10px" }}>

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
                    <button title="Click here to update status" style={{ marginLeft: '8px', border: 'none', backgroundColor: "white" }}
                      onClick={() => updatestatus(donation._id, donation.status)}
                    >
                      <FaCheckCircle color={donation.status === 'Inactive' ? 'green' : 'black'} />
                    </button>
                  </Card.Text>

                  <Card.Text>
                    <strong>College:</strong> {donation.studentCollege?.name}
                  </Card.Text>
                  <Card.Text>
                    <strong>City:</strong> {donation.studentCollege?.city?.name}
                  </Card.Text>


                  <Button variant="primary" onClick={() => deleterequest(donation._id)}>
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          )))}
        </div>


        {/* hostel vacany */}
        <h1 style={{ textAlign: "left", marginTop: "20px" }}>Room Details</h1>
        <div className="cards-container">
          { rooms.length ===0 ? (<p> No Room Details Found</p>) :(rooms.map(room => (
            <div key={room._id} className="room-card">
              <h2>{room.college.name}</h2>
              <p>{room.description}</p>
              <p>Vacancies: {room.noOfVacancy}</p>
              <p>Rent: ₹{room.rent}</p>
              <p>Status: {room.status}</p>
              <div className="buttonclass">
                <button onClick={() => handleEdit(room._id, room.status)}>
                  Mark as {room.status === "Available" ? "Occupied" : "Available"}
                </button>

                <button onClick={() => handleDelete(room._id)}>Delete</button>
              </div>
            </div>
          )))}
        </div>

        {/* events */}
        <h1 style={{ textAlign: "left", marginTop: "20px" }}>Event Details</h1>
        <div className="d-flex flex-wrap">
          {myevents.length === 0 ? (
            <p>No events found.</p>
          ) : (
            myevents.map(event => (
              <Card key={event._id} className="event-card" style={{ width: "18rem", marginLeft: "10px" }}>
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
                  <Button
                    onClick={() => del(event._id)}
                    variant="danger"
                    style={{ marginLeft: "10px" }}
                  >
                    <FcDeleteDatabase /> Delete
                  </Button>
                </Card.Body>
              </Card>
            ))
          )}
        </div>



      </div>



    </div>
  );
};

export default MyPosts;
