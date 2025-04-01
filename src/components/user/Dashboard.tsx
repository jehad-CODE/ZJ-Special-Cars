//just for testing, delete later

import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, TextField, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'; // Car Icon

const Dashboard: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [carsAnchorEl, setCarsAnchorEl] = useState<null | HTMLElement>(null);
  const [accessoriesAnchorEl, setAccessoriesAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCarsMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setCarsAnchorEl(event.currentTarget);
  };

  const handleAccessoriesMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAccessoriesAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCarsAnchorEl(null);
    setAccessoriesAnchorEl(null);
  };

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      {/* Modern AppBar with navigation */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#1e1e1e', // Dark background for the navbar
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)', // Add a subtle shadow
        }}
      >
        <Toolbar>
          {/* ZJ Special Cars Icon and Brand Name */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Car Icon */}
            <DirectionsCarIcon sx={{ color: '#ffeb3b', fontSize: '40px', marginRight: '10px' }} />
            {/* Brand Name */}
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 'bold',
                color: '#ffeb3b', // Yellow color for the brand name
                fontSize: '1.5rem',
              }}
            >
              ZJ SPECIAL CARS
            </Typography>
          </Box>

          {/* Search Bar */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search..."
                fullWidth
                sx={{
                  backgroundColor: 'black',
                  borderRadius: 5,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'transparent' },
                    '&:hover fieldset': { borderColor: 'transparent' },
                    '&.Mui-focused fieldset': { borderColor: 'transparent' },
                  },
                }}
              />
              <IconButton color="inherit" sx={{ marginLeft: 1 }}>
                <SearchIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Button
              color="inherit"
              component={Link}
              to="/"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }, // Hover effect
              }}
            >
              Home
            </Button>

            {/* Menu Dropdown */}
            <Button
              color="inherit"
              onClick={handleMenuClick}
              sx={{
                color: 'white',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}
            >
              Menu
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {/* Cars Dropdown */}
              <MenuItem onClick={handleCarsMenuClick}>CARS</MenuItem>
              <Menu
                anchorEl={carsAnchorEl}
                open={Boolean(carsAnchorEl)}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              >
                <MenuItem component={Link} to="/menu/sport" onClick={handleClose}>SPORT</MenuItem>
                <MenuItem component={Link} to="/menu/classic" onClick={handleClose}>CLASSIC</MenuItem>
                <MenuItem component={Link} to="/menu/hybrid-electric" onClick={handleClose}>Hybrid/Electric Cars</MenuItem>
              </Menu>

              {/* Accessories Dropdown */}
              <MenuItem onClick={handleAccessoriesMenuClick}>Accessories</MenuItem>
              <Menu
                anchorEl={accessoriesAnchorEl}
                open={Boolean(accessoriesAnchorEl)}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              >
                <MenuItem component={Link} to="/menu/cars-accessories" onClick={handleClose}>Cars Accessories</MenuItem>
                <MenuItem component={Link} to="/menu/life-product" onClick={handleClose}>Life Product</MenuItem>
              </Menu>
            </Menu>

            <Button
              color="inherit"
              component={Link}
              to="/sell-your-car"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}
            >
              Sell Your Car
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/contact"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}
            >
              Contact
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/sign-in"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}
            >
              Sign In
            </Button>
          </Box>

          {/* Mobile Menu Button (Hidden on larger screens) */}
          <IconButton
            color="inherit"
            edge="end"
            sx={{ display: { xs: 'block', sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Outlet for nested routes */}
      <Box sx={{ marginTop: '64px', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
