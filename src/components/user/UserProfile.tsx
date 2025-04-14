import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';

const UserProfile: React.FC = () => {
  const [name, setName] = useState('Jehad Shaheen');
  const [email, setEmail] = useState('jehad@example.com');
  const [password, setPassword] = useState('');

  const handleSave = () => {
    // TODO: Connect to backend API to update user profile
    alert('Profile updated successfully!');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500 }}>
        <Typography variant="h5" gutterBottom>
          Edit Profile
        </Typography>

        <TextField
          fullWidth
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button variant="contained" fullWidth onClick={handleSave}>
          Save Changes
        </Button>
      </Paper>
    </Box>
  );
};

export default UserProfile;
