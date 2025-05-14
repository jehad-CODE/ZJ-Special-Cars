import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  InputAdornment,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Email, Lock, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const glassMorph = {
    background: 'rgba(26, 26, 46, 0.8)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('phone', data.user.phone);
        localStorage.setItem('userId', data.user.id);

        switch (data.user.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'staff':
            navigate('/staff');
            break;
          default:
            navigate('/');
        }
      } else {
        setError(data.message || 'Invalid credentials');
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
      <AppBar position="fixed" sx={{ ...glassMorph, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        <Toolbar sx={{ height: 70 }}>
          <Box
            component="img"
            src="/src/assets/ZJlogo.png"
            alt="ZJ Special Cars Logo"
            sx={{ height: 50, mr: 2, filter: 'drop-shadow(0 0 10px rgba(255,235,59,0.3))' }}
          />
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              color="inherit"
              onClick={() => navigate('/')}
              sx={{
                color: 'white',
                fontWeight: 'bold',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: 0,
                  height: '2px',
                  backgroundColor: '#ffeb3b',
                  transition: 'width 0.3s ease',
                },
                '&:hover::after': { width: '100%' },
              }}
              startIcon={<Home />}
            >
              Home
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundImage: `url('src/assets/Login5.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#000',
          pt: '70px',
          px: isMobile ? 2 : 0,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.07)',
            zIndex: 1,
          },
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(26, 26, 46, 0.6)',
            p: isMobile ? 3 : 4,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(255, 235, 59, 0.2)',
            width: '100%',
            maxWidth: '400px',
            position: 'relative',
            zIndex: 2,
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: '#ffeb3b', fontWeight: 'bold', fontSize: isMobile ? '1.75rem' : '2.25rem' }}
          >
            Sign In
          </Typography>

          {error && (
            <Typography variant="body2" sx={{ color: '#f44336', mb: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#444' },
                '&:hover fieldset': { borderColor: '#666' },
                '&.Mui-focused fieldset': { borderColor: '#ffeb3b' },
              },
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: '#aaa' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#ffeb3b' },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#ffeb3b' }} />
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
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#444' },
                '&:hover fieldset': { borderColor: '#666' },
                '&.Mui-focused fieldset': { borderColor: '#ffeb3b' },
              },
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: '#aaa' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#ffeb3b' },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#ffeb3b' }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{
              mt: 3,
              backgroundColor: '#ffeb3b',
              color: '#000',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#ffe100' },
              '&:disabled': {
                backgroundColor: 'rgba(255, 235, 59, 0.5)',
                color: 'rgba(0, 0, 0, 0.5)',
              },
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          <Typography variant="body2" sx={{ color: '#fff', mt: 2 }}>
            Don't have an account?{' '}
            <Link
              component="button"
              onClick={() => navigate('/sign-up')}
              underline="hover"
              disabled={isLoading}
              sx={{ color: '#ffeb3b', fontWeight: 'bold' }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SignIn;
