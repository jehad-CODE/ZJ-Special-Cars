import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, Grid, useMediaQuery, useTheme, CircularProgress
} from '@mui/material';

interface StaffSystemStats {
  users: number;
  pendingCars: number;
}

const StaffDashboardStats: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StaffSystemStats>({
    users: 0,
    pendingCars: 0
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
        
        // Fetch pending cars specifically
        const pendingCarsResponse = await fetch('http://localhost:5000/api/cars?role=staff&status=pending', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (usersResponse.ok && pendingCarsResponse.ok) {
          const users = await usersResponse.json();
          const pendingCars = await pendingCarsResponse.json();
          
          // Count regular users only
          const regularUsers = users.filter((user: any) => user.role === 'user').length;
          
          setStats({
            users: regularUsers,
            pendingCars: pendingCars.length
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
          
          <Grid container spacing={isMobile ? 4 : 6} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 3,
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
                    fontSize: { xs: '2.5rem', md: '3rem' },
                    textShadow: '0 2px 10px rgba(33, 150, 243, 0.3)'
                  }}
                >
                  {stats.users}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{
                    color: '#bbb',
                    fontWeight: 500,
                    mt: 1,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                Users
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 3,
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
                    fontSize: { xs: '2.5rem', md: '3rem' },
                    textShadow: '0 2px 10px rgba(244, 67, 54, 0.3)'
                  }}
                >
                  {stats.pendingCars}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{
                    color: '#bbb',
                    fontWeight: 500,
                    mt: 1,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Pending Car Submissions
                </Typography>
              </Box>
            </Grid>
          </Grid>          
        </Paper>
      )}
    </Box>
  );
};

export default StaffDashboardStats;