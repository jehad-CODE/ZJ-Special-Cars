import React, { useState } from 'react';
import { 
  Box, Typography, Grid, Paper, Button, Pagination, Dialog, 
  DialogActions, DialogContent, DialogTitle, IconButton
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Define car interface for TypeScript
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

// Updated sample data for classic cars
const classicCars: Car[] = [
  { 
    name: '1967 Ford Mustang', 
    model: 'GT Fastback',
    year: 1967, 
    price: '$50,000', 
    mileage: '89,000',
    color: 'Candy Apple Red',
    gearType: 'Manual',
    type: 'Classic',
    details: 'The 1967 Ford Mustang is a classic American muscle car with a V8 engine.',
    sellerEmail: 'classic1@example.com',
    sellerPhone: '+1 (555) 222-3333',
    images: ['/src/assets/ClassicBackground.jpg', '/src/assets/ClassicBackground.jpg']
  },
  { 
    name: 'Chevrolet Camaro', 
    model: 'SS 1969',
    year: 1969, 
    price: '$60,000', 
    mileage: '75,600',
    color: 'Black',
    gearType: 'Manual',
    type: 'Classic',
    details: 'The 1969 Chevrolet Camaro is known for its aggressive styling and powerful engine.',
    sellerEmail: 'classic2@example.com',
    sellerPhone: '+1 (555) 444-5555',
    images: ['/src/assets/ClassicBackground.jpg', '/src/assets/ClassicBackground.jpg', '/src/assets/ClassicBackground.jpg']
  },
  { 
    name: 'Dodge Charger', 
    model: 'R/T 1969',
    year: 1969, 
    price: '$75,000', 
    mileage: '62,000',
    color: 'Midnight Black',
    gearType: 'Manual',
    type: 'Classic',
    details: 'The 1969 Dodge Charger features a powerful HEMI V8 and is an icon of the muscle car era.',
    sellerEmail: 'classic3@example.com',
    sellerPhone: '+1 (555) 666-7777',
    images: ['/src/assets/ClassicBackground.jpg', '/src/assets/ClassicBackground.jpg']
  },
  { 
    name: 'Plymouth Barracuda', 
    model: 'HEMI 1970',
    year: 1970, 
    price: '$80,000', 
    mileage: '55,400',
    color: 'Electric Blue',
    gearType: 'Manual',
    type: 'Classic',
    details: 'The 1970 Plymouth Barracuda is known for its distinctive design and high-performance engines.',
    sellerEmail: 'classic4@example.com',
    sellerPhone: '+1 (555) 888-9999',
    images: ['/src/assets/ClassicBackground.jpg']
  },
  { 
    name: 'Chevrolet Corvette', 
    model: 'Stingray 1967',
    year: 1967, 
    price: '$85,000', 
    mileage: '45,000',
    color: 'Marina Blue',
    gearType: 'Manual',
    type: 'Classic',
    details: 'The 1967 Chevrolet Corvette is a high-performance sports car with timeless style.',
    sellerEmail: 'classic5@example.com',
    sellerPhone: '+1 (555) 111-2222',
    images: ['/src/assets/ClassicBackground.jpg', '/src/assets/ClassicBackground.jpg']
  }
];

const Classic: React.FC = () => {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [currentCar, setCurrentCar] = useState<Car | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const carsPerPage = 9;
  const startIndex = (page - 1) * carsPerPage;
  const currentCars = classicCars.slice(startIndex, startIndex + carsPerPage);

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
      overflowY: 'auto',
    }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
        Classic Cars
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
                {car.year} • {car.mileage} miles
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
          count={Math.ceil(classicCars.length / carsPerPage)}
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
                  <Typography variant="body1">{currentCar.mileage} miles</Typography>
                  
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

export default Classic;