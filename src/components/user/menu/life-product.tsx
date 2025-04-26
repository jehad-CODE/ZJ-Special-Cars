import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Typography, Grid, Paper, Button, Pagination, Dialog, 
  DialogActions, DialogContent, DialogTitle, IconButton, CircularProgress
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

// Define product interface for TypeScript
interface Product {
  _id: string;
  name: string;
  price: string;
  category: string;
  brand: string;
  availability: string;
  details: string;
  sellerContact: string;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
}

// API base URL
const API_URL = 'http://localhost:5000/api';

const LifeProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/life-products`);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const productsPerPage = 6;
  const startIndex = (page - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

  const handleOpenModal = (product: Product) => {
    setCurrentProduct(product);
    setCurrentImageIndex(0);
    setOpen(true);
  };

  const handleNextImage = () => {
    if (currentProduct && currentImageIndex < currentProduct.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentProduct && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <Box sx={{
      padding: { xs: 2, sm: 3, md: 4 },
      backgroundColor: 'black',
      backgroundSize: 'cover',
      color: 'white',
      height: '100vh',
      overflowY: 'auto',
    }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
        Life Products
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6" color="error">{error}</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }} 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Box>
      ) : products.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6">No products found</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {currentProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Paper elevation={4} sx={{ 
                  borderRadius: 3, 
                  padding: 2, 
                  textAlign: 'center', 
                  backgroundColor: '#333',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.02)' }
                }}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    style={{ width: '100%', borderRadius: '8px', height: '180px', objectFit: 'cover' }}
                  />
                  <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'lightgray' }}>
                    {product.brand}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'green', fontWeight: 'bold' }}>
                    {product.price}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 2 }} 
                    onClick={() => handleOpenModal(product)}
                    fullWidth
                  >
                    <ShoppingBagIcon sx={{ mr: 1 }} />
                    View Details
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', pb: 4, flexDirection: 'column', alignItems: 'center' }}>
            <Pagination
              count={Math.ceil(products.length / productsPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              sx={{ '& .MuiPaginationItem-root': { color: 'white' } }}
            />
            <Typography variant="body2" sx={{ mt: 1, color: 'gray' }}>
              Page {page} of {Math.ceil(products.length / productsPerPage)}
            </Typography>
          </Box>
        </>
      )}

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, backgroundColor: '#1c1c1c', color: 'white' } }}
      >
        <DialogTitle>{currentProduct?.name}</DialogTitle>
        <DialogContent dividers>
          {currentProduct && (
            <>
              {/* Image carousel */}
              <Box sx={{ position: 'relative', mb: 3, textAlign: 'center' }}>
                <img
                  src={currentProduct.images[currentImageIndex]}
                  alt={`${currentProduct.name}`}
                  style={{ maxWidth: '100%', borderRadius: '8px', maxHeight: '300px' }}
                />
                
                {currentProduct.images.length > 1 && (
                  <>
                    <IconButton 
                      onClick={handlePrevImage}
                      disabled={currentImageIndex === 0}
                      sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}
                    >
                      <ArrowBackIosIcon />
                    </IconButton>
                    <IconButton 
                      onClick={handleNextImage}
                      disabled={currentImageIndex === currentProduct.images.length - 1}
                      sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
                    >
                      <ArrowForwardIosIcon />
                    </IconButton>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {currentImageIndex + 1} / {currentProduct.images.length}
                    </Typography>
                  </>
                )}
              </Box>
              
              {/* Product details - simplified two-column layout */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Price:</Typography>
                  <Typography variant="body1" sx={{ color: 'green' }}>{currentProduct.price}</Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Brand:</Typography>
                  <Typography variant="body1">{currentProduct.brand}</Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Category:</Typography>
                  <Typography variant="body1">{currentProduct.category}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Availability:</Typography>
                  <Typography variant="body1">{currentProduct.availability}</Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Seller Contact:</Typography>
                  <Typography variant="body1">{currentProduct.sellerContact}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Details:</Typography>
                  <Typography variant="body1">{currentProduct.details}</Typography>
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary" variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LifeProduct;