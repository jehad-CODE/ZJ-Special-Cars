import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Link, InputAdornment, AppBar, Toolbar, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { AccountCircle, Email, Lock, Phone, Home } from '@mui/icons-material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          phone
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Registration successful! Please sign in.');
        navigate('/sign-in');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Connection error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      <AppBar position="fixed" sx={{ backgroundColor: '#1e1e1e', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DirectionsCarIcon sx={{ color: '#ffeb3b', fontSize: isMobile ? '30px' : '40px', mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ffeb3b', fontSize: isMobile ? '1.2rem' : '1.5rem' }}>
              {isMobile ? 'ZJ CARS' : 'ZJ SPECIAL CARS'}
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton color="inherit" onClick={() => navigate('/')} sx={{ mx: 1 }}>
              <Home sx={{ color: 'white' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundImage: `url('src/assets/Login.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        pt: '64px',
        px: isMobile ? 2 : 0
      }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            p: isMobile ? 3 : 4,
            borderRadius: 3,
            boxShadow: '0px 4px 10px rgba(255, 200, 0, 0.5)',
            width: '100%',
            maxWidth: '400px',
            maxHeight: isMobile ? '90vh' : 'auto',
            overflowY: isMobile ? 'auto' : 'visible'
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: '#FFD700', fontWeight: 'bold', fontSize: isMobile ? '1.75rem' : '2.25rem' }}>
            Sign Up
          </Typography>

          {error && (
            <Typography variant="body2" sx={{ color: '#f44336', mb: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}

          <TextField
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            required
            disabled={isLoading}
            sx={{ input: { color: '#fff' }, label: { color: '#FFC107' } }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><AccountCircle sx={{ color: '#FFC107' }} /></InputAdornment>,
            }}
          />

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
            disabled={isLoading}
            sx={{ input: { color: '#fff' }, label: { color: '#FFC107' } }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Email sx={{ color: '#FFC107' }} /></InputAdornment>,
            }}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            disabled={isLoading}
            sx={{ input: { color: '#fff' }, label: { color: '#FFC107' } }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#FFC107' }} /></InputAdornment>,
            }}
          />

          <TextField
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            margin="normal"
            required
            disabled={isLoading}
            sx={{ input: { color: '#fff' }, label: { color: '#FFC107' } }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Phone sx={{ color: '#FFC107' }} /></InputAdornment>,
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{
              mt: 3,
              backgroundColor: '#FFC107',
              color: '#000',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#FFD54F' },
            }}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </Button>

          <Typography variant="body2" sx={{ color: '#fff', mt: 2 }}>
            Already have an account?{' '}
            <Link
              component="button"
              onClick={() => navigate('/sign-in')}
              underline="hover"
              disabled={isLoading}
              sx={{ color: '#FFD700', fontWeight: 'bold' }}
            >
              Sign In
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUp;