import React from 'react';
import { Grid, Button, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Menu: React.FC = () => {
  return (
    <Box sx={{ 
      backgroundColor: 'black', 
      color: 'white', 
      padding: '20px', 
      minHeight: '100vh', 
      overflowY: 'auto'  // Enables scrolling when content exceeds the viewport height
    }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
        Choose a Category
      </Typography>
      
      <Grid container spacing={4} justifyContent="center">
        {/* First Row with Two Items */}
        <Grid item xs={6} sm={4} md={2}>
          <Link to="/menu/sport">
            <Button variant="contained" fullWidth sx={{ backgroundColor: '#1976d2' }}>
              Sport Cars
            </Button>
          </Link>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Link to="/menu/classic">
            <Button variant="contained" fullWidth sx={{ backgroundColor: '#1976d2' }}>
              Classic Cars
            </Button>
          </Link>
        </Grid>

        {/* Second Row with Two Items */}
        <Grid item xs={6} sm={4} md={2}>
          <Link to="/menu/hybrid-electric">
            <Button variant="contained" fullWidth sx={{ backgroundColor: '#1976d2' }}>
              Hybrid/Electric Cars
            </Button>
          </Link>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Link to="/menu/life-product">
            <Button variant="contained" fullWidth sx={{ backgroundColor: '#1976d2' }}>
              Life Products
            </Button>
          </Link>
        </Grid>

        {/* Third Row with One Item */}
        <Grid item xs={6} sm={4} md={2}>
          <Link to="/menu/cars-accessories">
            <Button variant="contained" fullWidth sx={{ backgroundColor: '#1976d2' }}>
              Cars Accessories
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Menu;
