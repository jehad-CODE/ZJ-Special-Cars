import React from 'react';
import { Typography, Box, Paper, Grid, useMediaQuery, useTheme } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Contact: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#fff',
        padding: { xs: 2, sm: 3, md: 4 },
        overflowY: 'auto',
      }}
    >
      <Typography 
        variant={isMobile ? "h4" : "h3"} 
        sx={{ 
          fontWeight: 'bold', 
          mb: 4, 
          mt: 2,
          textAlign: 'center'
        }}
      >
        Contact Us
      </Typography>

      <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: 1000 }}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={4}
            sx={{
              padding: { xs: 2, sm: 3, md: 4 },
              backgroundColor: '#1c1c1c',
              color: 'white',
              borderRadius: 3,
              height: '100%',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
              Get in touch
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">Email</Typography>
                <Typography color="gray" sx={{ wordBreak: 'break-word' }}>
                  Jahad.shaheen@final.edu.tr
                </Typography>
                <Typography color="gray" sx={{ wordBreak: 'break-word' }}>
                  Zain.zaghmout@final.edu.tr
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">Phone</Typography>
                <Typography color="gray">+966 502 666 898</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOnIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">Address</Typography>
                <Typography color="gray">Final International University</Typography>
                <Typography color="gray">Girne, North Cyprus</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            elevation={4} 
            sx={{ 
              borderRadius: 3, 
              overflow: 'hidden',
              height: { xs: '300px', md: '100%' },
              minHeight: '300px'
            }}
          >
            <iframe
              title="Google Map"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3264.889827770969!2d33.3333!3d35.3333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14dc3775f4b4f4d5%3A0x99e3a378e5673a2b!2sFinal%20International%20University!5e0!3m2!1sen!2sus!4v1712088123456"
              allowFullScreen
            ></iframe>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Contact;