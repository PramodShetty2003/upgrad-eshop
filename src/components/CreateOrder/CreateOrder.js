import React, { useState, useEffect, useContext } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Card,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import "./CreateOrder.css";

const CreateOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, quantity } = location.state || {};
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Items", "Select Address", "Confirm Order"];
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [newAddress, setNewAddress] = useState({
    name: "",
    contactNumber: "",
    street: "",
    city: "",
    state: "",
    landmark: "",
    zipcode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (currentStep === 1) {
      fetchAddresses();
    }
  }, [currentStep, token, navigate]);

  const fetchAddresses = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        "https://dev-project-ecommerce.upgrad.dev/api/addresses",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAddresses(response.data || []);
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setError("Failed to load addresses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    const { name, contactNumber, street, city, state, landmark, zipcode } = newAddress;
    if (!name || !contactNumber || !street || !city || !state || !landmark || !zipcode) {
      setError("Please fill out all fields to save the address.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://dev-project-ecommerce.upgrad.dev/api/addresses",
        newAddress,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAddresses([...addresses, response.data]);
      setNewAddress({
        name: "",
        contactNumber: "",
        street: "",
        city: "",
        state: "",
        landmark: "",
        zipcode: "",
      });
      setError("");
    } catch (err) {
      console.error("Error saving address:", err);
      setError("Failed to save the address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      if (currentStep === 1 && !selectedAddress) {
        setError("Please select an address to proceed.");
        return;
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="create-order-page">
      <div className="stepper-container">
        <Stepper activeStep={currentStep}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      <div className="step-content">
        {currentStep === 0 && (
          <div className="item-page">
            <Card className="item-card">
              <div className="item-image-section">
                {product?.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="item-image" />
                ) : (
                  <Typography className="item-no-image-text">
                    Image not available
                  </Typography>
                )}
              </div>
              <div className="item-info-section">
                <Typography variant="h5" className="item-name">
                  <strong>Placed Order:<br /></strong>
                  {product?.name}
                </Typography>
                <Typography variant="subtitle1" className="item-category">
                  Category: <strong>{product?.category}</strong>
                </Typography>
                <Typography variant="body2" className="item-description">
                  {product?.description?.length > 100
                    ? `${product.description.substring(0, 100)}...`
                    : product?.description}
                </Typography>
                <Typography className="item-quantity-ordered">
                  Quantity Ordered: {quantity}
                </Typography>
                <Typography variant="h6" className="item-price">
                  Total Price: ₹{product?.price * quantity}
                </Typography>
              </div>
            </Card>
          </div>
        )}

        {currentStep === 1 && (
          <div className="address-step">
            <Typography variant="h5">Select Address</Typography>
            {loading && <Typography>Loading addresses...</Typography>}
            <FormControl fullWidth style={{ marginBottom: "20px" }}>
              <InputLabel>Select an Address</InputLabel>
              <Select
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
                className="address-dropdown"
              >
                {addresses.map((address) => (
                  <MenuItem key={address.id} value={address.id}>
                    {`${address.name}, ${address.street}, ${address.city}, ${address.state}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="subtitle1" align="center" className="or-separator">
              OR
            </Typography>
            <Typography variant="h6" className="add-address-heading">
              Add Address
            </Typography>
            <form className="add-address-form">
              <TextField
                label="Name"
                fullWidth
                value={newAddress.name}
                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                className="address-input"
              />
              {/* Repeat for other fields */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveAddress}
                disabled={loading}
              >
                Save Address
              </Button>
            </form>
            {error && <Typography color="error">{error}</Typography>}
          </div>
        )}
      </div>

      <div className="navigation-buttons">
        <Button variant="outlined" onClick={previousStep} disabled={currentStep === 0}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={nextStep}>
          {currentStep === steps.length - 1 ? "Confirm" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default CreateOrder;
