import React from 'react';
import { Typography, Box } from '@mui/material';

const CheckPaymentStatus: React.FC = () => {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">Check Payment Status</Typography>
      <Typography>Here you can check and verify payment status for orders.</Typography>
    </Box>
  );
};

export default CheckPaymentStatus;