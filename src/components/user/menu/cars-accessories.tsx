import React, { useState } from 'react';
import { 
  Box, Typography, Grid, Paper, Button, Pagination, Dialog, 
  DialogActions, DialogContent, DialogTitle, IconButton
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import BuildIcon from '@mui/icons-material/Build';

// Define accessory interface for TypeScript
interface Accessory {
  name: string;
  price: string;
  category: string;
  brand: string;
  compatibility: string;
  installation: string;
  details: string;
  sellerContact: string;
  images: string[];
}

// Updated sample data with multiple images and additional details
const accessories: Accessory[] = [
  { 
    name: 'Leather Steering Wheel', 
    price: '$120', 
    category: 'Interior',
    brand: 'AutoGrip',
    compatibility: 'Universal',
    installation: 'Professional Installation Recommended',
    details: 'High-quality leather steering wheel for better grip. Features anti-slip surface and ergonomic design for comfortable driving.',
    sellerContact: 'autogrip@example.com',
    images: ['/src/assets/wheel.jpg', '/src/assets/wheel.jpg'] 
  },
  { 
    name: 'All-Weather Car Mats', 
    price: '$50', 
    category: 'Interior',
    brand: 'FloorGuard',
    compatibility: 'Most Models',
    installation: 'DIY Installation',
    details: 'Durable car mats that protect your car interior from dirt and weather. Made from high-quality rubber with anti-slip backing.',
    sellerContact: 'floorguard@example.com',
    images: ['/src/assets/watch.jpg', '/src/assets/wheel.jpg'] 
  },
  { 
    name: 'Seat Covers', 
    price: '$75', 
    category: 'Interior',
    brand: 'ComfortRide',
    compatibility: 'Universal',
    installation: 'DIY Installation',
    details: 'Protect your car seats with stylish and durable covers. Made from premium materials for comfort and longevity.',
    sellerContact: 'comfortride@example.com',
    images: ['/src/assets/wheel.jpg', '/src/assets/wheel.jpg'] 
  },
  { 
    name: 'Sunshade', 
    price: '$20', 
    category: 'Interior',
    brand: 'SunBlock',
    compatibility: 'Universal',
    installation: 'DIY Installation',
    details: 'Sunshade for protecting your cars interior from sunlight. Foldable design for easy storage when not in use.',
    sellerContact: 'sunblock@example.com',
    images: ['/src/assets/wheel.jpg', '/src/assets/wheel.jpg'] 
  },
  { 
    name: 'LED Headlights', 
    price: '$200', 
    category: 'Exterior',
    brand: 'BrightDrive',
    compatibility: 'Check Vehicle Compatibility',
    installation: 'Professional Installation Recommended',
    details: 'Upgrade your car with high-performance LED headlights. Provides better visibility and modern look.',
    sellerContact: 'brightdrive@example.com',
    images: ['/src/assets/wheel.jpg', '/src/assets/wheel.jpg'] 
  },
  { 
    name: 'GPS Navigation System', 
    price: '$150', 
    category: 'Electronics',
    brand: 'RoadGuide',
    compatibility: 'Universal',
    installation: 'DIY or Professional Installation',
    details: 'Stay on track with this GPS navigation system. Features real-time traffic updates and voice guidance.',
    sellerContact: 'roadguide@example.com',
    images: ['/src/assets/wheel.jpg', '/src/assets/wheel.jpg'] 
  }
];

const CarsAccessories: React.FC = () => {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [currentAccessory, setCurrentAccessory] = useState<Accessory | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const accessoriesPerPage = 6;
  const startIndex = (page - 1) * accessoriesPerPage;
  const currentAccessories = accessories.slice(startIndex, startIndex + accessoriesPerPage);

  const handleOpenModal = (accessory: Accessory) => {
    setCurrentAccessory(accessory);
    setCurrentImageIndex(0);
    setOpen(true);
  };

  const handleNextImage = () => {
    if (currentAccessory && currentImageIndex < currentAccessory.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentAccessory && currentImageIndex > 0) {
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
        Cars Accessories
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {currentAccessories.map((accessory, index) => (
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
                src={accessory.images[0]}
                alt={accessory.name}
                style={{ width: '100%', borderRadius: '8px', height: '180px', objectFit: 'cover' }}
              />
              <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
                {accessory.name}
              </Typography>
              <Typography variant="body1" sx={{ color: 'lightgray' }}>
                {accessory.brand}
              </Typography>
              <Typography variant="h6" sx={{ color: 'green', fontWeight: 'bold' }}>
                {accessory.price}
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2 }} 
                onClick={() => handleOpenModal(accessory)}
                fullWidth
              >
                <BuildIcon sx={{ mr: 1 }} />
                View Details
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', pb: 4 }}>
        <Pagination
          count={Math.ceil(accessories.length / accessoriesPerPage)}
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
        <DialogTitle>{currentAccessory?.name}</DialogTitle>
        <DialogContent dividers>
          {currentAccessory && (
            <>
              {/* Image carousel */}
              <Box sx={{ position: 'relative', mb: 3, textAlign: 'center' }}>
                <img
                  src={currentAccessory.images[currentImageIndex]}
                  alt={`${currentAccessory.name}`}
                  style={{ maxWidth: '100%', borderRadius: '8px', maxHeight: '300px' }}
                />
                
                {currentAccessory.images.length > 1 && (
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
                      disabled={currentImageIndex === currentAccessory.images.length - 1}
                      sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
                    >
                      <ArrowForwardIosIcon />
                    </IconButton>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {currentImageIndex + 1} / {currentAccessory.images.length}
                    </Typography>
                  </>
                )}
              </Box>
              
              {/* Accessory details - simplified two-column layout */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Price:</Typography>
                  <Typography variant="body1" sx={{ color: 'green' }}>{currentAccessory.price}</Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Brand:</Typography>
                  <Typography variant="body1">{currentAccessory.brand}</Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Category:</Typography>
                  <Typography variant="body1">{currentAccessory.category}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Compatibility:</Typography>
                  <Typography variant="body1">{currentAccessory.compatibility}</Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Installation:</Typography>
                  <Typography variant="body1">{currentAccessory.installation}</Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Seller Contact:</Typography>
                  <Typography variant="body1">{currentAccessory.sellerContact}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Details:</Typography>
                  <Typography variant="body1">{currentAccessory.details}</Typography>
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

export default CarsAccessories;