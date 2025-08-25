import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { CiSearch } from "react-icons/ci";
import { FaBell } from "react-icons/fa";
import { RiSettings5Fill } from "react-icons/ri";
import { AiFillDashboard } from "react-icons/ai";
import { LuLogOut } from "react-icons/lu";
import { MdPermContactCalendar } from "react-icons/md";
import img from './Image/blood donation card.png';
import img2 from './Image/e-commerce website theme for Product Sales.png';
import img3 from './Image/neat hostel room.png';
import img4 from './Image/College Events with smiling faces.png';
import { TbHelpSquareFilled } from "react-icons/tb";
import { SiGoogleforms } from "react-icons/si";
import { MdDynamicFeed } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Swal from 'sweetalert2';

function Dashboard() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true); // State to control loader visibility
  let nav = useNavigate();
  const name = sessionStorage.getItem("name")

  function eventbt() {
    nav('/Event');
  }

  function blood() {
    nav('/BloodDonation');
  }

  function hostel() {
    nav('/Hostelvacc');
  }

  const logout = () => {
    nav('/')
    sessionStorage.removeItem("studentId")
    sessionStorage.removeItem("studentToken")
    sessionStorage.removeItem("name")
    Swal.fire({
      icon:"success",
      text:"Logged out Succesfully",
      timer:2000
    })
  }

  const myposts=()=>{
    nav('/myposts')
  }

  useEffect(() => {
    // Hide loader after 4 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    // Clear timer if component is unmounted
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

    );
  }

  return (
    <div>
      {/* Topbar */}
      <Row className="dboard">
        <Col className="topbar">
          <Row className="align-items-center">
            <Col sm={8}>
              <h1 style={{marginLeft:"20px"}} >Welcome <span style={{ color: "#764ba2" }}>  {name} </span></h1>
            </Col>
            <Col
              sm={3}
              className="d-flex align-items-center justify-content-between position-relative"
              style={{gap:"10px"}}
            >
              <div className="position-relative">
                <input type="text" placeholder="Search" className="searchbox" />
                <CiSearch className="searchicon" />
              </div>
              <button className='closebutton'><LuLogOut onClick={logout} style={{ color: "white", fontSize:"20px", cursor: "pointer" }} /></button>
              
            </Col>


          </Row>
        </Col>
      </Row>

      <Row>
        {/* Left Sidebar */}
        <Col xs={10} sm={1} className="leftbar">
          <span className="d1" data-tooltip="Dashboard">
            <div><AiFillDashboard className="dashicon" /></div>
          </span>
          <span className="d1" data-tooltip="Contact"><MdPermContactCalendar className="dashicon" /></span>
        <span className="d1" data-tooltip="Find your posts here" onClick={myposts}>
  <MdDynamicFeed className="dashicon" />
</span>

          <span className="d1"  data-tooltip="Help & Support"><TbHelpSquareFilled className="dashicon" /></span>
          <span className="d1" data-tooltip="Forms"><SiGoogleforms className="dashicon" /></span>
        </Col>

        {/* Card Section */}
        <Col sm={9}>
          <Row className="radio-btns">
            {/* First Card */}
            <Col sm={4}>
              <div
                className={`radio-btns__btn ${hoveredCard === 1 ? 'hovered' : ''}`}
                role="radio"
                aria-checked={hoveredCard === 1}
                tabIndex="-1"
                aria-label="Select image one"
                onMouseEnter={() => setHoveredCard(1)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Card>
                  <Card.Img variant="top" src={img} className="img" />
                  <Card.Body>
                    <Card.Title>Blood Donation</Card.Title>
                    <Card.Text>
                     Join us in saving lives by donating blood and making a real difference
                    </Card.Text>
                    <Button variant="primary" onClick={blood}>Register Now!</Button>
                  </Card.Body>
                </Card>
              </div>
            </Col>


            {/* Third Card */}
            <Col sm={4}>
              <div
                className={`radio-btns__btn ${hoveredCard === 3 ? 'hovered' : ''}`}
                role="radio"
                aria-checked={hoveredCard === 3}
                tabIndex="-1"
                aria-label="Select image three"
                onMouseEnter={() => setHoveredCard(3)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Card>
                  <Card.Img variant="top" src={img3} className="img" />
                  <Card.Body>
                    <Card.Title>Hostel Room Vacancy</Card.Title>
                    <Card.Text>
                      Find available hostel rooms with ease and secure your spot quickly.
                    </Card.Text>
                    <Button variant="primary" onClick={hostel}>Book Your Room Today!</Button>
                  </Card.Body>
                </Card>
              </div>
            </Col>

            {/* Fourth Card */}
            <Col sm={4}>
              <div
                className={`radio-btns__btn ${hoveredCard === 4 ? 'hovered' : ''}`}
                role="radio"
                aria-checked={hoveredCard === 4}
                tabIndex="-1"
                aria-label="Select image four"
                onMouseEnter={() => setHoveredCard(4)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Card>
                  <Card.Img variant="top" src={img4} className="img" />
                  <Card.Body>
                    <Card.Title>College Events</Card.Title>
                    <Card.Text >
                   Stay updated and be part of exciting college events and activities.
                    </Card.Text>
                    <Button variant="primary" onClick={eventbt}>Join the Events Now!</Button>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
