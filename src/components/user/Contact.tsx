import React from 'react';
import { Typography, Box } from '@mui/material'; // Add Box to the import

const Contact: React.FC = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="h5" color="textSecondary">
        Get in touch with us for more information.
      </Typography>
    </Box>
  );
};

export default Contact;