import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Button, Pagination, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

// Sample data for hybrid/electric cars
const hybridCars = [
  { name: 'Tesla S', year: 2022, price: '$80,000', image: '/src/assets/HybridBackground.jpg', details: 'The Tesla Model S is an all-electric luxury sedan that offers exceptional performance and range.' },
  { name: 'Nissan Leaf', year: 2021, price: '$40,000', image: '/src/assets/HybridBackground.jpg', details: 'The Nissan Leaf is a compact all-electric car known for its affordability and eco-friendliness.' },
];

const HybridElectric: React.FC = () => {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [currentCar, setCurrentCar] = useState<any>(null);

  const carsPerPage = 5;
  const startIndex = (page - 1) * carsPerPage;
  const currentCars = hybridCars.slice(startIndex, startIndex + carsPerPage);

  const handleChangePage = (value: number) => {
    setPage(value);
  };

  const handleOpenModal = (car: any) => {
    setCurrentCar(car);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setCurrentCar(null);
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: 'black', backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', height: '100vh', overflowY: 'auto', paddingBottom: '100px' }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
        Hybrid/Electric Cars
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {currentCars.map((car, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={4} sx={{ borderRadius: 3, padding: 2, textAlign: 'center', backgroundColor: '#333' }}>
              <img
                src={car.image}
                alt={car.name}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  height: 'auto',
                }}
              />
              <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
                {car.name}
              </Typography>
              <Typography variant="h6" sx={{ color: 'gray' }}>
                {car.year}
              </Typography>
              <Typography variant="h6" sx={{ color: 'green', fontWeight: 'bold' }}>
                {car.price}
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => handleOpenModal(car)}>
                <DirectionsCarIcon sx={{ mr: 1 }} />
                View Details
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(hybridCars.length / carsPerPage)}
        page={page}
        onChange={(_, value) => handleChangePage(value)}
        color="primary"
        sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}
      />

      {/* Modal for Car Details */}
      <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{currentCar?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center' }}>
            <img
              src={currentCar?.image}
              alt={currentCar?.name}
              style={{
                width: '100%',
                borderRadius: '8px',
                height: 'auto',
              }}
            />
            <Typography variant="h6" sx={{ mt: 2 }}>
              {currentCar?.year}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
              {currentCar?.price}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, color: 'gray' }}>
              {currentCar?.details}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HybridElectric;
