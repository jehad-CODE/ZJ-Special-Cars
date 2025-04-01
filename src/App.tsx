import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from './theme';

// User Side Components
import UserDashboard from './components/user/Dashboard';
import Home from './components/user/Home';
import Menu from './components/user/Menu';
import SellYourCar from './components/user/SellYourCar';
import Contact from './components/user/Contact';
import AboutUs from './components/user/AboutUs';

// Admin Side Components
import AdminDashboard from './components/admin/AdminDashboard';
import ManageCars from './components/admin/ManageCars';
import ManageUsers from './components/admin/ManageUsers';
import ManageAccessories from './components/admin/ManageAccessories';
import ReviewCarSubmissions from './components/admin/ReviewCarSubmissions';
import TrackPurchases from './components/admin/TrackPurchases';
import ManageDelivery from './components/admin/ManageDelivery';
import CheckPaymentStatus from './components/admin/CheckPaymentStatus';

// Staff Side Components
import StaffDashboard from './components/staff/StaffDashboard';
import ManageOrders from './components/staff/ManageOrders';
import GenerateReports from './components/staff/GenerateReports';

//auth
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp'; 
import SignOut from './components/auth/SignOut'; // Add this import

// Car Category Components
import Sport from './components/user/menu/sport';
import Classic from './components/user/menu/classic';
import HybridElectric from './components/user/menu/hybrid-electric';
import LifeProduct from './components/user/menu/life-product';
import CarsAccessories from './components/user/menu/cars-accessories';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* User Side Routes */}
          <Route path="/" element={<UserDashboard />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="menu/sport" element={<Sport />} />
            <Route path="menu/classic" element={<Classic />} />
            <Route path="menu/hybrid-electric" element={<HybridElectric />} />
            <Route path="menu/life-product" element={<LifeProduct />} /> {/* New route */}
            <Route path="menu/cars-accessories" element={<CarsAccessories />} /> {/* New route */}
            <Route path="sell-your-car" element={<SellYourCar />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about-us" element={<AboutUs />} />
          </Route>

          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-out" element={<SignOut />} /> {/* Add the sign-out route */}

          {/* Admin Side Routes */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="manage-cars" element={<ManageCars />} />
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="manage-accessories" element={<ManageAccessories />} />
            <Route path="review-car-submissions" element={<ReviewCarSubmissions />} />
            <Route path="track-purchases" element={<TrackPurchases />} />
            <Route path="manage-delivery" element={<ManageDelivery />} />
            <Route path="check-payment-status" element={<CheckPaymentStatus />} />
          </Route>

          {/* Staff Side Routes */}
          <Route path="/staff" element={<StaffDashboard />}>
            <Route path="manage-orders" element={<ManageOrders />} />
            <Route path="generate-reports" element={<GenerateReports />} />
            <Route path="manage-delivery" element={<ManageDelivery />} />
            <Route path="check-payment-status" element={<CheckPaymentStatus />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
