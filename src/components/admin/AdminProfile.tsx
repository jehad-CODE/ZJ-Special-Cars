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

const AdminProfile: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  // Admin profile state
  const [name, setName] = useState('Admin User');
  const [email, setEmail] = useState('admin@zjcars.com');
  const [phone, setPhone] = useState('+966 502 123 456');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');

  // Fetch admin data when component mounts
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/sign-in');
      return;
    }

    // Get user data from localStorage
    const username = localStorage.getItem('username') || 'Admin User';
    const userEmail = localStorage.getItem('email') || 'admin@zjcars.com';
    const userPhone = localStorage.getItem('phone') || '+966 502 123 456';
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
      <Grid container spacing={isMobile ? 2 : 3}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              borderRadius: 2,
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Profile Information
              </Typography>
              
              <IconButton 
                color="primary" 
                onClick={() => setIsEditing(!isEditing)}
                sx={{ bgcolor: isEditing ? 'rgba(25, 118, 210, 0.1)' : 'transparent' }}
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
                  bgcolor: '#ffeb3b',
                  color: '#333'
                }}
              >
                {name ? name.charAt(0).toUpperCase() : 'A'}
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
              
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{name}</Typography>
              <Typography variant="body1" color="text.secondary">Administrator</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
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
                />
              </Grid>
            </Grid>
            
            {isEditing && (
              <Button
                variant="contained"
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
              height: '100%'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Security Settings
            </Typography>
            
            <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Lock sx={{ mr: 1 }} /> Change Password
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
                />
              </Grid>
            </Grid>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleChangePassword}
              sx={{ mt: 3 }}
              disabled={!currentPassword || !newPassword || !confirmPassword || loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
            
            <Divider sx={{ my: 3 }} />
            
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

export default AdminProfile;