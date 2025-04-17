import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, TextField, Menu, MenuItem, Modal, Paper, InputAdornment } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CloseIcon from '@mui/icons-material/Close';

const Dashboard: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [carsAnchorEl, setCarsAnchorEl] = useState<null | HTMLElement>(null);
  const [accessoriesAnchorEl, setAccessoriesAnchorEl] = useState<null | HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [carColor, setCarColor] = useState('');
  const [distance, setDistance] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

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

  const handleSearch = () => {
    // Here you would implement the actual search functionality
    console.log('Searching for:', {
      query: searchQuery,
      color: carColor,
      distance,
      priceRange: { min: minPrice, max: maxPrice }
    });
    
    // Close the modal after search
    setSearchOpen(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCarColor('');
    setDistance('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      <AppBar position="fixed" sx={{ backgroundColor: '#1e1e1e', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              component="img"
              src="/src/assets/ZJlogo.png"
              alt="ZJ Special Cars Logo"
              sx={{ 
                height: { xs: 40, sm: 50 },
                mr: 1
              }}
            />
          </Box>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search for cars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                onClick={() => setSearchOpen(true)}
                sx={{ 
                  backgroundColor: 'black', 
                  borderRadius: 5,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#444' },
                    '&:hover fieldset': { borderColor: '#666' },
                    '&.Mui-focused fieldset': { borderColor: '#ffeb3b' }
                  },
                  '& .MuiInputBase-input': { 
                    color: 'white',
                    paddingRight: 0 
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        edge="end" 
                        sx={{ color: '#ffeb3b' }} 
                        onClick={() => setSearchOpen(true)}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
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
            <Button color="inherit" component={Link} to="/user-profile" sx={{ color: 'white', fontWeight: 'bold' }}>Profile</Button>
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
        <Paper sx={{
          width: 400,
          p: 3,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#222',
          color: 'white',
          boxShadow: 24,
          borderRadius: 2,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Advanced Search</Typography>
            <IconButton size="small" onClick={() => setSearchOpen(false)} sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <TextField 
            label="Car Name" 
            fullWidth 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#444' },
                '&:hover fieldset': { borderColor: '#666' },
                '&.Mui-focused fieldset': { borderColor: '#ffeb3b' }
              },
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: '#aaa' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#ffeb3b' }
            }} 
          />
          
          <TextField 
            label="Color" 
            fullWidth 
            value={carColor}
            onChange={(e) => setCarColor(e.target.value)}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#444' },
                '&:hover fieldset': { borderColor: '#666' },
                '&.Mui-focused fieldset': { borderColor: '#ffeb3b' }
              },
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: '#aaa' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#ffeb3b' }
            }} 
          />
          
          <TextField 
            label="Distance" 
            fullWidth 
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#444' },
                '&:hover fieldset': { borderColor: '#666' },
                '&.Mui-focused fieldset': { borderColor: '#ffeb3b' }
              },
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: '#aaa' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#ffeb3b' }
            }} 
          />
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField 
              label="Min Price" 
              type="number" 
              fullWidth 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#666' },
                  '&.Mui-focused fieldset': { borderColor: '#ffeb3b' }
                },
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiInputLabel-root': { color: '#aaa' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#ffeb3b' }
              }} 
            />
            
            <TextField 
              label="Max Price" 
              type="number" 
              fullWidth 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#666' },
                  '&.Mui-focused fieldset': { borderColor: '#ffeb3b' }
                },
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiInputLabel-root': { color: '#aaa' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#ffeb3b' }
              }} 
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={handleClearSearch}
              sx={{ 
                flex: 1, 
                color: 'white', 
                borderColor: '#444',
                '&:hover': { borderColor: '#666' }
              }}
            >
              Clear
            </Button>
            
            <Button 
              variant="contained" 
              onClick={handleSearch}
              sx={{ 
                flex: 2, 
                bgcolor: '#ffeb3b', 
                color: 'black',
                '&:hover': { bgcolor: '#ffe100' }
              }}
            >
              Search
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default Dashboard;