import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { 
  Box, Typography, Grid, Paper, Button, Pagination, Dialog, 
  DialogActions, DialogContent, DialogTitle, IconButton, CircularProgress
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';

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
const API_URL = 'http://localhost:5000';

const LifeProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  
  const location = useLocation();
  
  // Sort state
  const [sortBy, setSortBy] = useState('newest');

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/life-products`);
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

  // Handle opening selected item from search
  useEffect(() => {
    if (location.state?.selectedItem) {
      const item = location.state.selectedItem;
      const foundItem = products.find(product => product._id === item._id);
      
      if (foundItem) {
        handleOpenModal(foundItem);
        // Clear the state so it doesn't reopen on subsequent visits
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, products]);

  // Helper function to get full image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${API_URL}${normalizedPath}`;
  };

  // Handle image loading error
  const handleImageError = (id: string) => {
    setImageError(prev => ({
      ...prev,
      [id]: true
    }));
  };

  // Sort products based on selection
  const sortProducts = (products: Product[]) => {
    switch(sortBy) {
      case 'priceAsc':
        return [...products].sort((a, b) => 
          Number(a.price.replace(/[^0-9]/g, '')) - Number(b.price.replace(/[^0-9]/g, '')));
      case 'priceDesc':
        return [...products].sort((a, b) => 
          Number(b.price.replace(/[^0-9]/g, '')) - Number(a.price.replace(/[^0-9]/g, '')));
      case 'newest':
      default:
        return [...products].sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      case 'oldest':
        return [...products].sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
    }
  };

  const productsPerPage = 6;
  const sortedProducts = sortProducts(products);
  const startIndex = (page - 1) * productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

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
      minHeight: '100vh',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      
      {/* Sort selector */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mb: 3,
        mt: 2
      }}>
        <Box sx={{ 
          background: 'linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%)',
          borderRadius: '10px', 
          padding: '8px 16px',
          display: 'flex', 
          alignItems: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Typography variant="body1" sx={{ 
            mr: 2, 
            fontWeight: 500,
            color: '#e0e0e0'
          }}>
            Sort by:
          </Typography>
          <Box sx={{
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '5px solid #e0e0e0',
              pointerEvents: 'none'
            }
          }}>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{ 
                background: 'rgba(20,20,30,0.8)',
                color: '#e0e0e0',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '6px',
                padding: '8px 30px 8px 12px',
                fontSize: '15px',
                appearance: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
              }}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="priceAsc">Price (Low to High)</option>
              <option value="priceDesc">Price (High to Low)</option>
            </select>
          </Box>
        </Box>
      </Box>

      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        // Hide scrollbar for Chrome, Safari and Opera
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        // Hide scrollbar for IE, Edge and Firefox
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
      }}>
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
                    '&:hover': { transform: 'scale(1.02)' },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {product.images && product.images.length > 0 && !imageError[product._id] ? (
                      <Box sx={{ 
                        width: '100%', 
                        height: '180px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        <img
                          src={getImageUrl(product.images[0])}
                          alt={product.name}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover' 
                          }}
                          onError={() => handleImageError(product._id)}
                        />
                      </Box>
                    ) : (
                      <Box sx={{ 
                        width: '100%', 
                        height: '180px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#555'
                      }}>
                        <BrokenImageIcon sx={{ fontSize: 60, color: '#999' }} />
                      </Box>
                    )}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'lightgray' }}>
                        {product.brand}
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'green', fontWeight: 'bold' }}>
                        {product.price}
                      </Typography>
                    </Box>
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
                count={Math.ceil(sortedProducts.length / productsPerPage)}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                sx={{ '& .MuiPaginationItem-root': { color: 'white' } }}
              />
              <Typography variant="body2" sx={{ mt: 1, color: 'gray' }}>
                Page {page} of {Math.ceil(sortedProducts.length / productsPerPage)}
              </Typography>
            </Box>
          </>
        )}
      </Box>

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
                {currentProduct.images && currentProduct.images.length > 0 ? (
                  <>
                    <img
                      src={getImageUrl(currentProduct.images[currentImageIndex])}
                      alt={`${currentProduct.name}`}
                      style={{ 
                        width: '100%', 
                        maxHeight: '300px', 
                        objectFit: 'contain',
                        borderRadius: '8px' 
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.style.width = '100%';
                          fallback.style.height = '300px';
                          fallback.style.display = 'flex';
                          fallback.style.alignItems = 'center';
                          fallback.style.justifyContent = 'center';
                          fallback.style.backgroundColor = '#555';
                          fallback.style.borderRadius = '8px';
                          
                          const icon = document.createElement('div');
                          icon.innerHTML = `<svg width="60" height="60" viewBox="0 0 24 24" fill="#999">
                            <path d="M21 5v6.59l-3-3.01-4 4.01-4-4-4 4-3-3.01V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2zm-3 6.42l3 3.01V19c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-6.58l3 2.99 4-4 4 4 4-4z"/>
                          </svg>`;
                          
                          fallback.appendChild(icon);
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                    
                    {currentProduct.images.length > 1 && (
                      <>
                        <IconButton 
                          onClick={handlePrevImage}
                          disabled={currentImageIndex === 0}
                          sx={{ 
                            position: 'absolute', 
                            left: 0, 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                            color: 'white'
                          }}
                        >
                          <ArrowBackIosIcon />
                        </IconButton>
                        <IconButton 
                          onClick={handleNextImage}
                          disabled={currentImageIndex === currentProduct.images.length - 1}
                          sx={{ 
                            position: 'absolute', 
                            right: 0, 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                            color: 'white'
                          }}
                        >
                          <ArrowForwardIosIcon />
                        </IconButton>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {currentImageIndex + 1} / {currentProduct.images.length}
                        </Typography>
                      </>
                    )}
                  </>
                ) : (
                  <Box sx={{ 
                    width: '100%', 
                    height: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#555',
                    borderRadius: '8px'
                  }}>
                    <BrokenImageIcon sx={{ fontSize: 80, color: '#999' }} />
                    <Typography variant="body2" sx={{ mt: 2 }}>No images available</Typography>
                  </Box>
                )}
              </Box>
              
              {/* Product details - two-column layout */}
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
                  
                  {currentProduct.createdAt && (
                    <>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Listed On:</Typography>
                      <Typography variant="body1">
                        {new Date(currentProduct.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}></Typography>
                  <Typography variant="body1" sx={{
                    maxHeight: '150px',
                    overflowY: 'auto'
                  }}>
                    {currentProduct.details}
                  </Typography>
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