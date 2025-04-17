import React, { useState } from 'react';
import { 
  Box, Button, Typography, useMediaQuery, useTheme, 
  Drawer, IconButton, Divider, Avatar
} from '@mui/material';
import { 
  Dashboard, CarRepair, PeopleAlt, AddCircle, 
  Settings, Payment, Menu, Close, Person
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Logout from '@mui/icons-material/Logout';

// Example Pages for Admin
import ManageCars from './ManageCars';
import ManageUsers from './ManageUsers';
import ManageAccessories from './ManageAccessories';
import ReviewCarSubmissions from './ReviewCarSubmissions';
import CheckPaymentStatus from './CheckPaymentStatus';
import AdminProfile from './AdminProfile'; 

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('ManageUsers');
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawerContent = (
    <Box sx={{
      height: '100%',
      backgroundColor: '#222', // Darker grey for drawer background
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>
      )}
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 3 }}>
        <Avatar sx={{ width: 60, height: 60, bgcolor: '#ffeb3b', color: '#333', mb: 1 }}>
          <Person fontSize="large" />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Admin Panel</Typography>
      </Box>
      
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 1 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, flex: 1, overflowY: 'auto' }}>
        <Button
          onClick={() => handleNavClick('ManageUsers')}
          sx={{
            color: 'white',
            width: '100%',
            margin: '6px 0',
            padding: '12px 16px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            backgroundColor: activeSection === 'ManageUsers' ? '#444' : 'transparent',
            '&:hover': {
              backgroundColor: '#444',
              transform: isMobile ? 'none' : 'translateX(8px)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '12px',
          }}
          startIcon={<PeopleAlt sx={{ fontSize: 24, color: '#ffb6b9' }} />}
        >
          <Typography variant="body1" sx={{ fontSize: '15px' }}>Manage Users</Typography>
        </Button>

        <Button
          onClick={() => handleNavClick('ManageCars')}
          sx={{
            color: 'white',
            width: '100%',
            margin: '6px 0',
            padding: '12px 16px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            backgroundColor: activeSection === 'ManageCars' ? '#444' : 'transparent',
            '&:hover': {
              backgroundColor: '#444',
              transform: isMobile ? 'none' : 'translateX(8px)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '12px',
          }}
          startIcon={<CarRepair sx={{ fontSize: 24, color: '#86c232' }} />}
        >
          <Typography variant="body1" sx={{ fontSize: '15px' }}>Manage Cars</Typography>
        </Button>

        <Button
          onClick={() => handleNavClick('ManageAccessories')}
          sx={{
            color: 'white',
            width: '100%',
            margin: '6px 0',
            padding: '12px 16px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            backgroundColor: activeSection === 'ManageAccessories' ? '#444' : 'transparent',
            '&:hover': {
              backgroundColor: '#444',
              transform: isMobile ? 'none' : 'translateX(8px)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '12px',
          }}
          startIcon={<AddCircle sx={{ fontSize: 24, color: '#ff6347' }} />}
        >
          <Typography variant="body1" sx={{ fontSize: '15px' }}>Manage Accessories</Typography>
        </Button>

        <Button
          onClick={() => handleNavClick('ReviewCarSubmissions')}
          sx={{
            color: 'white',
            width: '100%',
            margin: '6px 0',
            padding: '12px 16px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            backgroundColor: activeSection === 'ReviewCarSubmissions' ? '#444' : 'transparent',
            '&:hover': {
              backgroundColor: '#444',
              transform: isMobile ? 'none' : 'translateX(8px)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '12px',
          }}
          startIcon={<Dashboard sx={{ fontSize: 24, color: '#32cd32' }} />}
        >
          <Typography variant="body1" sx={{ fontSize: '15px' }}>Review Submissions</Typography>
        </Button>

        <Button
          onClick={() => handleNavClick('CheckPaymentStatus')}
          sx={{
            color: 'white',
            width: '100%',
            margin: '6px 0',
            padding: '12px 16px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            backgroundColor: activeSection === 'CheckPaymentStatus' ? '#444' : 'transparent',
            '&:hover': {
              backgroundColor: '#444',
              transform: isMobile ? 'none' : 'translateX(8px)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '12px',
          }}
          startIcon={<Payment sx={{ fontSize: 24, color: '#f39c12' }} />}
        >
          <Typography variant="body1" sx={{ fontSize: '15px' }}>Check Payments</Typography>
        </Button>

        <Button
          onClick={() => handleNavClick('AdminProfile')}
          sx={{
            color: 'white',
            width: '100%',
            margin: '6px 0',
            padding: '12px 16px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            backgroundColor: activeSection === 'AdminProfile' ? '#444' : 'transparent',
            '&:hover': {
              backgroundColor: '#444',
              transform: isMobile ? 'none' : 'translateX(8px)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '12px',
          }}
          startIcon={<Settings sx={{ fontSize: 24, color: '#8e44ad' }} />}
        >
          <Typography variant="body1" sx={{ fontSize: '15px' }}>Admin Profile</Typography>
        </Button>
      </Box>
      
      
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#1a1a1a' }}>
      {/* Top Nav */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '10px', 
        backgroundColor: '#222'
      }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            component="img"
            src="/src/assets/ZJlogo.png"
            alt="ZJ Special Cars Logo"
            sx={{ 
              height: { xs: 40, sm: 50 },
              mr: 1
            }}
          />
        </Box>

        {/* Mobile Menu Toggle */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ color: 'white' }}
          >
            <Menu />
          </IconButton>
        )}

        {!isMobile && (
          <IconButton
            component={Link}
            to="/sign-in"
            sx={{
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            }}
          >
            <Logout />
          </IconButton>
        )}
      </Box>

      {/* Main Body */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar - Desktop Permanent, Mobile Temporary */}
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': { 
                width: 280,
                boxShadow: '4px 0 10px rgba(0,0,0,0.5)',
              },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Box sx={{ 
            width: 280,
            flexShrink: 0,
            height: 'calc(100vh - 70px)', 
          }}>
            {drawerContent}
          </Box>
        )}

        {/* Content Area */}
        <Box sx={{ 
          flexGrow: 1, 
          p: { xs: 1, sm: 2, md: 3 },
          overflow: 'auto', 
          height: 'calc(100vh - 70px)',
          backgroundColor: '#1e1e1e'
        }}>
          {activeSection === 'ManageUsers' && <ManageUsers />}
          {activeSection === 'ManageCars' && <ManageCars />}
          {activeSection === 'ManageAccessories' && <ManageAccessories />}
          {activeSection === 'ReviewCarSubmissions' && <ReviewCarSubmissions />}
          {activeSection === 'CheckPaymentStatus' && <CheckPaymentStatus />}
          {activeSection === 'AdminProfile' && <AdminProfile />}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;