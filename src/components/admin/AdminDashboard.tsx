import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Dashboard, CarRepair, PeopleAlt, AddCircle, Settings, ShoppingCart, Payment } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import Logout from '@mui/icons-material/Logout';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

// Example Pages for Admin
import ManageCars from './ManageCars';
import ManageUsers from './ManageUsers';
import ManageAccessories from './ManageAccessories';
import ReviewCarSubmissions from './ReviewCarSubmissions';
import TrackPurchases from './TrackPurchases';
import ManageDelivery from './ManageDelivery';
import CheckPaymentStatus from './CheckPaymentStatus';

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('ManageUsers');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Top Nav */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor:'#333'}}>
        {/* Car Icon */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DirectionsCarIcon sx={{ color: '#ffeb3b', fontSize: '40px', marginRight: '10px' }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: '#ffeb3b',
              fontSize: '1.5rem',
            }}
          >
            ZJ SPECIAL CARS
          </Typography>
        </Box>

        {/* Sign Out Button (Top-Right of the Top Bar) */}
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
          width: '300px',
          backgroundColor: '#333',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '20px',
        }}>
          <Button
            onClick={() => setActiveSection('ManageUsers')}
            sx={{
              color: 'white',
              width: '100%',
              margin: '10px 0',
              padding: '15px 20px',
              borderRadius: '10px',
              transition: 'all 0.3s ease',
              backgroundColor: activeSection === 'ManageUsers' ? '#555' : 'transparent',
              '&:hover': {
                backgroundColor: '#555',
                transform: 'translateX(10px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '15px',
            }}
            startIcon={<PeopleAlt sx={{ fontSize: 30, color: '#ffb6b9' }} />}
          >
            <Typography variant="body1" sx={{ fontSize: '16px' }}>Manage Users</Typography>
          </Button>

          <Button
            onClick={() => setActiveSection('ManageCars')}
            sx={{
              color: 'white',
              width: '100%',
              margin: '10px 0',
              padding: '15px 20px',
              borderRadius: '10px',
              transition: 'all 0.3s ease',
              backgroundColor: activeSection === 'ManageCars' ? '#555' : 'transparent',
              '&:hover': {
                backgroundColor: '#555',
                transform: 'translateX(10px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '15px',
            }}
            startIcon={<CarRepair sx={{ fontSize: 30, color: '#86c232' }} />}
          >
            <Typography variant="body1" sx={{ fontSize: '16px' }}>Manage Cars</Typography>
          </Button>

          <Button
            onClick={() => setActiveSection('ManageAccessories')}
            sx={{
              color: 'white',
              width: '100%',
              margin: '10px 0',
              padding: '15px 20px',
              borderRadius: '10px',
              transition: 'all 0.3s ease',
              backgroundColor: activeSection === 'ManageAccessories' ? '#555' : 'transparent',
              '&:hover': {
                backgroundColor: '#555',
                transform: 'translateX(10px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '15px',
            }}
            startIcon={<AddCircle sx={{ fontSize: 30, color: '#ff6347' }} />}
          >
            <Typography variant="body1" sx={{ fontSize: '16px' }}>Manage Accessories</Typography>
          </Button>

          <Button
            onClick={() => setActiveSection('ReviewCarSubmissions')}
            sx={{
              color: 'white',
              width: '100%',
              margin: '10px 0',
              padding: '15px 20px',
              borderRadius: '10px',
              transition: 'all 0.3s ease',
              backgroundColor: activeSection === 'ReviewCarSubmissions' ? '#555' : 'transparent',
              '&:hover': {
                backgroundColor: '#555',
                transform: 'translateX(10px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '15px',
            }}
            startIcon={<Dashboard sx={{ fontSize: 30, color: '#32cd32' }} />}
          >
            <Typography variant="body1" sx={{ fontSize: '16px' }}>Review Car Submissions</Typography>
          </Button>

          <Button
            onClick={() => setActiveSection('TrackPurchases')}
            sx={{
              color: 'white',
              width: '100%',
              margin: '10px 0',
              padding: '15px 20px',
              borderRadius: '10px',
              transition: 'all 0.3s ease',
              backgroundColor: activeSection === 'TrackPurchases' ? '#555' : 'transparent',
              '&:hover': {
                backgroundColor: '#555',
                transform: 'translateX(10px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '15px',
            }}
            startIcon={<ShoppingCart sx={{ fontSize: 30, color: '#add8e6' }} />}
          >
            <Typography variant="body1" sx={{ fontSize: '16px' }}>Track Purchases</Typography>
          </Button>

          <Button
            onClick={() => setActiveSection('CheckPaymentStatus')}
            sx={{
              color: 'white',
              width: '100%',
              margin: '10px 0',
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
              justifyContent: 'flex-start',
              gap: '15px',
            }}
            startIcon={<Payment sx={{ fontSize: 30, color: '#f39c12' }} />}
          >
            <Typography variant="body1" sx={{ fontSize: '16px' }}>Check Payment Status</Typography>
          </Button>

          <Button
            onClick={() => setActiveSection('ManageDelivery')}
            sx={{
              color: 'white',
              width: '100%',
              margin: '10px 0',
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
              justifyContent: 'flex-start',
              gap: '15px',
            }}
            startIcon={<Settings sx={{ fontSize: 30, color: '#8e44ad' }} />}
          >
            <Typography variant="body1" sx={{ fontSize: '16px' }}>Manage Delivery</Typography>
          </Button>
        </Box>

        {/* Content Area (Right Side) */}
        <Box sx={{ flexGrow: 1, padding: 2 }}>
          {activeSection === 'ManageUsers' && <ManageUsers />}
          {activeSection === 'ManageCars' && <ManageCars />}
          {activeSection === 'ManageAccessories' && <ManageAccessories />}
          {activeSection === 'ReviewCarSubmissions' && <ReviewCarSubmissions />}
          {activeSection === 'TrackPurchases' && <TrackPurchases />}
          {activeSection === 'CheckPaymentStatus' && <CheckPaymentStatus />}
          {activeSection === 'ManageDelivery' && <ManageDelivery />}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
