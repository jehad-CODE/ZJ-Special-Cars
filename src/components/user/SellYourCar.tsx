import React from 'react';
import { Typography, Box } from '@mui/material'; // Add Box to the import

const SellYourCar: React.FC = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Sell Your Car
      </Typography>
      <Typography variant="h5" color="textSecondary">
        List your special car with us.
      </Typography>
    </Box>
  );
};

export default SellYourCar;