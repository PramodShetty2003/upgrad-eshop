import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `https://dev-project-ecommerce.upgrad.dev/api/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to fetch product details. Please try again later.");
      }
    };

    fetchProductDetails();
  }, [id]);

  const handlePlaceOrder = () => {
    if (quantity < 1) {
      setError("Quantity must be at least 1.");
      return;
    }
    navigate("/create-order", { state: { product, quantity } });
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!product) {
    return <Typography>Loading product details...</Typography>;
  }

  return (
    <div className="product-details-page">
      <Card className="product-details-card">
        <div className="product-details-image-section">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-details-image"
            />
          ) : (
            <Typography className="product-details-no-image-text">
              Image not available
            </Typography>
          )}
        </div>
        <div className="product-details-info-section">
          <div className="product-details-name-container">
            <Typography variant="h5" className="product-details-name">
              {product.name}
            </Typography>
            <Typography className="product-details-availability-tag">
              Available: {product.availableItems}
            </Typography>
          </div>
          <Typography variant="subtitle1" className="product-details-category">
            Category:<strong>{product.category}</strong>
          </Typography>
          <Typography
            variant="body2"
            className="product-details-description-short"
          >
            {product.description.length > 100
              ? `${product.description.substring(0, 100)}...`
              : product.description}
          </Typography>
          <Typography variant="h6" className="product-details-price">
            ₹{product.price}
          </Typography>
          <TextField
            label="Enter Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="product-details-quantity-input"
            InputProps={{
              inputProps: { min: 1, max: product.availableItems },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handlePlaceOrder}
            className="product-details-place-order-button"
          >
            Place Order
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetails;
