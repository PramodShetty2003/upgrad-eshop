import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    manufacturer: "",
    availableItems: "",
    price: "",
    imageUrl: "",
    description: "",
  });

  const [categories, setCategories] = useState([
    { value: "Apparel", label: "Apparel" },
    { value: "Electronics", label: "Electronics" },
    { value: "PersonalCare", label: "Personal Care" },
  ]);

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const validate = () => {
    let tempErrors = {};
    tempErrors.name = formData.name ? "" : "Name is required.";
    tempErrors.category = formData.category ? "" : "Category is required.";
    tempErrors.manufacturer = formData.manufacturer ? "" : "Manufacturer is required.";
    tempErrors.availableItems =
      formData.availableItems && !isNaN(formData.availableItems)
        ? ""
        : "Available Items must be a number.";
    tempErrors.price = formData.price && !isNaN(formData.price) ? "" : "Price must be a number.";
    tempErrors.imageUrl = formData.imageUrl ? "" : "Image URL is required.";
    tempErrors.description = formData.description ? "" : "Description is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const productData = {
        name: formData.name,
        category: formData.category,
        manufacturer: formData.manufacturer,
        availableItems: parseInt(formData.availableItems, 10),
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl,
        description: formData.description,
      };

      try {
        const response = await axios.post(
          "https://dev-project-ecommerce.upgrad.dev/api/products",
          productData
        );
        console.log("Product added successfully:", response.data);

        // Show success Snackbar
        setSnackbar({
          open: true,
          message: `Product "${formData.name}" added successfully!`,
          severity: "success",
        });

        // Clear form
        setFormData({
          name: "",
          category: "",
          manufacturer: "",
          availableItems: "",
          price: "",
          imageUrl: "",
          description: "",
        });

        // Redirect to /products after a short delay
        setTimeout(() => {
          navigate("/products");
        }, 1500);
      } catch (error) {
        console.error("Error adding product:", error);

        // Show error Snackbar
        setSnackbar({
          open: true,
          message: "Failed to add product. Please try again.",
          severity: "error",
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (newValue) => {
    if (newValue.__isNew__) {
      const newCategory = { value: newValue.value, label: newValue.label };
      setCategories([...categories, newCategory]);
      setFormData({ ...formData, category: newCategory.value });
    } else {
      setFormData({ ...formData, category: newValue.value });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Card style={{ maxWidth: 600, margin: "50px auto", padding: "20px" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Add Product
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />

          <CreatableSelect
            options={categories}
            onChange={handleCategoryChange}
            placeholder="Select or create a category"
            value={categories.find((cat) => cat.value === formData.category)}
          />
          {errors.category && (
            <Typography color="error" variant="caption">
              {errors.category}
            </Typography>
          )}

          <TextField
            label="Manufacturer"
            name="manufacturer"
            fullWidth
            margin="normal"
            value={formData.manufacturer}
            onChange={handleInputChange}
            error={!!errors.manufacturer}
            helperText={errors.manufacturer}
          />
          <TextField
            label="Available Items"
            name="availableItems"
            fullWidth
            margin="normal"
            value={formData.availableItems}
            onChange={handleInputChange}
            error={!!errors.availableItems}
            helperText={errors.availableItems}
          />
          <TextField
            label="Price"
            name="price"
            fullWidth
            margin="normal"
            value={formData.price}
            onChange={handleInputChange}
            error={!!errors.price}
            helperText={errors.price}
          />
          <TextField
            label="Image URL"
            name="imageUrl"
            fullWidth
            margin="normal"
            value={formData.imageUrl}
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
            value={formData.description}
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
            Save Product
          </Button>
        </form>
      </CardContent>

      {/* Snackbar for success or error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default AddProduct;
