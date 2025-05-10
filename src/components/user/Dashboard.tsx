import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, TextField, Menu, MenuItem, Modal, Paper, InputAdornment, Tooltip, Select, FormControl, InputLabel, Grid, CircularProgress } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import TuneIcon from '@mui/icons-material/Tune';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const Dashboard: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [carsAnchorEl, setCarsAnchorEl] = useState<null | HTMLElement>(null);
  const [accessoriesAnchorEl, setAccessoriesAnchorEl] = useState<null | HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('cars');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [carType, setCarType] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleCarsMenuClick = (event: React.MouseEvent<HTMLElement>) => setCarsAnchorEl(event.currentTarget);
  const handleAccessoriesMenuClick = (event: React.MouseEvent<HTMLElement>) => setAccessoriesAnchorEl(event.currentTarget);
  const handleClose = () => { setAnchorEl(null); setCarsAnchorEl(null); setAccessoriesAnchorEl(null); };

  const handleNormalSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const [carsRes, accessoriesRes, lifeRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/cars`),
        axios.get(`${API_BASE_URL}/api/car-accessories`),
        axios.get(`${API_BASE_URL}/api/life-products`)
      ]);

      let allResults = [];
      const cars = carsRes.data.filter((car: any) => 
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase())
      );
      allResults = [...cars.map((item: any) => ({ ...item, itemType: 'car' }))];

      const accessories = accessoriesRes.data.filter((item: any) => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      allResults = [...allResults, ...accessories.map((item: any) => ({ ...item, itemType: 'accessory' }))];

      const lifeProducts = lifeRes.data.filter((item: any) => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      allResults = [...allResults, ...lifeProducts.map((item: any) => ({ ...item, itemType: 'life' }))];

      setSearchResults(allResults);
      setResultsOpen(true);
    } catch (error) {
      console.error('Search error:', error);
    }
    setLoading(false);
  };

  const handleAdvancedSearch = async () => {
    setLoading(true);
    try {
      let results = [];
      
      if (searchType === 'cars') {
        const carsRes = await axios.get(`${API_BASE_URL}/api/cars`);
        let cars = carsRes.data;
        
        if (searchQuery) {
          cars = cars.filter((car: any) => 
            car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            car.model.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        if (carType) {
          cars = cars.filter((car: any) => car.type === carType);
        }
        
        if (minPrice || maxPrice) {
          cars = cars.filter((car: any) => {
            const price = Number(car.price.replace(/[^0-9]/g, ''));
            return (!minPrice || price >= Number(minPrice)) && 
                   (!maxPrice || price <= Number(maxPrice));
          });
        }
        
        results = cars.map((item: any) => ({ ...item, itemType: 'car' }));
      } else {
        const [accessoriesRes, lifeRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/car-accessories`),
          axios.get(`${API_BASE_URL}/api/life-products`)
        ]);
        
        let accessories = accessoriesRes.data;
        let lifeProducts = lifeRes.data;
        
        if (searchQuery) {
          accessories = accessories.filter((item: any) => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          lifeProducts = lifeProducts.filter((item: any) => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        if (minPrice || maxPrice) {
          const filterByPrice = (items: any[]) => items.filter((item: any) => {
            const price = Number(item.price.replace(/[^0-9]/g, ''));
            return (!minPrice || price >= Number(minPrice)) && 
                   (!maxPrice || price <= Number(maxPrice));
          });
          
          accessories = filterByPrice(accessories);
          lifeProducts = filterByPrice(lifeProducts);
        }
        
        results = [
          ...accessories.map((item: any) => ({ ...item, itemType: 'accessory' })),
          ...lifeProducts.map((item: any) => ({ ...item, itemType: 'life' }))
        ];
      }
      
      setSearchResults(results);
      setSearchOpen(false);
      setResultsOpen(true);
    } catch (error) {
      console.error('Search error:', error);
    }
    setLoading(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setCarType('');
  };

  const handleItemClick = (item: any) => {
    if (item.itemType === 'car') {
      if (item.type === 'Sport') navigate('/menu/sport', { state: { selectedItem: item } });
      else if (item.type === 'Classic') navigate('/menu/classic', { state: { selectedItem: item } });
      else if (item.type === 'Hybrid/Electric') navigate('/menu/hybrid-electric', { state: { selectedItem: item } });
    } else if (item.itemType === 'accessory') {
      navigate('/menu/cars-accessories', { state: { selectedItem: item } });
    } else {
      navigate('/menu/life-product', { state: { selectedItem: item } });
    }
    setResultsOpen(false);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${API_BASE_URL}${normalizedPath}`;
  };

  const handleImageError = (id: string) => {
    setImageError(prev => ({ ...prev, [id]: true }));
  };
  
  const handleSignOut = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/');
  };

  const gradientBg = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
  const glassMorph = {
    background: 'rgba(26, 26, 46, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      <AppBar position="fixed" sx={{ ...glassMorph, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        <Toolbar sx={{ height: 70 }}>
          <Box 
            component="img"
            src="/src/assets/ZJlogo.png"
            alt="ZJ Special Cars Logo"
            sx={{ height: 50, mr: 2, filter: 'drop-shadow(0 0 10px rgba(255,235,59,0.3))' }}
          />

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNormalSearch()}
              onDoubleClick={() => setSearchOpen(true)}
              sx={{ 
                width: { xs: '100%', sm: '50%', md: '40%' },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderRadius: '25px',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#ffeb3b' }
                },
                '& .MuiInputBase-input': { color: 'white', px: 2 }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton sx={{ color: '#ffeb3b' }} onClick={handleNormalSearch}>
                      <SearchIcon />
                    </IconButton>
                    <IconButton sx={{ color: '#ffeb3b' }} onClick={() => setSearchOpen(true)}>
                      <TuneIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            {['Home', 'Menu', 'Sell Your Car', 'Contact'].map((text) => (
              <Button
                key={text}
                color="inherit"
                component={text === 'Menu' ? 'button' : Link}
                to={text === 'Home' ? '/' : text === 'Menu' ? undefined : `/${text.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={text === 'Menu' ? handleMenuClick : undefined}
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  mx: 0.5,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: 0,
                    height: '2px',
                    backgroundColor: '#ffeb3b',
                    transition: 'width 0.3s ease'
                  },
                  '&:hover::after': { width: '100%' }
                }}
              >
                {text}
              </Button>
            ))}
            
            {isLoggedIn ? (
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/user-profile" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    mx: 0.5,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: 0,
                      height: '2px',
                      backgroundColor: '#ffeb3b',
                      transition: 'width 0.3s ease'
                    },
                    '&:hover::after': { width: '100%' }
                  }}
                >
                  Profile
                </Button>
                <Tooltip title="Sign Out">
                  <IconButton 
                    color="inherit" 
                    onClick={handleSignOut} 
                    sx={{ color: '#ff4d4d' }}
                  >
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Button 
                color="inherit" 
                component={Link} 
                to="/sign-in" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  border: '1px solid #ffeb3b',
                  borderRadius: '20px',
                  px: 3,
                  '&:hover': { backgroundColor: 'rgba(255,235,59,0.1)' }
                }}
              >
                Sign In
              </Button>
            )}
          </Box>

          <IconButton 
            color="inherit" 
            edge="end" 
            sx={{ display: { xs: 'block', md: 'none' } }}
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Menu 
        anchorEl={anchorEl} 
        open={Boolean(anchorEl)} 
        onClose={handleClose}
        PaperProps={{
          sx: {
            backgroundImage: gradientBg,
            ...glassMorph,
            color: 'white',
            '& .MuiMenuItem-root': {
              '&:hover': {
                backgroundColor: 'rgba(255,235,59,0.1)'
              }
            }
          }
        }}
      >
        <MenuItem onClick={handleCarsMenuClick}>
          <DirectionsCarIcon sx={{ mr: 1, color: '#ffeb3b' }} />
          CARS
        </MenuItem>
        <Menu 
          anchorEl={carsAnchorEl} 
          open={Boolean(carsAnchorEl)} 
          onClose={handleClose}
          PaperProps={{
            sx: {
              backgroundImage: gradientBg,
              ...glassMorph,
              color: 'white',
              '& .MuiMenuItem-root': {
                '&:hover': {
                  backgroundColor: 'rgba(255,235,59,0.1)'
                }
              }
            }
          }}
        >
          <MenuItem component={Link} to="/menu/sport" onClick={handleClose}>SPORT</MenuItem>
          <MenuItem component={Link} to="/menu/classic" onClick={handleClose}>CLASSIC</MenuItem>
          <MenuItem component={Link} to="/menu/hybrid-electric" onClick={handleClose}>Hybrid/Electric Cars</MenuItem>
        </Menu>
        <MenuItem onClick={handleAccessoriesMenuClick}>
          <BuildIcon sx={{ mr: 1, color: '#ffeb3b' }} />
          Accessories
        </MenuItem>
        <Menu 
          anchorEl={accessoriesAnchorEl} 
          open={Boolean(accessoriesAnchorEl)} 
          onClose={handleClose}
          PaperProps={{
            sx: {
              backgroundImage: gradientBg,
              ...glassMorph,
              color: 'white',
              '& .MuiMenuItem-root': {
                '&:hover': {
                  backgroundColor: 'rgba(255,235,59,0.1)'
                }
              }
            }
          }}
        >
          <MenuItem component={Link} to="/menu/cars-accessories" onClick={handleClose}>Cars Accessories</MenuItem>
          <MenuItem component={Link} to="/menu/life-product" onClick={handleClose}>Life Product</MenuItem>
        </Menu>
      </Menu>

      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          position: 'fixed',
          top: 0,
          right: mobileMenuOpen ? 0 : '-100%',
          width: '250px',
          height: '100vh',
          ...glassMorph,
          transition: 'right 0.3s ease',
          zIndex: 1300,
          overflowY: 'auto'
        }}
      >
        <Box sx={{ p: 2 }}>
          <IconButton onClick={() => setMobileMenuOpen(false)} sx={{ color: 'white', mb: 2 }}>
            <CloseIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button color="inherit" component={Link} to="/" sx={{ color: 'white' }} onClick={() => setMobileMenuOpen(false)}>Home</Button>
            <Button color="inherit" component={Link} to="/menu/sport" sx={{ color: 'white' }} onClick={() => setMobileMenuOpen(false)}>Sport Cars</Button>
            <Button color="inherit" component={Link} to="/menu/classic" sx={{ color: 'white' }} onClick={() => setMobileMenuOpen(false)}>Classic Cars</Button>
            <Button color="inherit" component={Link} to="/menu/hybrid-electric" sx={{ color: 'white' }} onClick={() => setMobileMenuOpen(false)}>Hybrid/Electric</Button>
            <Button color="inherit" component={Link} to="/menu/cars-accessories" sx={{ color: 'white' }} onClick={() => setMobileMenuOpen(false)}>Car Accessories</Button>
            <Button color="inherit" component={Link} to="/menu/life-product" sx={{ color: 'white' }} onClick={() => setMobileMenuOpen(false)}>Life Products</Button>
            <Button color="inherit" component={Link} to="/sell-your-car" sx={{ color: 'white' }} onClick={() => setMobileMenuOpen(false)}>Sell Your Car</Button>
            <Button color="inherit" component={Link} to="/contact" sx={{ color: 'white' }} onClick={() => setMobileMenuOpen(false)}>Contact</Button>
            
            {isLoggedIn ? (
              <>
                <Button color="inherit" component={Link} to="/user-profile" sx={{ color: 'white' }} onClick={() => setMobileMenuOpen(false)}>Profile</Button>
                <Button color="inherit" onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} sx={{ color: '#ff4d4d' }}>Sign Out</Button>
              </>
            ) : (
              <Button color="inherit" component={Link} to="/sign-in" sx={{ color: 'white' }} onClick={() => setMobileMenuOpen(false)}>Sign In</Button>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ marginTop: '70px', height: 'calc(100vh - 70px)', overflow: 'hidden' }}>
        <Outlet />
      </Box>

      <Modal open={searchOpen} onClose={() => setSearchOpen(false)}>
        <Paper sx={{
          width: { xs: '90%', sm: 400 },
          p: 3,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundImage: gradientBg,
          color: 'white',
          borderRadius: 3,
          ...glassMorph
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              <TuneIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#ffeb3b' }} />
              Advanced Search
            </Typography>
            <IconButton size="small" onClick={() => setSearchOpen(false)} sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: '#aaa', '&.Mui-focused': { color: '#ffeb3b' } }}>Search Type</InputLabel>
            <Select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              sx={{ 
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#666' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ffeb3b' },
                '& .MuiSvgIcon-root': { color: 'white' }
              }}
            >
              <MenuItem value="cars">
                <DirectionsCarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Cars
              </MenuItem>
              <MenuItem value="accessories">
                <BuildIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Accessories & Life Products
              </MenuItem>
            </Select>
          </FormControl>
          
          <TextField 
            label="Search Name" 
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

          {searchType === 'cars' && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: '#aaa', '&.Mui-focused': { color: '#ffeb3b' } }}>Car Type</InputLabel>
              <Select
                value={carType}
                onChange={(e) => setCarType(e.target.value)}
                sx={{ 
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#666' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ffeb3b' },
                  '& .MuiSvgIcon-root': { color: 'white' }
                }}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="Sport">Sport</MenuItem>
                <MenuItem value="Classic">Classic</MenuItem>
                <MenuItem value="Hybrid/Electric">Hybrid/Electric</MenuItem>
              </Select>
            </FormControl>
          )}
          
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
                '&:hover': { 
                  borderColor: '#ffeb3b',
                  backgroundColor: 'rgba(255,235,59,0.1)'
                }
              }}
            >
              Clear
            </Button>
            
            <Button 
              variant="contained" 
              onClick={handleAdvancedSearch}
              disabled={loading}
              sx={{ 
                flex: 2, 
                bgcolor: '#ffeb3b', 
                color: 'black',
                fontWeight: 'bold',
                '&:hover': { bgcolor: '#ffe100' }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Search'}
            </Button>
          </Box>
        </Paper>
      </Modal>

      <Modal open={resultsOpen} onClose={() => setResultsOpen(false)}>
        <Paper sx={{
          width: { xs: '95%', sm: '80%', md: '70%' },
          maxHeight: '80vh',
          overflow: 'auto',
          p: 3,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundImage: gradientBg,
          color: 'white',
          borderRadius: 3,
          ...glassMorph,
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Search Results ({searchResults.length})</Typography>
            <IconButton size="small" onClick={() => setResultsOpen(false)} sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {searchResults.length === 0 ? (
            <Typography sx={{ textAlign: 'center', py: 4 }}>No results found</Typography>
          ) : (
            <Grid container spacing={2}>
              {searchResults.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Paper
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        transform: 'scale(1.02)',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      },
                      borderRadius: 2,
                      overflow: 'hidden'
                    }}
                    onClick={() => handleItemClick(item)}
                  >
                    {item.images && item.images.length > 0 && !imageError[item._id] ? (
                      <Box sx={{ 
                        width: '100%', 
                        height: '200px',
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        <img
                          src={getImageUrl(item.images[0])}
                          alt={item.name}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover' 
                          }}
                          onError={() => handleImageError(item._id)}
                        />
                      </Box>
                    ) : (
                      <Box sx={{ 
                        width: '100%', 
                        height: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(85,85,85,0.3)'
                      }}>
                        <BrokenImageIcon sx={{ fontSize: 60, color: '#999' }} />
                      </Box>
                    )}
                    
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {item.name} {item.model ? `- ${item.model}` : ''}
                      </Typography>
                      {item.year && <Typography variant="body2" sx={{ color: 'gray' }}>{item.year}</Typography>}
                      {item.brand && <Typography variant="body2" sx={{ color: 'gray' }}>{item.brand}</Typography>}
                      <Typography variant="body1" sx={{ color: '#4caf50', fontWeight: 'bold', mt: 1 }}>
                        {item.price}
                      </Typography>
                      {item.type && <Typography variant="body2" sx={{ color: '#ffeb3b' }}>Type: {item.type}</Typography>}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Modal>
    </Box>
  );
};

export default Dashboard;