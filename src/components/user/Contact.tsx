import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const Contact: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100vh', // Take full viewport height
        backgroundColor: '#000', // Black background
        color: '#fff', // White text
        padding: 4,
        overflowY: 'scroll', // Enable vertical scrolling
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          maxWidth: 600,
          width: '70%',
          textAlign: 'center',
          backgroundColor: '#1c1c1c',
          color: 'white',
          mb: 4,
          borderRadius: 3,
        }}
      >
        
        <Typography variant="h5" color="gray" gutterBottom>
          Get in touch with us for more information.
        </Typography>

        {/* Contact Information */}
        <Box sx={{ mt: 2, textAlign: 'left' }}>
          <Typography variant="h6">📧 Emails:</Typography>
          <Typography color="gray">Jahad.shaheen@final.edu.tr</Typography>
          <Typography color="gray">Zain.zaghmout@final.edu.tr</Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>📞 Phone:</Typography>
          <Typography color="gray">+966 502 666 898</Typography>
        </Box>
      </Paper>

      {/* Google Map Embed for Final International University, Girne */}
      <Paper elevation={4} sx={{ width: '90%', maxWidth: 600, height: 300, borderRadius: 3, mb: 4 }}>
        <iframe
          title="Google Map"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0, borderRadius: 8 }}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3264.889827770969!2d33.3333!3d35.3333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14dc3775f4b4f4d5%3A0x99e3a378e5673a2b!2sFinal%20International%20University!5e0!3m2!1sen!2sus!4v1712088123456"
          allowFullScreen
        ></iframe>
      </Paper>
    </Box>
  );
};

export default Contact;
