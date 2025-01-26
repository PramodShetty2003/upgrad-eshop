import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import "./ModifyProduct.css"; // Import the CSS file

const ModifyProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [errors, setErrors] = useState({});
  const [snackOpen, setSnackOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://dev-project-ecommerce.upgrad.dev/api/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const validate = () => {
    const tempErrors = {};
    tempErrors.name = product.name ? "" : "Name is required.";
    tempErrors.category = product.category ? "" : "Category is required.";
    tempErrors.manufacturer = product.manufacturer ? "" : "Manufacturer is required.";
    tempErrors.availableItems =
      product.availableItems && !isNaN(product.availableItems)
        ? ""
        : "Available Items must be a number.";
    tempErrors.price = product.price && !isNaN(product.price) ? "" : "Price must be a number.";
    tempErrors.imageUrl = product.imageUrl ? "" : "Image URL is required.";
    tempErrors.description = product.description ? "" : "Description is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      try {
        await axios.put(
          `https://dev-project-ecommerce.upgrad.dev/api/products/${id}`,
          product
        );
        setSnackOpen(true);
        setTimeout(() => {
          navigate("/products");
        }, 3000);
      } catch (error) {
        console.error("Error updating product:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSnackbarClose = () => {
    setSnackOpen(false);
  };

  if (!product) {
    return <div>Loading product...</div>;
  }

  return (
    <Card className="modify-product-card">
      <CardContent>
        <Typography variant="h5" gutterBottom className="title">
          Modify Product
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            value={product.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Category"
            name="category"
            fullWidth
            margin="normal"
            value={product.category}
            onChange={handleInputChange}
            error={!!errors.category}
            helperText={errors.category}
          />
          <TextField
            label="Manufacturer"
            name="manufacturer"
            fullWidth
            margin="normal"
            value={product.manufacturer}
            onChange={handleInputChange}
            error={!!errors.manufacturer}
            helperText={errors.manufacturer}
          />
          <TextField
            label="Available Items"
            name="availableItems"
            fullWidth
            margin="normal"
            value={product.availableItems}
            onChange={handleInputChange}
            error={!!errors.availableItems}
            helperText={errors.availableItems}
          />
          <TextField
            label="Price"
            name="price"
            fullWidth
            margin="normal"
            value={product.price}
            onChange={handleInputChange}
            error={!!errors.price}
            helperText={errors.price}
          />
          <TextField
            label="Image URL"
            name="imageUrl"
            fullWidth
            margin="normal"
            value={product.imageUrl}
            onChange={handleInputChange}
            error={!!errors.imageUrl}
            helperText={errors.imageUrl}
          />
          <TextField
            label="Product Description"
            name="description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={product.description}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: 20 }}
          >
            Update Product
          </Button>
        </form>
      </CardContent>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {product.name} modified successfully!
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default ModifyProduct;
