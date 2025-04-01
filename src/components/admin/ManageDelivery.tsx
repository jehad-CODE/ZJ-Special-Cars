import React from 'react';
import { Typography, Box } from '@mui/material';

const ManageDelivery: React.FC = () => {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">Manage Delivery</Typography>
      <Typography>Here you can manage delivery status for orders.</Typography>
    </Box>
  );
};

export default ManageDelivery;