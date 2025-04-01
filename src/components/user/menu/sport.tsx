import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Button, Pagination, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

// Sample data for cars (added more cars to test scroll)
const cars = [
  { name: 'Ferrari F8', year: 2020, price: '$280,000', image: '/src/assets/ZjUserBackground.jpg', details: 'Ferrari F8 is a high-performance sports car with a turbocharged V8 engine.' },
  { name: 'Lamborghini Huracan', year: 2021, price: '$300,000', image: '/src/assets/ZjUserBackground.jpg', details: 'Lamborghini Huracan is a luxury sports car known for its speed and style.' },
  { name: 'Porsche 911', year: 2022, price: '$150,000', image: '/src/assets/ZjUserBackground.jpg', details: 'Porsche 911 offers timeless design with high-end performance.' },
  { name: 'Aston Martin DB11', year: 2021, price: '$200,000', image: '/src/assets/ZjUserBackground.jpg', details: 'Aston Martin DB11 offers a luxurious ride with an elegant design and powerful engine.' },
  { name: 'McLaren 720S', year: 2020, price: '$280,000', image: '/src/assets/ZjUserBackground.jpg', details: 'McLaren 720S is known for its speed and agility, powered by a twin-turbo V8 engine.' },
  { name: 'Bugatti Chiron', year: 2022, price: '$3,000,000', image: '/src/assets/ZjUserBackground.jpg', details: 'Bugatti Chiron is one of the fastest cars in the world, with an 8.0L quad-turbocharged W16 engine.' },
  { name: 'BMW M8', year: 2020, price: '$120,000', image: '/src/assets/ZjUserBackground.jpg', details: 'BMW M8 combines performance and luxury in a stylish coupe.' },
  { name: 'Mercedes AMG GT', year: 2021, price: '$150,000', image: '/src/assets/ZjUserBackground.jpg', details: 'Mercedes AMG GT delivers an exhilarating driving experience with a handcrafted V8 engine.' },
  { name: 'Audi R8', year: 2021, price: '$170,000', image: '/src/assets/ZjUserBackground.jpg', details: 'Audi R8 offers incredible speed and precision handling with its naturally aspirated V10.' },
  { name: 'Jaguar F-Type', year: 2022, price: '$110,000', image: '/src/assets/ZjUserBackground.jpg', details: 'Jaguar F-Type is a luxury sports car with a sleek design and exhilarating performance.' },
  { name: 'Chevrolet Corvette', year: 2021, price: '$100,000', image: '/src/assets/ZjUserBackground.jpg', details: 'Chevrolet Corvette is an American icon known for its powerful V8 engine and agile handling.' },
  { name: 'Nissan GT-R', year: 2021, price: '$115,000', image: '/src/assets/ZjUserBackground.jpg', details: 'Nissan GT-R is a high-performance sports car with a twin-turbo V6 engine.' },
];

const Sport: React.FC = () => {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [currentCar, setCurrentCar] = useState<any>(null);

  const carsPerPage = 10; // Number of cars per page
  const startIndex = (page - 1) * carsPerPage;
  const currentCars = cars.slice(startIndex, startIndex + carsPerPage);

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
    <Box
      sx={{
        padding: 4,
        backgroundColor: 'black',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        height: '100vh',
        overflowY: 'auto',
        paddingBottom: '100px',
      }}
    >
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
        Sport Cars
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {currentCars.map((car, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={4} sx={{ borderRadius: 3, padding: 2, textAlign: 'center', backgroundColor: '#333' }}>
              <img
                src={car.image}
                alt={car.name}
                style={{ width: '100%', borderRadius: '8px', height: 'auto' }}
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
        count={Math.ceil(cars.length / carsPerPage)}
        page={page}
        onChange={(_, value) => handleChangePage(value)} // Use value instead of event
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
              style={{ width: '100%', borderRadius: '8px', height: 'auto' }}
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

export default Sport;
