import React from 'react';
import { Typography, Box } from '@mui/material';

const ManageOrders: React.FC = () => {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">Manage Orders</Typography>
      <Typography>Here you can manage customer orders.</Typography>
    </Box>
  );
};

export default ManageOrders;