import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Link, InputAdornment } from '@mui/material';
import { AccountCircle, Email, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton } from '@mui/material'; // AppBar and Toolbar for consistent navbar
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'; // Car Icon for navbar
import HomeIcon from '@mui/icons-material/Home'; // Home Icon for navbar

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate('/auth/sign-in');
  };

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      {/* Navbar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#1e1e1e',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Toolbar>
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

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'right' }}>
            <IconButton
              color="inherit"
              onClick={() => navigate('/')}
              sx={{ mx: 2 }}
            >
              <HomeIcon sx={{ color: 'white' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundImage: `url('src/assets/Login.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          marginTop: '64px',
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 4,
            borderRadius: 3,
            boxShadow: '0px 4px 10px rgba(255, 200, 0, 0.5)',
            width: '100%',
            maxWidth: '400px',
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: '#FFD700', fontWeight: 'bold' }}>
            Sign Up
          </Typography>

          <TextField
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            required
            sx={{ input: { color: '#fff' }, label: { color: '#FFC107' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle sx={{ color: '#FFC107' }} />
                </InputAdornment>
              ),
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
            sx={{ input: { color: '#fff' }, label: { color: '#FFC107' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#FFC107' }} />
                </InputAdornment>
              ),
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
            sx={{ input: { color: '#fff' }, label: { color: '#FFC107' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#FFC107' }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              backgroundColor: '#FFC107',
              color: '#000',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#FFD54F' },
            }}
          >
            Sign Up
          </Button>

          <Typography variant="body2" sx={{ color: '#fff' }}>
            Already have an account?{' '}
            <Link
              component="button"
              onClick={() => navigate('/sign-in')}
              underline="hover"
              sx={{ color: '#FFD700', fontWeight: 'bold', cursor: 'pointer' }}
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
