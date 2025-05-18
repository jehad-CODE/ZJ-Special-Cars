import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { 
  Box, Typography, Grid, Paper, Button, Pagination, Dialog, 
  DialogActions, DialogContent, DialogTitle, IconButton
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';

// Define car interface
interface Car {
  _id: string;
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
  status: string;
  createdAt: string;
}

// API base URL
const API_BASE_URL = 'http://localhost:5000';

const Sport: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]); 
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [currentCar, setCurrentCar] = useState<Car | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  
  const location = useLocation();

  const carsPerPage = 9;
  const sportCars = cars.filter(car => car.type === 'Sport');
  const startIndex = (page - 1) * carsPerPage;

  // Fetch car data from the backend API
  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/api/cars`)
      .then(response => {
        setCars(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching car data:', error);
        setLoading(false);
      });
  }, []);

  // Handle opening selected item from search
  useEffect(() => {
    if (location.state?.selectedItem) {
      const item = location.state.selectedItem;
      const foundItem = cars.find(car => car._id === item._id);
      
      if (foundItem) {
        handleOpenModal(foundItem);
        // Clear the state so it doesn't reopen on subsequent visits
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, cars]);

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

  // Helper function to get full image URL
  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${API_BASE_URL}${normalizedPath}`;
  };

  // Helper function to format price with $ sign
  const formatPrice = (price: string) => {
    // Check if price already has a $ sign
    if (price.includes('$')) {
      return price;
    }
    return `$${price}`;
  };

  // Handle image loading error
  const handleImageError = (id: string) => {
    setImageError(prev => ({
      ...prev,
      [id]: true
    }));
  };

  const [sortBy, setSortBy] = useState('newest');
  
  const sortCars = (cars: Car[]) => {
    switch(sortBy) {
      case 'priceAsc':
        return [...cars].sort((a, b) => 
          Number(a.price.replace(/[^0-9]/g, '')) - Number(b.price.replace(/[^0-9]/g, '')));
      case 'priceDesc':
        return [...cars].sort((a, b) => 
          Number(b.price.replace(/[^0-9]/g, '')) - Number(a.price.replace(/[^0-9]/g, '')));
      case 'yearDesc':
        return [...cars].sort((a, b) => b.year - a.year);
      case 'yearAsc':
        return [...cars].sort((a, b) => a.year - b.year);
      case 'newest':
      default:
        return cars;
    }
  };
  
  const sortedSportCars = sortCars(sportCars);
  const currentCars = sortedSportCars.slice(startIndex, startIndex + carsPerPage);
  
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
              <option value="priceAsc">Price (Low to High)</option>
              <option value="priceDesc">Price (High to Low)</option>
              <option value="yearDesc">Year (Newest)</option>
              <option value="yearAsc">Year (Oldest)</option>
            </select>
          </Box>
        </Box>
      </Box>

      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
      }}>
        {loading ? (
          <Typography variant="h6" sx={{ textAlign: 'center' }}>Loading cars...</Typography>
        ) : sportCars.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center' }}>No sport cars available at the moment.</Typography>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {currentCars.map((car) => (
                <Grid item xs={12} sm={6} md={4} key={car._id}>
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
                    {car.images && car.images.length > 0 && !imageError[car._id] ? (
                      <Box sx={{ 
                        width: '100%', 
                        height: '180px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        <img
                          src={getImageUrl(car.images[0])}
                          alt={`${car.name} ${car.model}`}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover' 
                          }}
                          onError={() => handleImageError(car._id)}
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
                        {car.name} - {car.model}
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'gray' }}>
                        {car.year} • {car.mileage} km
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'green', fontWeight: 'bold' }}>
                        {formatPrice(car.price)}
                      </Typography>
                    </Box>
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
                count={Math.ceil(sportCars.length / carsPerPage)}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                sx={{ '& .MuiPaginationItem-root': { color: 'white' } }}
              />
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
        {currentCar && (
          <>
            <DialogTitle>{currentCar.name} {currentCar.model}</DialogTitle>
            <DialogContent dividers>
              {/* Image carousel */}
              <Box sx={{ position: 'relative', mb: 3, textAlign: 'center' }}>
                {currentCar.images && currentCar.images.length > 0 ? (
                  <>
                    <img
                      src={getImageUrl(currentCar.images[currentImageIndex])}
                      alt={`${currentCar.name} ${currentCar.model}`}
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
                    
                    {currentCar.images.length > 1 && (
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
                          disabled={currentImageIndex === currentCar.images.length - 1}
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
                          {currentImageIndex + 1} / {currentCar.images.length}
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
              
              {/* Car details - two-column layout */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Year:</Typography>
                  <Typography variant="body1">{currentCar.year}</Typography>

                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Price:</Typography>
                  <Typography variant="body1" sx={{ color: 'green', fontWeight: 'bold' }}>
                    {formatPrice(currentCar.price)}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Mileage:</Typography>
                  <Typography variant="body1">{currentCar.mileage}</Typography>

                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Color:</Typography>
                  <Typography variant="body1">{currentCar.color}</Typography>

                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Gear Type:</Typography>
                  <Typography variant="body1">{currentCar.gearType}</Typography>

                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Type:</Typography>
                  <Typography variant="body1">{currentCar.type}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Seller Email:</Typography>
                  <Typography variant="body1">{currentCar.sellerEmail}</Typography>

                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Seller Phone:</Typography>
                  <Typography variant="body1">{currentCar.sellerPhone}</Typography>

                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Details:</Typography>
                  <Typography variant="body1" sx={{ 
                    maxHeight: '150px',
                    overflowY: 'auto'
                  }}>
                    {currentCar.details}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Listed On:</Typography>
                  <Typography variant="body1">
                    {new Date(currentCar.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)} color="primary" variant="contained">Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Sport;