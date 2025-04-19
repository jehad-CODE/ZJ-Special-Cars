import React, { useState } from 'react';
import {
  Typography, Box, Grid, Card, CardContent, CardMedia, Button, Pagination,
  Stack, Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

// Define car submission interface matching SellYourCar form
interface CarSubmission {
  id: number;
  name: string;
  model: string;
  year: number;
  mileage: string;
  color: string;
  gearType: string;
  type: string;
  details: string;
  phone: string;
  email: string;
  image: string;
}

// Sample car submissions data
const submittedCars: CarSubmission[] = [
  {
    id: 1, name: 'Mustang GT', model: 'GT500', year: 2020, mileage: '25,000',
    color: 'Red', gearType: 'Automatic', type: 'Sport',
    details: 'Very clean, no accidents. Imported from the US with all service records available.',
    phone: '123-456-7890', email: 'seller@example.com', image: '/src/assets/ZjUserBackground.jpg'
  },
  {
    id: 2, name: 'Classic Beetle', model: 'Beetle', year: 1975, mileage: '80,000',
    color: 'Blue', gearType: 'Manual', type: 'Classic',
    details: 'Collector condition, fully restored with original parts. New paint job.',
    phone: '987-654-3210', email: 'classiclover@example.com', image: '/src/assets/ZjUserBackground.jpg'
  },
  {
    id: 3, name: 'Tesla', model: 'Model S', year: 2022, mileage: '15,000',
    color: 'White', gearType: 'Automatic', type: 'Hybrid/Electric',
    details: 'Excellent condition, fully loaded with autopilot and premium interior package.',
    phone: '555-123-4567', email: 'electric@example.com', image: '/src/assets/ZjUserBackground.jpg'
  }
];

const ReviewCarSubmissions: React.FC = () => {
  const [cars, setCars] = useState<CarSubmission[]>(submittedCars);
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>('All');
  const [detailDialog, setDetailDialog] = useState<boolean>(false);
  const [selectedCar, setSelectedCar] = useState<CarSubmission | null>(null);
  const itemsPerPage = 6;

  const handleAccept = (id: number) => {
    // In a real app, you would call an API to approve the car listing
    if (window.confirm('Are you sure you want to approve this car listing?')) {
      alert(`Car with ID ${id} has been approved and published!`);
      setCars((prev) => prev.filter((car) => car.id !== id));
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to reject this submission?')) {
      setCars((prev) => prev.filter((car) => car.id !== id));
    }
  };

  const handleViewDetails = (car: CarSubmission) => {
    setSelectedCar(car);
    setDetailDialog(true);
  };

  const filteredCars = filter === 'All' ? cars : cars.filter((car) => car.type === filter);
  const paginatedCars = filteredCars.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        Review Car Submissions
      </Typography>

      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={1} 
        sx={{ mb: 3, flexWrap: 'wrap' }}
      >
        {['All', 'Sport', 'Classic', 'Hybrid/Electric'].map((type) => (
          <Button 
            key={type} 
            variant={filter === type ? 'contained' : 'outlined'} 
            onClick={() => { setFilter(type); setPage(1); }}
            sx={{ mb: 1 }}
          >
            {type}
          </Button>
        ))}
      </Stack>

      {paginatedCars.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', my: 4 }}>
          No car submissions to review at this time.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {paginatedCars.map((car) => (
            <Grid item xs={12} sm={6} md={4} key={car.id}>
              <Card sx={{ 
                borderRadius: 2, 
                boxShadow: 2, 
                height: '100%',
                backgroundColor: '#1c1c1c',
                color: 'white',
                display: 'flex', 
                flexDirection: 'column' 
              }}>
                <CardMedia
                  component="img"
                  image={car.image}
                  alt={car.name}
                  sx={{ height: 160, objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" noWrap>
                    {car.name} - {car.model}
                  </Typography>
                  <Typography variant="body2">
                    Year: {car.year} | Mileage: {car.mileage}
                  </Typography>
                  <Typography variant="body2">
                    Type: {car.type} | Color: {car.color}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, mb: 1, color: 'gray' }} noWrap>
                    {car.details}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewDetails(car)}
                    sx={{ mb: 1 }}
                  >
                    View Details
                  </Button>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleAccept(car.id)}
                      sx={{ flex: 1 }}
                    >
                      Approve
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(car.id)}
                      sx={{ flex: 1 }}
                    >
                      Reject
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {filteredCars.length > itemsPerPage && (
        <Pagination
          count={Math.ceil(filteredCars.length / itemsPerPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
          sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
        />
      )}

      {/* Car Details Dialog */}
      <Dialog 
        open={detailDialog} 
        onClose={() => setDetailDialog(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            borderRadius: 2
          }
        }}
      >
        {selectedCar && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">
                {selectedCar.name} {selectedCar.model} ({selectedCar.year})
              </Typography>
              <IconButton onClick={() => setDetailDialog(false)} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            
            <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <img 
                    src={selectedCar.image} 
                    alt={selectedCar.name} 
                    style={{ width: '100%', borderRadius: '8px', marginBottom: '16px' }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="bold">Car Information</Typography>
                  <Typography variant="body2">Name: {selectedCar.name}</Typography>
                  <Typography variant="body2">Model: {selectedCar.model}</Typography>
                  <Typography variant="body2">Year: {selectedCar.year}</Typography>
                  <Typography variant="body2">Mileage: {selectedCar.mileage}</Typography>
                  <Typography variant="body2">Color: {selectedCar.color}</Typography>
                  <Typography variant="body2">Type: {selectedCar.type}</Typography>
                  <Typography variant="body2">Gear Type: {selectedCar.gearType}</Typography>
                  
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>Seller Contact</Typography>
                  <Typography variant="body2">Email: {selectedCar.email}</Typography>
                  <Typography variant="body2">Phone: {selectedCar.phone}</Typography>
                  
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>Description</Typography>
                  <Typography variant="body2">{selectedCar.details}</Typography>
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={() => {
                  handleDelete(selectedCar.id);
                  setDetailDialog(false);
                }}
                startIcon={<DeleteIcon />}
              >
                Reject
              </Button>
              <Button 
                variant="contained" 
                color="success"
                onClick={() => {
                  handleAccept(selectedCar.id);
                  setDetailDialog(false);
                }}
                startIcon={<CheckCircleIcon />}
              >
                Approve & Publish
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ReviewCarSubmissions;