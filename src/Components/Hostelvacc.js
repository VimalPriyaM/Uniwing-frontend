import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Row, Col } from "react-bootstrap";
import { AiFillDashboard } from "react-icons/ai";
import { MdPermContactCalendar, MdDynamicFeed } from "react-icons/md";
import { TbHelpSquareFilled } from "react-icons/tb";
import { SiGoogleforms } from "react-icons/si";

import "./Hostelvacc.css";

const Hostelvacc = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/room/getall", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRooms(response.data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed to fetch rooms",
          text: error?.response?.data?.message || "Something went wrong",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [token]);

  const myposts = ()=>{
  navigate('/myposts')
}

  const handleViewDetails = (room) => {
    Swal.fire({
      title: "Room Details",
      html: `
        <strong>Description:</strong> ${room.description || "N/A"} <br/>
        <strong>Rent (₹):</strong> ${room.rent || "N/A"} <br/>
      `,
      icon: "info",
      confirmButtonText: "Close",
    });
  };

  return (
    <div className="hostelvacc-wrapper">
      <Row className="gx-0">
        {/* Sidebar */}
        <Col md={1} sm={10} xs={11} className="leftbar2">
          <span className="d2" data-tooltip="Dashboard">
            <Link to="/Dashboard" className="nav-link">
              <AiFillDashboard className="dashicon" />
            </Link>
          </span>
          <span className="d2" data-tooltip="Contact">
            <MdPermContactCalendar className="dashicon" />
          </span>
          <span onClick={myposts} className="d2" data-tooltip="Find Your posts here">
            <MdDynamicFeed className="dashicon" />
          </span>
          <span className="d2" data-tooltip="Help & Support">
            <TbHelpSquareFilled className="dashicon" />
          </span>
          <span className="d2" data-tooltip="Forms">
            <SiGoogleforms className="dashicon" />
          </span>
        </Col>

        {/* Main Content */}
        <Col md={12} xs={12}>
          <div className="hostel-vacc-container">
            <button className="add-room-btn" onClick={() => navigate("/vacancyform")}>
              Add Room Details
            </button>
            
            <h1>Hostel Room Vacancies</h1>

            {loading ? (
              <p style={{ textAlign: "center" }}>Loading...</p>
            ) : (
              <div className="rooms-container">
                {rooms.length > 0 ? (
                  rooms.map((room) => (
                    <div key={room._id} className="room-card">
                      <h3>Vacancies: {room.noOfVacancy}</h3>
                      <p>College: {room.college?.name || <i>Not mentioned</i>}</p>
                      <p>Status: {room.status || "Unknown"}</p>
                      <button className="view-details-btn" onClick={() => handleViewDetails(room)}>
                        View Details
                      </button>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: "center" }}>No rooms available at the moment.</p>
                )}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Hostelvacc;
