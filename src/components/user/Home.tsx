import React from 'react';
import { Typography, Box } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundImage: 'url(/src/assets/ZjUserBackground.jpg)', // Path to your background image
        backgroundSize: 'cover', // Ensure the background covers the entire page
        backgroundPosition: 'center', // Center the background image
        backgroundRepeat: 'no-repeat', // Prevent the background from repeating
        minHeight: '100vh', // Make the Box take up the full viewport height
        width: '100vw', // Make the Box take up the full viewport width
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start', // Align content to the top
        alignItems: 'center', // Center content horizontally
        color: 'white', // Set text color to white
        textAlign: 'center', // Center-align text
        paddingTop: 4, // Add some padding at the top
      }}
    >
      {/* About Us Section (Top Center) */}
      <Box
        sx={{
          width: '55%', // Take up 70% of the width
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black background
          padding: 1, // Add padding
          textAlign: 'center',
          marginTop: 4, // Add some margin at the top
        }}
      >
        <Typography variant="h3" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1">
          ZJ Special Cars is your destination for buying and selling unique and high-performance vehicles. We pride ourselves on offering the best selection of luxury and specialty cars.
        </Typography>
      </Box>

      {/* Spacer to push the rest of the content down */}
      <Box sx={{ flex: 1 }} />
    </Box>
  );
};

export default Home;