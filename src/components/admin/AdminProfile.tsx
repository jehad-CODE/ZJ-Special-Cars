import React, { useState } from 'react';
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
  Alert
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

const AdminProfile: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
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

  // Handle save profile
  const handleSaveProfile = () => {
    // Here you would typically save the data to your backend
    setIsEditing(false);
    setSnackbarMessage('Profile updated successfully!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  // Handle password change
  const handleChangePassword = () => {
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
    
    // Here you would typically call an API to change the password
    setSnackbarMessage('Password changed successfully!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Admin Profile {isMobile ? '(Mobile View)' : ''}
      </Typography>
      
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
                <Person sx={{ fontSize: isMobile ? 48 : 60 }} />
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
                startIcon={<Save />}
                fullWidth
                onClick={handleSaveProfile}
                sx={{ mt: 3 }}
              >
                Save Changes
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
              disabled={!currentPassword || !newPassword || !confirmPassword}
            >
              Update Password
            </Button>
            
            <Divider sx={{ my: 3 }} />
            
          </Paper>
        </Grid>
        
        {/* Additional Information */}
        <Grid item xs={12}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              borderRadius: 2
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Admin Information
            </Typography>
            
            <Grid container spacing={isMobile ? 2 : 3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    42
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cars Managed
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                    18
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Users Managed
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    7
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Reviews
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                    3
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Payment Issues
                  </Typography>
                </Box>
              </Grid>
            </Grid>
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