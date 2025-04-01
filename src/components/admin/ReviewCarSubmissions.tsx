import React from 'react';
import { Typography, Box } from '@mui/material';

const ReviewCarSubmissions: React.FC = () => {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">Review Car Submissions</Typography>
      <Typography>Here you can review and approve/reject car sale submissions.</Typography>
    </Box>
  );
};

export default ReviewCarSubmissions;