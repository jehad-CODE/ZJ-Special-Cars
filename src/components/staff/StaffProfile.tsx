import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Lock,
  Edit,
  CloudUpload,
  Save,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StaffProfile: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  // Staff profile state
  const [name, setName] = useState('Staff User');
  const [email, setEmail] = useState('staff@zjcars.com');
  const [phone, setPhone] = useState('+966 502 456 789');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');

  // Fetch staff data when component mounts
  useEffect(() => {
    // Check if user is logged in and is staff
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'staff') {
      navigate('/sign-in');
      return;
    }

    // Get user data from localStorage
    const username = localStorage.getItem('username') || 'Staff User';
    const userEmail = localStorage.getItem('email') || 'staff@zjcars.com';
    const userPhone = localStorage.getItem('phone') || '+966 502 456 789';
    const id = localStorage.getItem('userId') || '';

    setName(username);
    setEmail(userEmail);
    setPhone(userPhone);
    setUserId(id);
  }, [navigate]);
  
  // Handle save profile
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbarMessage('Authentication error. Please login again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }
      
      // Prepare data for update
      const updateData: any = {
        username: name,
        email: email,
        phone: phone
      };
      
      // Make API call to update user profile
      const response = await fetch(`http://localhost:5000/api/auth/update-profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update localStorage with new user data
        localStorage.setItem('username', name);
        localStorage.setItem('email', email);
        localStorage.setItem('phone', phone);
        
        setIsEditing(false);
        setSnackbarMessage('Profile updated successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(data.message || 'Failed to update profile');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbarMessage('Something went wrong. Please try again later.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setSnackbarMessage('Passwords do not match!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    
    if (newPassword.length < 8) {
      setSnackbarMessage('Password must be at least 8 characters long!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbarMessage('Authentication error. Please login again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }
      
      // Prepare data for password update
      const updateData = {
        password: newPassword,
        currentPassword: currentPassword
      };
      
      // Make API call to update password
      const response = await fetch(`http://localhost:5000/api/auth/update-profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setSnackbarMessage('Password changed successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setSnackbarMessage(data.message || 'Failed to change password');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setSnackbarMessage('Something went wrong. Please try again later.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

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
      
      </Typography>
      
      <Grid container spacing={isMobile ? 2 : 3}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              borderRadius: 2,
              height: '100%',
              background: 'linear-gradient(145deg, #2c2c2c, #333333)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                Profile Information
              </Typography>
              
              <IconButton 
                color="primary" 
                onClick={() => setIsEditing(!isEditing)}
                sx={{ bgcolor: isEditing ? 'rgba(76, 175, 80, 0.1)' : 'transparent' }}
              >
                <Edit />
              </IconButton>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar 
                sx={{ 
                  width: isMobile ? 80 : 100, 
                  height: isMobile ? 80 : 100, 
                  mb: 2,
                  bgcolor: '#4caf50',
                  color: '#333'
                }}
              >
                {name ? name.charAt(0).toUpperCase() : 'S'}
              </Avatar>
              
              {isEditing && (
                <Button
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  size="small"
                  sx={{ mb: 2 }}
                >
                  Upload Photo
                </Button>
              )}
              
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>{name}</Typography>
              <Typography variant="body1" sx={{ color: '#aaa' }}>Staff Member</Typography>
            </Box>
            
            <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  fullWidth
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    }
                  }}
                />
              </Grid>
            </Grid>
            
            {isEditing && (
              <Button
                variant="contained"
                color="success"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                fullWidth
                onClick={handleSaveProfile}
                disabled={loading}
                sx={{ mt: 3 }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </Paper>
        </Grid>
        
        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              borderRadius: 2,
              height: '100%',
              background: 'linear-gradient(145deg, #2c2c2c, #333333)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'white' }}>
              Security Settings
            </Typography>
            
            <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'white' }}>
              <Lock sx={{ mr: 1, color: '#4caf50' }} /> Change Password
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  fullWidth
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  required
                  error={newPassword !== confirmPassword && confirmPassword !== ''}
                  helperText={newPassword !== confirmPassword && confirmPassword !== '' ? "Passwords don't match" : ''}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                    '& .MuiFormHelperText-root': {
                      color: theme.palette.error.main,
                    }
                  }}
                />
              </Grid>
            </Grid>
            
            <Button
              variant="contained"
              color="success"
              onClick={handleChangePassword}
              sx={{ mt: 3 }}
              disabled={!currentPassword || !newPassword || !confirmPassword || loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
            
            <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />
            
            <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ color: '#aaa' }}>
                For additional security issues or account recovery, please contact the system administrator.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StaffProfile;