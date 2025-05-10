import React from 'react';
import { Typography, Box } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundImage: 'url(/src/assets/ZjUserBackground.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: { xs: 'scroll', md: 'fixed' }, // Fixed on desktop, scroll on mobile
        minHeight: '100vh',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
        paddingTop: { xs: 2, sm: 3, md: 4 },
        px: { xs: 2, sm: 3 },
        position: 'relative',
        // Mobile-specific background fixes
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/src/assets/ZjUserBackground.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -1,
          // Ensure background covers entire viewport on mobile
          minHeight: '100vh',
          width: '100%',
        },
        // Fallback for older browsers
        '@media (max-width: 600px)': {
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
        }
      }}
    >
      <Box
        sx={{
          width: { xs: '90%', sm: '75%', md: '65%', lg: '55%' },
          maxWidth: '800px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: { xs: 2, sm: 3, md: 4 },
          textAlign: 'center',
          marginTop: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          backdropFilter: 'blur(5px)', // Added blur effect for better readability
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography 
          variant="h3" 
          gutterBottom
          sx={{
            fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 'bold',
          }}
        >
          About Us
        </Typography>
        <Typography 
          variant="body1"
          sx={{
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            lineHeight: 1.6,
          }}
        >
          ZJ Special Cars is your destination for buying and selling unique and high-performance vehicles. We pride ourselves on offering the best selection of luxury and specialty cars.
        </Typography>
      </Box>

      {/* Spacer to push the rest of the content down */}
      <Box sx={{ flex: 1 }} />
    </Box>
  );
};

export default Home;