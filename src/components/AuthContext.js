import React, { createContext, useState, useEffect } from "react";

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Retrieve values from localStorage or set default values
  const storedLoginClick = localStorage.getItem("loginClick") === "true";
  const storedUser = JSON.parse(localStorage.getItem("user")) || null;
  const storedRole = localStorage.getItem("role") || null;
  const storedIsLoggedIn = storedUser !== null;

  const [loginClick, setLoginClick] = useState(storedLoginClick);
  const [isLoggedIn, setIsLoggedIn] = useState(storedIsLoggedIn);
  const [role, setRole] = useState(storedRole);
  const [user, setUser] = useState(storedUser);

  // New state for search functionality
  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => {
    // Update localStorage whenever related state changes
    localStorage.setItem("loginClick", loginClick);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("authToken");
    }
  }, [loginClick, user, role]);

  // Logout function
  const logout = () => {
    setUser(null);
    setRole(null);
    setIsLoggedIn(false);
  };

  // onSearch function for dynamic search query updates
  const onSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <AuthContext.Provider
      value={{
        loginClick,
        setLoginClick,
        isLoggedIn,
        setIsLoggedIn,
        role,
        setRole,
        user,
        setUser,
        logout,
        searchQuery, // Provide searchQuery in context
        onSearch,    // Provide onSearch function in context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
