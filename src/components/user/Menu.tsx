import React from 'react';
import { Typography, Box } from '@mui/material'; // Add Box to the import

const Menu: React.FC = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Menu
      </Typography>
      <Typography variant="h5" color="textSecondary">
        Explore our collection of special cars.
      </Typography>
    </Box>
  );
};

export default Menu;