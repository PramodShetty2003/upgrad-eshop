import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import { ShoppingCart, Search } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import "./NavBar.css"; // Import the external CSS file

const NavBar = () => {
  const navigate = useNavigate();
  const { onSearch, loginClick, setLoginClick, user, logout } =
    useContext(AuthContext);

  const handleSearchChange = (event) => {
    onSearch(event.target.value); // Update searchQuery globally
  };

  const handleLoginClick = () => {
    setLoginClick(true);
  };

  const handleHomeClick = () => {
    setLoginClick(false);
  };

  const handleLogout = () => {
    setLoginClick(false);
    logout();
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AppBar position="static" color="primary" className="navbar">
      <Toolbar className="navbar-toolbar">
        {/* Left Section: Logo and Name */}
        <Box className="navbar-logo">
          <ShoppingCart fontSize="large" />
          <Typography variant="h6" className="navbar-title">
            upGrad Eshop
          </Typography>
        </Box>

        {/* Center Section: Search Bar */}
        {user && (
          <TextField
            placeholder="Search..."
            onKeyDown={handleSearchChange}
            variant="outlined"
            size="small"
            className="navbar-search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        )}

        {/* Right Section: Navigation Links */}
        <Box className="navbar-links">
          {!user ? (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/products"
                onClick={handleHomeClick}
              >
                Home
              </Button>
              <Button
                color={loginClick ? "inherit" : "error"}
                variant={loginClick ? "text" : "contained"}
                onClick={handleLoginClick}
                component={Link}
                to="/login"
              >
                Login
              </Button>
              {loginClick && (
                <Button color="inherit" component={Link} to="/signup">
                  Signup
                </Button>
              )}
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/products">
                Home
              </Button>
              {user?.roles &&
                Array.isArray(user.roles) &&
                user.roles.some((role) => role.toLowerCase() === "admin") && (
                  <Button color="inherit" component={Link} to="/add-products">
                    Add Products
                  </Button>
                )}

              <Button color="error" variant="contained" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
