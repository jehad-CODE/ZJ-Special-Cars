import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, Grid, useMediaQuery, useTheme, CircularProgress
} from '@mui/material';

interface SystemStats {
  users: number;
  staff: number;
  cars: number;
  accessories: number;
  pendingCars: number;
  lifeProducts: number;
}

const AdminDashboardStats: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SystemStats>({
    users: 0,
    staff: 0,
    cars: 0,
    accessories: 0,
    pendingCars: 0,
    lifeProducts: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No token found');
          return;
        }

        // Fetch users count
        const usersResponse = await fetch('http://localhost:5000/api/auth/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Fetch cars count (all cars)
        const carsResponse = await fetch('http://localhost:5000/api/cars', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Fetch pending cars specifically
        // Using the same approach as in PendingCars component
        const pendingCarsResponse = await fetch('http://localhost:5000/api/cars?role=admin&status=pending', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Fetch accessories count
        const accessoriesResponse = await fetch('http://localhost:5000/api/car-accessories', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Fetch life products count
        const lifeProductsResponse = await fetch('http://localhost:5000/api/life-products', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (usersResponse.ok && carsResponse.ok && pendingCarsResponse.ok && 
            accessoriesResponse.ok && lifeProductsResponse.ok) {
          const users = await usersResponse.json();
          const cars = await carsResponse.json();
          const pendingCars = await pendingCarsResponse.json();
          const accessories = await accessoriesResponse.json();
          const lifeProducts = await lifeProductsResponse.json();
          
          // Count regular users and staff (admin)
          const regularUsers = users.filter((user: any) => user.role === 'user').length;
          const staffCount = users.filter((user: any) => user.role === 'admin').length;
          
          setStats({
            users: regularUsers,
            staff: staffCount,
            cars: cars.length,
            accessories: accessories.length,
            pendingCars: pendingCars.length, // This now uses the dedicated endpoint for pending cars
            lifeProducts: lifeProducts.length
          });
        } else {
          console.error('Failed to fetch stats data');
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 3, 
          fontWeight: 'bold', 
          color: 'white',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          textShadow: '0px 2px 3px rgba(0,0,0,0.3)'
        }}
      >
        Dashboard
      </Typography>
      
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          my: 5, 
          opacity: 0.8 
        }}>
          <CircularProgress 
            size={50}
            thickness={4}
            sx={{
              color: theme.palette.primary.main,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
        </Box>
      ) : (
        <Paper 
          elevation={6} 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            borderRadius: 3,
            background: 'linear-gradient(145deg, #2c2c2c, #333333)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 3,
              pl: 1,
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              color: 'white'
            }}
          >
            System Overview
          </Typography>
          
          <Grid container spacing={isMobile ? 2.5 : 3.5}>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2.5,
                background: 'linear-gradient(145deg, rgba(33, 150, 243, 0.05) 0%, rgba(33, 150, 243, 0.15) 100%)',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(33, 150, 243, 0.15)',
                border: '1px solid rgba(33, 150, 243, 0.05)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 25px rgba(33, 150, 243, 0.25)'
                }
              }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 900, 
                    color: 'primary.main',
                    fontSize: { xs: '2.2rem', md: '2.5rem' },
                    textShadow: '0 2px 10px rgba(33, 150, 243, 0.3)'
                  }}
                >
                  {stats.users}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: '#bbb',
                    fontWeight: 500,
                    mt: 0.5,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Regular Users
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2.5,
                background: 'linear-gradient(145deg, rgba(156, 39, 176, 0.05) 0%, rgba(156, 39, 176, 0.15) 100%)',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(156, 39, 176, 0.15)',
                border: '1px solid rgba(156, 39, 176, 0.05)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 25px rgba(156, 39, 176, 0.25)'
                }
              }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 900, 
                    color: 'secondary.main',
                    fontSize: { xs: '2.2rem', md: '2.5rem' },
                    textShadow: '0 2px 10px rgba(156, 39, 176, 0.3)'
                  }}
                >
                  {stats.staff}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: '#bbb',
                    fontWeight: 500,
                    mt: 0.5,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Staff Members
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2.5,
                background: 'linear-gradient(145deg, rgba(76, 175, 80, 0.05) 0%, rgba(76, 175, 80, 0.15) 100%)',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(76, 175, 80, 0.15)',
                border: '1px solid rgba(76, 175, 80, 0.05)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 25px rgba(76, 175, 80, 0.25)'
                }
              }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 900, 
                    color: 'success.main',
                    fontSize: { xs: '2.2rem', md: '2.5rem' },
                    textShadow: '0 2px 10px rgba(76, 175, 80, 0.3)'
                  }}
                >
                  {stats.cars}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: '#bbb',
                    fontWeight: 500,
                    mt: 0.5,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Cars
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2.5,
                background: 'linear-gradient(145deg, rgba(255, 152, 0, 0.05) 0%, rgba(255, 152, 0, 0.15) 100%)',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(255, 152, 0, 0.15)',
                border: '1px solid rgba(255, 152, 0, 0.05)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 25px rgba(255, 152, 0, 0.25)'
                }
              }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 900, 
                    color: 'warning.main',
                    fontSize: { xs: '2.2rem', md: '2.5rem' },
                    textShadow: '0 2px 10px rgba(255, 152, 0, 0.3)'
                  }}
                >
                  {stats.accessories}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: '#bbb',
                    fontWeight: 500,
                    mt: 0.5,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Car Accessories
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2.5,
                background: 'linear-gradient(145deg, rgba(244, 67, 54, 0.05) 0%, rgba(244, 67, 54, 0.15) 100%)',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(244, 67, 54, 0.15)',
                border: '1px solid rgba(244, 67, 54, 0.05)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 25px rgba(244, 67, 54, 0.25)'
                }
              }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 900, 
                    color: 'error.main',
                    fontSize: { xs: '2.2rem', md: '2.5rem' },
                    textShadow: '0 2px 10px rgba(244, 67, 54, 0.3)'
                  }}
                >
                  {stats.pendingCars}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: '#bbb',
                    fontWeight: 500,
                    mt: 0.5,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Pending Cars
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 2.5,
                background: 'linear-gradient(145deg, rgba(0, 188, 212, 0.05) 0%, rgba(0, 188, 212, 0.15) 100%)',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 188, 212, 0.15)',
                border: '1px solid rgba(0, 188, 212, 0.05)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 25px rgba(0, 188, 212, 0.25)'
                }
              }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 900, 
                    color: 'info.main',
                    fontSize: { xs: '2.2rem', md: '2.5rem' },
                    textShadow: '0 2px 10px rgba(0, 188, 212, 0.3)'
                  }}
                >
                  {stats.lifeProducts}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: '#bbb',
                    fontWeight: 500,
                    mt: 0.5,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Life Products
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default AdminDashboardStats;