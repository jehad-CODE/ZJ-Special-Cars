// StaffDashboard.tsx
import React, { useState } from 'react';
import { Box, Button, Typography, IconButton, Toolbar } from '@mui/material';
import { Logout, Assignment, Receipt, LocalShipping, ShoppingCart } from '@mui/icons-material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { Link } from 'react-router-dom'; // Import Link for navigation

import CheckPaymentStatus from './CheckPaymentStatus';
import GenerateReports from './GenerateReports';
import ManageDelivery from './ManageDelivery';
import ManageOrders from './ManageOrders';

const StaffDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('CheckPaymentStatus');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Top Nav */}
      <Box sx={{
        backgroundColor: '#333',
        color: 'white',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Toolbar sx={{ minHeight: '64px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Car Icon */}
            <DirectionsCarIcon sx={{ color: '#ffeb3b', fontSize: '40px', marginRight: '10px' }} />
            {/* Brand Name */}
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 'bold',
                color: '#ffeb3b', // Yellow color for the brand name
                fontSize: '1.5rem',
              }}
            >
              ZJ SPECIAL CARS
            </Typography>
          </Box>
        </Toolbar>
        {/* Sign Out Icon */}
        <IconButton
          component={Link}
          to="/sign-in" // Redirect to sign-in page
          sx={{
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
          }}
        >
          <Logout sx={{ color: 'white' }} />
        </IconButton>
      </Box>

      {/* Main Body */}
      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <Box sx={{
          width: '250px',
          backgroundColor: '#333',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '20px',
        }}>
          <Button
            onClick={() => setActiveSection('CheckPaymentStatus')}
            sx={{
              color: 'white',
              width: '90%',
              margin: '10px auto',
              padding: '15px 20px',
              borderRadius: '10px',
              transition: 'all 0.3s ease',
              backgroundColor: activeSection === 'CheckPaymentStatus' ? '#555' : 'transparent',
              '&:hover': {
                backgroundColor: '#555',
                transform: 'translateX(10px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              },
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
            startIcon={<Assignment />}
          >
            Check Payment Status
          </Button>
          <Button
            onClick={() => setActiveSection('GenerateReports')}
            sx={{
              color: 'white',
              width: '90%',
              margin: '10px auto',
              padding: '15px 20px',
              borderRadius: '10px',
              transition: 'all 0.3s ease',
              backgroundColor: activeSection === 'GenerateReports' ? '#555' : 'transparent',
              '&:hover': {
                backgroundColor: '#555',
                transform: 'translateX(10px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              },
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
            startIcon={<Receipt />}
          >
            Generate Reports
          </Button>
          <Button
            onClick={() => setActiveSection('ManageDelivery')}
            sx={{
              color: 'white',
              width: '90%',
              margin: '10px auto',
              padding: '15px 20px',
              borderRadius: '10px',
              transition: 'all 0.3s ease',
              backgroundColor: activeSection === 'ManageDelivery' ? '#555' : 'transparent',
              '&:hover': {
                backgroundColor: '#555',
                transform: 'translateX(10px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              },
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
            startIcon={<LocalShipping />}
          >
            Manage Delivery
          </Button>
          <Button
            onClick={() => setActiveSection('ManageOrders')}
            sx={{
              color: 'white',
              width: '90%',
              margin: '10px auto',
              padding: '15px 20px',
              borderRadius: '10px',
              transition: 'all 0.3s ease',
              backgroundColor: activeSection === 'ManageOrders' ? '#555' : 'transparent',
              '&:hover': {
                backgroundColor: '#555',
                transform: 'translateX(10px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              },
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
            startIcon={<ShoppingCart />}
          >
            Manage Orders
          </Button>
        </Box>

        {/* Content Area (Right Side) */}
        <Box sx={{ flexGrow: 1, padding: 2 }}>
          {activeSection === 'CheckPaymentStatus' && <CheckPaymentStatus />}
          {activeSection === 'GenerateReports' && <GenerateReports />}
          {activeSection === 'ManageDelivery' && <ManageDelivery />}
          {activeSection === 'ManageOrders' && <ManageOrders />}
        </Box>
      </Box>
    </Box>
  );
};

export default StaffDashboard;

