import React, { useState, useEffect } from 'react';
import { Card, CardTitle, Row, Col } from 'react-bootstrap';
import * as yup from 'yup';
import { Formik, ErrorMessage } from 'formik';
import axios from 'axios';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";

import './Signup.css';

function Signup() {
    const navigate = useNavigate()
    const [data, setData] = useState({
        name: '',
        college: '',
        department: '',
        mobileNo: '',
        gender: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [collegename, setCollegename] = useState([]);
    const [departmentname, setDepartmentname] = useState([]);
    const [Message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showconfirmPassword, setShowconfirmPassword] = useState(false);

    // Fetch colleges
    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/college/getallcolleges');
                setCollegename(res.data);
            } catch (error) {
                setMessage('Error fetching colleges: ' + error.message);
            }
        };
        fetchColleges();
    }, []);

    // input
    function handlechange(e) {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    // ollege selection and  departments
    const handleCollegeChange = (e) => {
        const collegeId = e.target.value;
        setData({ ...data, college: collegeId });

        const selectedCollege = collegename.find((college) => college._id === collegeId);
        setDepartmentname(selectedCollege?.departments || []);
    };

    // Submit form data
    const customsubmit = async (values, e) => {
        console.log('submitting data');

        try {
            console.log('Submitting data:', values);

            const response = await axios.post('http://localhost:8080/api/student/signup', values);

            Swal.fire({
                title: "Regustration Completed successfully",
                text: "Redirecting to the Sign page",
                icon: "success"
            });
            console.log('Response:', response.data);
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
            setMessage(errorMessage);
            console.error('Error:', error);
        }
    };

    // Validation schema using Yup
    let schema = yup.object().shape({
        name: yup.string().required('Name is mandatory'),
        college: yup.string().required('Select a college'),
        department: yup.string().required('Select a department'),
        gender: yup.string().required('Gender is required'),
        mobileNo: yup
            .string()
            .length(10, 'Mobile number must be exactly 10 digits')
            .matches(/^\d{10}$/, 'Mobile number must be digits only')
            .required('Mobile number is required'),
        email: yup
            .string()
            .email('Enter a valid email address')
            .required('Email is required'),
        password: yup
            .string()
            .min(6, 'Password must be at least 6 characters')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[\W_]/, 'Password must contain at least one special character')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .required('Password is required'),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password'), null], 'Passwords must match')
            .required('Confirm password is required'),
    });

    return (

        <div className='signup_two-color-card' >
            <Row>
                <Col sm={4}></Col>
                <Col sm={4}>
                    <Card className='signup_card'>
                        <Card.Body>
                            <h1 className="signup_title">Signup</h1>
                            <Formik
                                initialValues={data}
                                enableReinitialize
                                validationSchema={schema}
                                onSubmit={customsubmit}
                            >
                                {({ handleSubmit, values }) => (
                                    <form onSubmit={handleSubmit}>
                                        <div className='signup_form-group'>
                                            <input type='text' name='name' placeholder='Enter the name' value={values.name} onChange={handlechange} className='signup_name' />
                                            <ErrorMessage name='name' component='p' className='signup_message' />
                                        </div>
                                        <div className='signup_form-group'>
                                            <select name='college' onChange={handleCollegeChange} value={values.college} className='signup_college'>
                                                <option value=''>Select College</option>
                                                {collegename.map((college) => (
                                                    <option key={college._id} value={college._id}>
                                                        {college.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <ErrorMessage name='college' component='p' className='signup_message' />
                                        </div>
                                        <div className='form-group'>
                                            <select name='department' onChange={handlechange} value={values.department} className='signup_department'>
                                                <option value=''>Select Department</option>
                                                {departmentname.map((dept) => (
                                                    <option key={dept._id} value={dept._id}>
                                                        {dept.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <ErrorMessage name='department' component='p' className='signup_message' />
                                        </div>
                                        <div className='signup_form-group'>
                                            <div className='signup_gender'>
                                                <p style={{ color: 'black', fontWeight: 'bolder' }} className='signup_message'>Select Gender</p>
                                                <Row className='signup_gender-options'>
                                                    <Col>
                                                        <input
                                                            type='radio'
                                                            value='Male'
                                                            name='gender'
                                                            onChange={handlechange}
                                                            checked={values.gender === 'Male'}
                                                        />
                                                        <label style={{ color: 'black', fontWeight: 'bolder' }}>Male</label><br />
                                                    </Col>
                                                    <Col>
                                                        <input
                                                            type='radio'
                                                            value='Female'
                                                            name='gender'
                                                            onChange={handlechange}
                                                            checked={values.gender === 'Female'}
                                                        />
                                                        <label style={{ color: 'black', fontWeight: 'bolder' }}>Female</label><br />
                                                    </Col>
                                                    <Col>
                                                        <input
                                                            type='radio'
                                                            value='Others'
                                                            name='gender'
                                                            onChange={handlechange}
                                                            checked={values.gender === 'Others'}
                                                        />
                                                        <label style={{ color: 'black', fontWeight: 'bolder' }}>Others</label><br /><br />
                                                    </Col>
                                                </Row>
                                            </div>
                                            <ErrorMessage name='gender' component='p' className='signup_message' />
                                        </div>
                                        <div className='signup_form-group'>
                                            <input type='text' name='mobileNo' placeholder='Enter the mobile number' value={values.mobileNo} onChange={handlechange} className='signup_mobile' />
                                            <ErrorMessage name='mobileNo' component='p' className='signup_message' />
                                        </div>
                                        <div className='signup_form-group'>
                                            <input type='text' name='email' placeholder='Enter your email ID' value={values.email} onChange={handlechange} className='signup_email' />
                                            <ErrorMessage name='email' component='p' className='signup_message' />
                                        </div>
                                        <div className='signup_form-group'>
                                            <div className='signup_password-container'>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name='password'
                                                    placeholder='Create password'
                                                    value={values.password}
                                                    onChange={handlechange}
                                                    className='signup_password'
                                                />
                                                <button
                                                    className='signup_password-toggle'
                                                    type="button"
                                                   style={{ border: "none",backgroundColor:'#FDFEFE' }}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                                <ErrorMessage name='password' component='p' className='signup_message' />
                                            </div>
                                        </div>

                                        <div className='signup_form-group'>
                                            <div className='signup_password-container'>
                                                <input
                                                    type={showconfirmPassword ? 'text' : 'password'}
                                                    name='confirmPassword'
                                                    placeholder='Confirm password'
                                                    value={values.confirmPassword}
                                                    onChange={handlechange}
                                                    className='signup_confirm-password'
                                                />
                                                <button
                                                    className='signup_password-toggle'
                                                    type="button"
                                                    style={{ border: "none",backgroundColor:'#FDFEFE' }}
                                                    onClick={() => setShowconfirmPassword(!showconfirmPassword)}
                                                >
                                                    {showconfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                                <ErrorMessage name='confirmPassword' component='p' className='signup_message' />
                                            </div>
                                        </div>

                                        <div className='signup_form-group'>
                                            <button type='submit' className='signup_button1'>
                                                Register
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </Formik>
                            {Message && <p className='signup_message'>{Message}</p>}
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={4}></Col>
            </Row>
        </div>

    );
}

export default Signup;
