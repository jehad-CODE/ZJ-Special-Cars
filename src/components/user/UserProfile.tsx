import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Avatar, Grid, useMediaQuery, useTheme, Snackbar, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const UserProfile: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [name, setName] = useState('Jehad Shaheen');
  const [email, setEmail] = useState('jehad@example.com');
  const [phone, setPhone] = useState('+966 502 666 898');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = () => {
    // Basic validation
    if (password && password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      setSnackbarOpen(true);
      return;
    }
    
    // TODO: Connect to backend API to update user profile
    setSnackbarOpen(true);
    setErrorMessage('');
    
    // Reset password fields after successful update
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      p: isMobile ? 2 : 4,
      minHeight: '100vh',
      height: '100%',
      backgroundColor: '#222',
      backgroundAttachment: 'fixed',
      overflowY: 'auto',
      color: 'white'
    }}>
      <Typography variant="h4" sx={{ my: 3, fontWeight: 'bold', color: 'white' }}>
        Account Settings
      </Typography>
      
      <Paper 
        elevation={5} 
        sx={{ 
          p: isMobile ? 2 : 4, 
          width: '100%', 
          maxWidth: 500,
          borderRadius: 2,
          mb: 8,
          backgroundColor: '#333',
          color: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: 'primary.main',
              fontSize: '2rem',
              mb: 2
            }}
          >
            {name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
            User Profile
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                endAdornment: <EditIcon color="action" fontSize="small" />,
                style: { color: 'white' }
              }}
              InputLabelProps={{
                style: { color: '#aaa' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#555',
                  },
                  '&:hover fieldset': {
                    borderColor: '#777',
                  },
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                endAdornment: <EditIcon color="action" fontSize="small" />,
                style: { color: 'white' }
              }}
              InputLabelProps={{
                style: { color: '#aaa' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#555',
                  },
                  '&:hover fieldset': {
                    borderColor: '#777',
                  },
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              InputProps={{
                endAdornment: <EditIcon color="action" fontSize="small" />,
                style: { color: 'white' }
              }}
              InputLabelProps={{
                style: { color: '#aaa' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#555',
                  },
                  '&:hover fieldset': {
                    borderColor: '#777',
                  },
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: '#ccc' }}>
              Change Password (leave empty to keep current)
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                style: { color: 'white' }
              }}
              InputLabelProps={{
                style: { color: '#aaa' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#555',
                  },
                  '&:hover fieldset': {
                    borderColor: '#777',
                  },
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={password !== confirmPassword && confirmPassword !== ''}
              helperText={password !== confirmPassword && confirmPassword !== '' ? "Passwords don't match" : ''}
              InputProps={{
                style: { color: 'white' }
              }}
              InputLabelProps={{
                style: { color: '#aaa' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#555',
                  },
                  '&:hover fieldset': {
                    borderColor: '#777',
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: 'error.main'
                }
              }}
            />
          </Grid>
        </Grid>

        <Button 
          variant="contained" 
          fullWidth 
          onClick={handleSave}
          sx={{ mt: 4 }}
          startIcon={<SaveIcon />}
          size="large"
        >
          Save Changes
        </Button>
        
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSnackbarOpen(false)} 
            severity={errorMessage ? "error" : "success"} 
            sx={{ width: '100%' }}
          >
            {errorMessage || "Profile updated successfully!"}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default UserProfile;