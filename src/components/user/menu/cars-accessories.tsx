import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Button, Pagination, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const CarsAccessories: React.FC = () => {
  const accessories = [
    { name: 'Leather Steering Wheel', price: '$120', image: '/src/assets/wheel.jpg', details: 'High-quality leather steering wheel for better grip.' },
    { name: 'All-Weather Car Mats', price: '$50', image: '/src/assets/watch.jpg', details: 'Durable car mats that protect your car interior from dirt and weather.' },
    { name: 'Seat Covers', price: '$75', image: '/src/assets/wheel.jpg', details: 'Protect your car seats with stylish and durable covers.' },
    { name: 'Sunshade', price: '$20', image: '/src/assets/wheel.jpg', details: 'Sunshade for protecting your car’s interior from sunlight.' },
    { name: 'Car Vacuum Cleaner', price: '$60', image: 'https://example.com/vacuum.jpg', details: 'Portable vacuum cleaner for quick car interior cleaning.' },
    { name: 'Car Air Freshener', price: '$10', image: 'https://example.com/air-freshener.jpg', details: 'Keep your car smelling fresh with this air freshener.' },
    { name: 'LED Headlights', price: '$200', image: 'https://example.com/led-headlights.jpg', details: 'Upgrade your car with high-performance LED headlights.' },
    { name: 'GPS Navigation System', price: '$150', image: 'https://example.com/gps.jpg', details: 'Stay on track with this GPS navigation system.' },
    { name: 'Backup Camera', price: '$100', image: 'https://example.com/backup-camera.jpg', details: 'Ensure safe parking with a backup camera.' },
    { name: 'Car Stereo System', price: '$180', image: 'https://example.com/stereo.jpg', details: 'Enjoy high-quality sound with this car stereo system.' },
  ];

  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [currentAccessory, setCurrentAccessory] = useState<any>(null);

  const accessoriesPerPage = 6; // Number of accessories per page
  const startIndex = (page - 1) * accessoriesPerPage;
  const currentAccessories = accessories.slice(startIndex, startIndex + accessoriesPerPage);

  const handleChangePage = (value: number) => {
    setPage(value);
  };

  const handleOpenModal = (accessory: any) => {
    setCurrentAccessory(accessory);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setCurrentAccessory(null);
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: 'black', color: 'white', height: '100vh', overflowY: 'auto', paddingBottom: '100px' }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>Cars Accessories</Typography>

      <Grid container spacing={3} justifyContent="center">
        {currentAccessories.map((accessory, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={4} sx={{ borderRadius: 3, padding: 2, textAlign: 'center', backgroundColor: '#333' }}>
              <img
                src={accessory.image}
                alt={accessory.name}
                style={{
                  width: '100%',
                  height: '200px',  // Fixed height
                  objectFit: 'cover',  // Ensures the image fits within the box without distortion
                  borderRadius: '8px',
                }}
              />
              <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>{accessory.name}</Typography>
              <Typography variant="h6" sx={{ color: 'green', fontWeight: 'bold' }}>{accessory.price}</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => handleOpenModal(accessory)}>View Details</Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(accessories.length / accessoriesPerPage)}
        page={page}
        onChange={(_, value) => handleChangePage(value)}
        color="primary"
        sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}
      />

      {/* Modal for Accessory Details */}
      <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{currentAccessory?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center' }}>
            <img
              src={currentAccessory?.image}
              alt={currentAccessory?.name}
              style={{
                width: '100%',
                height: 'auto', // Let the height adjust according to image aspect ratio
                borderRadius: '8px',
              }}
            />
            <Typography variant="h6" sx={{ mt: 2 }}>{currentAccessory?.price}</Typography>
            <Typography variant="body1" sx={{ mt: 2, color: 'gray' }}>{currentAccessory?.details}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CarsAccessories;
