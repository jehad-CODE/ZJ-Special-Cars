import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, TextField, Menu, MenuItem, Modal, Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const Dashboard: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [carsAnchorEl, setCarsAnchorEl] = useState<null | HTMLElement>(null);
  const [accessoriesAnchorEl, setAccessoriesAnchorEl] = useState<null | HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

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
      <AppBar position="fixed" sx={{ backgroundColor: '#1e1e1e', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DirectionsCarIcon sx={{ color: '#ffeb3b', fontSize: '40px', marginRight: '10px' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ffeb3b', fontSize: '1.5rem' }}>
              ZJ SPECIAL CARS
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search..."
                fullWidth
                onClick={() => setSearchOpen(true)}
                sx={{ backgroundColor: 'black', borderRadius: 5 }}
              />
              <IconButton color="inherit" sx={{ marginLeft: 1 }} onClick={() => setSearchOpen(true)}>
                <SearchIcon />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Button color="inherit" component={Link} to="/" sx={{ color: 'white', fontWeight: 'bold' }}>Home</Button>
            <Button color="inherit" onClick={handleMenuClick} sx={{ color: 'white', fontWeight: 'bold' }}>Menu</Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleCarsMenuClick}>CARS</MenuItem>
              <Menu anchorEl={carsAnchorEl} open={Boolean(carsAnchorEl)} onClose={handleClose}>
                <MenuItem component={Link} to="/menu/sport" onClick={handleClose}>SPORT</MenuItem>
                <MenuItem component={Link} to="/menu/classic" onClick={handleClose}>CLASSIC</MenuItem>
                <MenuItem component={Link} to="/menu/hybrid-electric" onClick={handleClose}>Hybrid/Electric Cars</MenuItem>
              </Menu>
              <MenuItem onClick={handleAccessoriesMenuClick}>Accessories</MenuItem>
              <Menu anchorEl={accessoriesAnchorEl} open={Boolean(accessoriesAnchorEl)} onClose={handleClose}>
                <MenuItem component={Link} to="/menu/cars-accessories" onClick={handleClose}>Cars Accessories</MenuItem>
                <MenuItem component={Link} to="/menu/life-product" onClick={handleClose}>Life Product</MenuItem>
              </Menu>
            </Menu>
            <Button color="inherit" component={Link} to="/sell-your-car" sx={{ color: 'white', fontWeight: 'bold' }}>Sell Your Car</Button>
            <Button color="inherit" component={Link} to="/contact" sx={{ color: 'white', fontWeight: 'bold' }}>Contact</Button>
            <Button color="inherit" component={Link} to="/sign-in" sx={{ color: 'white', fontWeight: 'bold' }}>Sign In</Button>
          </Box>

          <IconButton color="inherit" edge="end" sx={{ display: { xs: 'block', sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ marginTop: '64px', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        <Outlet />
      </Box>

      {/* Advanced Search Modal */}
      <Modal open={searchOpen} onClose={() => setSearchOpen(false)}>
        <Paper sx={{ width: 400, p: 3, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'black', boxShadow: 24, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Advanced Search</Typography>
          <TextField label="Car Name" fullWidth sx={{ mb: 2 }} />
          <TextField label="Color" fullWidth sx={{ mb: 2 }} />
          <TextField label="Distance" fullWidth sx={{ mb: 2 }} />
          <TextField label="Minimum Price" type="number" fullWidth sx={{ mb: 2 }} />
          <TextField label="Maximum Price" type="number" fullWidth sx={{ mb: 2 }} />
          <Button variant="contained" color="primary" fullWidth onClick={() => setSearchOpen(false)}>Search</Button>
        </Paper>
      </Modal>
    </Box>
  );
};

export default Dashboard;
