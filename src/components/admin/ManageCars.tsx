import React from 'react';
import { Typography, Box } from '@mui/material';

const ManageCars: React.FC = () => {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">Manage Cars</Typography>
      <Typography>Here you can manage the cars in the system.</Typography>
    </Box>
  );
};

export default ManageCars;