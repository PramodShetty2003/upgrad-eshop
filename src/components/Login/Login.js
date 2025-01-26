import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import { TextField, Button, Snackbar, Alert } from "@mui/material";
import { AuthContext } from "../AuthContext";
import "./Login.css";

const Login = () => {
  const { user, setUser, setIsLoggedIn, setRole } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!credentials.email || !credentials.password) {
      setErrorMessage("All fields are required.");
      setOpenSnackbar(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      setErrorMessage("Please enter a valid email address.");
      setOpenSnackbar(true);
      return;
    }

    try {
      const payload = {
        username: credentials.email,
        password: credentials.password,
      };

      const response = await axios.post(
        "https://dev-project-ecommerce.upgrad.dev/api/auth/signin",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = response?.headers["x-auth-token"];
      console.log(token)
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(response.data));

      // Update the user state
      setUser({ ...response.data, token });
      setIsLoggedIn(true);

      if (response.data.roles && response.data.roles.length > 0) {
        setRole(response.data.roles[0]); // Use the first role
      }
      console.log("Login is Successful");
      navigate("/products");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      setErrorMessage(errorMessage);
      setOpenSnackbar(true);
    }
  };

  // Log and update role in useEffect
  useEffect(() => {
    if (user?.roles && user.roles.length > 0) {
      setRole(user.roles[0]); // Use the first role from the array
      console.log("User role:", user.roles[0]);
    }
  }, [user, setRole]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <LockIcon className="login-icon" />
          <h2 className="login-title">Sign in</h2>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-container">
            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              required
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              error={isSubmitted && !credentials.email}
              helperText={
                isSubmitted && !credentials.email ? "Email is required." : ""
              }
            />
          </div>
          <div className="input-container">
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              error={isSubmitted && !credentials.password}
              helperText={
                isSubmitted && !credentials.password
                  ? "Password is required."
                  : ""
              }
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="login-button"
          >
            SIGN IN
          </Button>
        </form>
        <p className="login-link-text">
          Don't have an account?{" "}
          <a href="/signup" className="login-link">
            Sign Up
          </a>
        </p>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
