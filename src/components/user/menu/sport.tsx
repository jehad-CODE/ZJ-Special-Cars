import React, { useState } from 'react';
import { 
  Box, Typography, Grid, Paper, Button, Pagination, Dialog, 
  DialogActions, DialogContent, DialogTitle, IconButton
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Define car interface to fix TypeScript errors
interface Car {
  name: string;
  model: string;
  year: number;
  price: string;
  mileage: string;
  color: string;
  gearType: string;
  type: string;
  details: string;
  sellerEmail: string;
  sellerPhone: string;
  images: string[];
}

// Sample data with multiple images and additional details
const cars: Car[] = [
  { 
    name: 'Ferrari F8', model: 'Tributo', year: 2020, price: '$280,000', 
    mileage: '3,500', color: 'Red', gearType: 'Automatic', type: 'Sport',
    details: 'Ferrari F8 is a high-performance sports car with a turbocharged V8 engine.',
    sellerEmail: 'seller1@example.com', sellerPhone: '+1 (555) 123-4567',
    images: ['/src/assets/ZjUserBackground.jpg', '/src/assets/ZjUserBackground.jpg'] 
  },
  { 
    name: 'Lamborghini Huracan', model: 'EVO', year: 2021, price: '$300,000', 
    mileage: '1,200', color: 'Yellow', gearType: 'Automatic', type: 'Sport',
    details: 'Lamborghini Huracan is a luxury sports car known for its speed and style.',
    sellerEmail: 'seller2@example.com', sellerPhone: '+1 (555) 987-6543',
    images: ['/src/assets/ZjUserBackground.jpg', '/src/assets/ZjUserBackground.jpg'] 
  },
  { 
    name: 'Porsche 911', model: 'Turbo S', year: 2022, price: '$150,000', 
    mileage: '500', color: 'Silver', gearType: 'Manual', type: 'Sport',
    details: 'Porsche 911 offers timeless design with high-end performance.',
    sellerEmail: 'seller3@example.com', sellerPhone: '+1 (555) 456-7890',
    images: ['/src/assets/ZjUserBackground.jpg', '/src/assets/ZjUserBackground.jpg'] 
  },
];

const Sport: React.FC = () => {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [currentCar, setCurrentCar] = useState<Car | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const carsPerPage = 9;
  const startIndex = (page - 1) * carsPerPage;
  const currentCars = cars.slice(startIndex, startIndex + carsPerPage);

  const handleOpenModal = (car: Car) => {
    setCurrentCar(car);
    setCurrentImageIndex(0);
    setOpen(true);
  };

  const handleNextImage = () => {
    if (currentCar && currentImageIndex < currentCar.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentCar && currentImageIndex > 0) {
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
      overflowY: 'auto',  // Enable vertical scrolling
    }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
        Sport Cars
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {currentCars.map((car, index) => (
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
                src={car.images[0]}
                alt={car.name}
                style={{ width: '100%', borderRadius: '8px', height: '180px', objectFit: 'cover' }}
              />
              <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
                {car.name} - {car.model}
              </Typography>
              <Typography variant="h6" sx={{ color: 'gray' }}>
                {car.year} • {car.mileage} km
              </Typography>
              <Typography variant="h6" sx={{ color: 'green', fontWeight: 'bold' }}>
                {car.price}
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2 }} 
                onClick={() => handleOpenModal(car)}
                fullWidth
              >
                <DirectionsCarIcon sx={{ mr: 1 }} />
                View Details
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', pb: 4 }}>
        <Pagination
          count={Math.ceil(cars.length / carsPerPage)}
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
        <DialogTitle>{currentCar?.name} {currentCar?.model}</DialogTitle>
        <DialogContent dividers>
          {currentCar && (
            <>
              {/* Image carousel */}
              <Box sx={{ position: 'relative', mb: 3, textAlign: 'center' }}>
                <img
                  src={currentCar.images[currentImageIndex]}
                  alt={`${currentCar.name}`}
                  style={{ maxWidth: '100%', borderRadius: '8px', maxHeight: '300px' }}
                />
                
                {currentCar.images.length > 1 && (
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
                      disabled={currentImageIndex === currentCar.images.length - 1}
                      sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
                    >
                      <ArrowForwardIosIcon />
                    </IconButton>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {currentImageIndex + 1} / {currentCar.images.length}
                    </Typography>
                  </>
                )}
              </Box>
              
              {/* Car details - simplified two-column layout */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Year:</Typography>
                  <Typography variant="body1">{currentCar.year}</Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Mileage:</Typography>
                  <Typography variant="body1">{currentCar.mileage} km</Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Color:</Typography>
                  <Typography variant="body1">{currentCar.color}</Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Price:</Typography>
                  <Typography variant="body1" sx={{ color: 'green' }}>{currentCar.price}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Gear Type:</Typography>
                  <Typography variant="body1">{currentCar.gearType}</Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Type:</Typography>
                  <Typography variant="body1">{currentCar.type}</Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Contact:</Typography>
                  <Typography variant="body1">{currentCar.sellerEmail}</Typography>
                  <Typography variant="body1">{currentCar.sellerPhone}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Details:</Typography>
                  <Typography variant="body1">{currentCar.details}</Typography>
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

export default Sport;