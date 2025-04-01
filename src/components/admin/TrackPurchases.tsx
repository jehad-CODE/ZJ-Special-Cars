import React from 'react';
import { Typography, Box } from '@mui/material';

const TrackPurchases: React.FC = () => {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">Track Purchases</Typography>
      <Typography>Here you can track user purchase history.</Typography>
    </Box>
  );
};

export default TrackPurchases;