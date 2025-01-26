import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./common/Navbar";
import { AuthContext } from "./components/AuthContext";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Products from "./components/Products/Products";
import AddProduct from "./components/AddProduct/AddProduct";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import CreateOrder from "./components/CreateOrder/CreateOrder"; // Added CreateOrder import
import ModifyProduct from "./components/ModifyProduct/ModifyProduct";

const App = () => {
  const { user, role, isLoggedIn } = useContext(AuthContext);

  return (
    <Router>
      <NavBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/products"
          element={isLoggedIn ? <Products /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-products"
          element={
            isLoggedIn && role?.toLowerCase() === "admin" ? (
              <AddProduct />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/modify-product/:id" element={<ModifyProduct />} />
        <Route
          path="/create-order"
          element={isLoggedIn ? <CreateOrder /> : <Navigate to="/login" />} // Protected CreateOrder route
        />
      </Routes>
    </Router>
  );
};

export default App;
