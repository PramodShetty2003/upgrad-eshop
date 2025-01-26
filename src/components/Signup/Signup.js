import React, { useState } from "react";
import axios from "axios";
import LockIcon from '@mui/icons-material/Lock'; // Import LockIcon
import "./Signup.css"; // Import the new Signup CSS file

const Signup = () => {
  const [details, setDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: ""
  });

  const [errorMessage, setErrorMessage] = useState(""); // State to store error message
  const [successMessage, setSuccessMessage] = useState(""); // State to store success message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message
    setSuccessMessage(""); // Reset success message

    if (details.password !== details.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      await axios.post( "https://dev-project-ecommerce.upgrad.dev/api/auth/signup", details);
      setSuccessMessage("Signup successful! Please log in.");
      setDetails({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", contactNumber: "" }); // Reset form fields
    } catch (error) {
      setErrorMessage("Signup failed! Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <LockIcon className="signup-icon" /> {/* Lock icon here */}
          <h2 className="signup-title">Sign Up</h2>
        </div>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-container">
            <label htmlFor="firstName" className="signup-label">First Name *</label>
            <input
              type="text"
              id="firstName"
              placeholder="Enter your first name"
              className="signup-input"
              value={details.firstName}
              onChange={(e) => setDetails({ ...details, firstName: e.target.value })}
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="lastName" className="signup-label">Last Name *</label>
            <input
              type="text"
              id="lastName"
              placeholder="Enter your last name"
              className="signup-input"
              value={details.lastName}
              onChange={(e) => setDetails({ ...details, lastName: e.target.value })}
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="email" className="signup-label">Email Address *</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="signup-input"
              value={details.email}
              onChange={(e) => setDetails({ ...details, email: e.target.value })}
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="password" className="signup-label">Password *</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="signup-input"
              value={details.password}
              onChange={(e) => setDetails({ ...details, password: e.target.value })}
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="confirmPassword" className="signup-label">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              className="signup-input"
              value={details.confirmPassword}
              onChange={(e) => setDetails({ ...details, confirmPassword: e.target.value })}
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="contactNumber" className="signup-label">Contact Number *</label>
            <input
              type="tel"
              id="contactNumber"
              placeholder="Enter your contact number"
              className="signup-input"
              value={details.contactNumber}
              onChange={(e) => setDetails({ ...details, contactNumber: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Error message */}
        {successMessage && <p className="success-message">{successMessage}</p>} {/* Success message */}
        <p className="signup-link-text">
          Already have an account? <a href="/login" className="signup-link">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
