import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import './Login.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Function to validate email format
    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError("");
        setPasswordError("");

        let valid = true;

        // Input validations
        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address.");
            valid = false;
        }

        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters long.");
            valid = false;
        }

        // Proceed if inputs are valid
        if (valid) {
            setLoading(true);
            try {
                const formdata = { email: email.trim().toLowerCase(), password: password.trim() };

                // Make API call
                const response = await axios.post("https://uniwing-backend.onrender.com/api/student/login", formdata);

                console.log("API Response:", response.data);
                
                if (response.data?.token) {
                    const { token } = response.data;

                    
                    const { id } = JSON.parse(atob(token.split('.')[1]));
                    const {name} = response.data.student

                    // Save token and user ID in sessionStorage
                    sessionStorage.setItem("studentToken", token);
                    sessionStorage.setItem("studentId", id);
                    sessionStorage.setItem("name",name)
                    Swal.fire({
                        icon: 'success',
                        title: 'Login Successful',
                        text: 'Redirecting to dashboard...',
                        timer: 1500,
                        showConfirmButton: false,
                    });

                    // Navigate to dashboard after success
                    setTimeout(() => {
                        navigate('/Dashboard');
                    }, 1500);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed',
                        text: response.data.message || 'Something went wrong. Please try again.',
                    });
                }
            } catch (err) {
                console.error("Error during login:", err.response?.data);
                Swal.fire({
                    icon: 'error',
                    title: 'Login Error',
                    text: err.response?.data?.message || 'An error occurred during login. Please try again.',
                });
            } finally {
                setLoading(false);
            }
        }
    };

    // Navigate to create account page
    const goToCreateAccount = () => {
        navigate('/Signup');
    };

    return (
        <div className="login-container">
            <div className='login-column'>
            <div className="login-box">
                <h2>Welcome to Uniwing</h2>
                <h2>Sign into your account</h2>

                <form onSubmit={handleSubmit} noValidate>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {emailError && <p className="error">{emailError}</p>}

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {passwordError && <p className="error">{passwordError}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Loading..." : "Continue"}
                    </button>
                </form>

                
                    
                   <p className="signup-link">
                    New user? <a href="" onClick={goToCreateAccount}>Create an account</a>
                </p>
                

                
            </div>
            
</div>
        </div>
    );
}

export default Login;
