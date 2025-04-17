import React, { useState } from 'react';
import { 
  Box, Typography, Grid, Paper, Button, Pagination, Dialog, 
  DialogActions, DialogContent, DialogTitle, IconButton
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

// Define product interface for TypeScript
interface Product {
  name: string;
  price: string;
  category: string;
  brand: string;
  availability: string;
  details: string;
  sellerContact: string;
  images: string[];
}

// Updated sample data with multiple images and additional details
const products: Product[] = [
  { 
    name: 'Car-Themed Mug', 
    price: '$15', 
    category: 'Drinkware',
    brand: 'AutoStyle',
    availability: 'In Stock',
    details: 'A mug with a car theme design, perfect for car enthusiasts. Made from high-quality ceramic with a comfortable handle.',
    sellerContact: 'store@example.com',
    images: ['/src/assets/watch.jpg', '/src/assets/watch.jpg'] 
  },
  { 
    name: 'Driving Gloves', 
    price: '$30', 
    category: 'Apparel',
    brand: 'DriveFit',
    availability: 'In Stock',
    details: 'Stylish and comfortable driving gloves made from genuine leather. Provides excellent grip and comfort for long drives.',
    sellerContact: 'apparel@example.com',
    images: ['/src/assets/watch.jpg', '/src/assets/watch.jpg'] 
  },
  { 
    name: 'Racing Jacket', 
    price: '$120', 
    category: 'Apparel',
    brand: 'SpeedWear',
    availability: 'Limited Stock',
    details: 'A high-quality racing jacket for car enthusiasts. Features multiple pockets and weather-resistant material.',
    sellerContact: 'speedwear@example.com',
    images: ['/src/assets/watch.jpg', '/src/assets/watch.jpg'] 
  },
  { 
    name: 'Watch', 
    price: '$50', 
    category: 'Accessories',
    brand: 'DriveTime',
    availability: 'In Stock',
    details: 'A watch designed for driving enthusiasts with speedometer-inspired dial and leather strap.',
    sellerContact: 'watches@example.com',
    images: ['/src/assets/watch.jpg', '/src/assets/watch.jpg'] 
  },
  { 
    name: 'Car-Themed T-Shirt', 
    price: '$25', 
    category: 'Apparel',
    brand: 'AutoStyle',
    availability: 'In Stock',
    details: 'A stylish T-shirt with a car logo. Made from 100% cotton for comfort and durability.',
    sellerContact: 'apparel@example.com',
    images: ['/src/assets/watch.jpg', '/src/assets/watch.jpg'] 
  },
  { 
    name: 'Driving Shoes', 
    price: '$80', 
    category: 'Footwear',
    brand: 'RacePace',
    availability: 'In Stock',
    details: 'High-performance shoes for driving. Features thin soles for better pedal feel and comfort.',
    sellerContact: 'footwear@example.com',
    images: ['/src/assets/watch.jpg', '/src/assets/watch.jpg'] 
  }
];

const LifeProduct: React.FC = () => {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {currentProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
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

      <Box sx={{ display: 'flex', justifyContent: 'center', pb: 4 }}>
        <Pagination
          count={Math.ceil(products.length / productsPerPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          sx={{ '& .MuiPaginationItem-root': { color: 'white' } }}
        />
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