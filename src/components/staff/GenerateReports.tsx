import React from 'react';
import { Typography, Box } from '@mui/material';

const GenerateReports: React.FC = () => {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">Generate Reports</Typography>
      <Typography>Here you can generate reports on sales, inventory, and user activity.</Typography>
    </Box>
  );
};

export default GenerateReports;