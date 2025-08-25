import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./MyPosts.css"; // Import your custom CSS for styling
import { IoIosCloseCircleOutline } from "react-icons/io";

const MyPosts = () => {
  const [rooms, setRooms] = useState([]);
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
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to fetch your posts. Please try again.",
            });
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

const onclose =()=>{
  navigate('/Hostelvacc')
}

  return (
    <div className="post-wrapper"> 
    <div className="my-posts-container">
      <button className="close-button" onClick={onclose}><IoIosCloseCircleOutline className="close-button-icon" /></button>
      <h1>My Room Details</h1>
      <div className="cards-container">
        {rooms.map(room => (
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
        ))}
      </div>
    </div>
    </div>
  );
};

export default MyPosts;
