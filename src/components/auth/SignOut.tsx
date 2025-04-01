import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignOut: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear authentication data (Modify according to your auth method)
    localStorage.removeItem('token'); // Example: Remove token
    navigate('/auth/sign-in'); // Redirect to sign-in page
  }, [navigate]);

  return null; // No UI needed, just handle logout
};

export default SignOut;
