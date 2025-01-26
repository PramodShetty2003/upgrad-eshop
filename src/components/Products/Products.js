// Products.js
import React, { useState, useEffect, useContext } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext"; // Import AuthContext
import "./Products.css";

const Products = () => {
  const [alignment, setAlignment] = useState("All");
  const [categories, setCategories] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const { searchQuery ,user } = useContext(AuthContext); // Use searchQuery from AuthContext
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => {},
  });

  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: "",
    severity: "info",
  });

  const navigate = useNavigate(); // Hook to navigate between pages

  const handleProductClick = (id) => {
    navigate(`/product-details/${id}`); // Navigate to Product Details Page with product ID
  };

  const handleEdit = (id) => {
    navigate(`/modify-product/${id}`); // Navigate to ModifyProduct with the product id
  };

  const handleChange = (event, newAlignment) => {
    if (newAlignment) setAlignment(newAlignment);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const sortProducts = (products) => {
    switch (sortBy) {
      case "priceHighToLow":
        return [...products].sort((a, b) => b.price - a.price);
      case "priceLowToHigh":
        return [...products].sort((a, b) => a.price - b.price);
      case "newest":
        return [...products].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      default:
        return products;
    }
  };

  const filterBySearch = (query, products) => {
    return query
      ? products.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        )
      : products;
  };

  const handleDelete = (id, name) => {
    setConfirmDialog({
      isOpen: true,
      title: "Confirm deletion of product!",
      subTitle: `Are you sure you want to delete the product "${name}"?`,
      onConfirm: () => confirmDelete(id, name),
    });
  };

  const confirmDelete = async (id, name) => {
    try {
      // Call API to delete the product
      await axios.delete(
        `https://dev-project-ecommerce.upgrad.dev/api/products/${id}`
      );

      // Update the UI after deletion
      const updatedProducts = allProducts.filter(
        (product) => product.id !== id
      );
      setAllProducts(updatedProducts);
      setFilteredProducts(updatedProducts);

      // Close the dialog
      setConfirmDialog({ isOpen: false });

      // Show success snackbar
      setSnackbar({
        isOpen: true,
        message: `Product "${name}" deleted successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting product:", error);

      // Show error snackbar
      setSnackbar({
        isOpen: true,
        message: "Failed to delete the product. Please try again later.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://dev-project-ecommerce.upgrad.dev/api/products/categories"
        );
        const data = response.data;

        const normalizedData = data.map((category) => category.toLowerCase());
        const groupedCategories = {
          Apparel: normalizedData.filter((category) =>
            ["watches", "shoes", "pants", "clothes", "Apparel"].includes(
              category
            )
          ),
          Electronics: normalizedData.filter((category) =>
            ["electronics", "cooking", "Electronics"].includes(category)
          ),
          PersonalCare: normalizedData.filter((category) =>
            ["perfumes", "fitness", "PersonalCare"].includes(category)
          ),
        };

        setCategories(groupedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(
          "https://dev-project-ecommerce.upgrad.dev/api/products/"
        );
        if (response && response.data) {
          setAllProducts(response.data);
          setFilteredProducts(response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        alert("Failed to fetch products. Please try again later.");
      }
    };

    fetchCategories();
    fetchAllProducts();
  }, []);

  useEffect(() => {
    let products = [...allProducts];

    // Filter by category alignment
    if (alignment !== "All") {
      const selectedCategories = categories[alignment] || [];
      products = products.filter((product) =>
        selectedCategories.includes(product.category.toLowerCase())
      );
    }

    // Filter by search query
    products = filterBySearch(searchQuery, products);

    // Sort products
    setFilteredProducts(sortProducts(products));
  }, [alignment, sortBy, allProducts, categories, searchQuery]);

  return (
    <div className="products-page">
      {/* Category Toggle */}
      <div className="category-bar">
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Product Categories"
        >
          <ToggleButton value="All">All</ToggleButton>
          {Object.keys(categories).map((group) => (
            <ToggleButton key={group} value={group}>
              {group}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>

      {/* Sorting Options */}
      <div className="sorting-options">
        <div className="sort-by-text">Sort By:</div>
        <FormControl
          margin="normal"
          className="sort-select-container"
          size="small"
        >
          <Select
            id="sort-select"
            value={sortBy}
            onChange={handleSortChange}
            displayEmpty
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="priceHighToLow">Price: High to Low</MenuItem>
            <MenuItem value="priceLowToHigh">Price: Low to High</MenuItem>
            <MenuItem value="newest">Newest</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Product Display */}
      <div className="category-content">
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="product-card">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-info">
                  <Typography className="product-name" variant="body1">
                    {product.name}
                  </Typography>
                  <Typography className="product-price" variant="body1">
                    ₹{product.price}
                  </Typography>
                </div>
                <Typography
                  className="product-description"
                  variant="body2"
                  color="textSecondary"
                >
                  {product.description.length > 100
                    ? product.description.slice(0, 100) + "..."
                    : product.description}
                </Typography>
                <div className="product-actions">
                  <Button
                    variant="contained"
                    color="primary"
                    className="buy-button"
                    onClick={() => handleProductClick(product.id)}
                  >
                    Buy
                  </Button>
                  <div className="modify-delete-buttons">
                    {/* Only show the buttons if the user has "admin" role */}
                    {user?.roles &&
                      Array.isArray(user.roles) &&
                      user.roles.some(
                        (role) => role.toLowerCase() === "admin"
                      ) && (
                        <>
                          <IconButton
                            aria-label="edit"
                            color="primary"
                            onClick={() => handleEdit(product.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            color="secondary"
                            onClick={() =>
                              handleDelete(product.id, product.name)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Typography variant="h6" color="textSecondary">
            No products found.
          </Typography>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <Dialog
          open={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ isOpen: false })}
        >
          <DialogTitle>{confirmDialog.title}</DialogTitle>
          <DialogContent>
            <Typography>{confirmDialog.subTitle}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setConfirmDialog({ isOpen: false })}
              color="primary"
            >
              Cancel
            </Button>
            <Button onClick={confirmDialog.onConfirm} color="secondary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Snackbar for Delete Confirmation */}
      {snackbar.isOpen && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          open={snackbar.isOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ isOpen: false })}
          message={snackbar.message}
          severity={snackbar.severity}
        />
      )}
    </div>
  );
};

export default Products;
