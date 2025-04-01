import React from 'react';
import { Typography, Box } from '@mui/material'; // Add Box to the import

const AboutUs: React.FC = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        About Us
      </Typography>
      <Typography variant="h5" color="textSecondary">
        Learn more about ZJ Special Cars and our mission.
      </Typography>
    </Box>
  );
};

export default AboutUs;