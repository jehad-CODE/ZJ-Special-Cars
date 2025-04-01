import React from 'react';
import { Typography, Box } from '@mui/material';

const ManageUsers: React.FC = () => {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">Manage Users</Typography>
      <Typography>Here you can manage the users in the system.</Typography>
    </Box>
  );
};

export default ManageUsers;