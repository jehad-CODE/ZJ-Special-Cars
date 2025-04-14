'use client';

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CardActions,
  Button,
  Stack,
  Pagination,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

const submittedCars = [
  {
    id: 1,
    name: 'Mustang GT',
    model: 'GT500',
    year: 2020,
    mileage: '25,000',
    color: 'Red',
    gearType: 'Automatic',
    type: 'Sport',
    details: 'Very clean, no accidents. Imported.',
    phone: '123456789',
    email: 'seller@example.com',
    image: '/images/cars/mustang.jpg',
  },
  {
    id: 2,
    name: 'Classic Beetle',
    model: 'Beetle',
    year: 1975,
    mileage: '80,000',
    color: 'Blue',
    gearType: 'Manual',
    type: 'Classic',
    details: 'Collector condition, fully restored.',
    phone: '987654321',
    email: 'classiclover@example.com',
    image: '/images/cars/beetle.jpg',
  },
  // Add more mock cars...
];

const ManageCarSubmissions = () => {
  const [cars, setCars] = useState(submittedCars);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('All');
  const itemsPerPage = 6;

  const handleAccept = (id: number) => {
    alert(`Car with ID ${id} accepted!`);
    setCars((prev) => prev.filter((car) => car.id !== id));
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      setCars((prev) => prev.filter((car) => car.id !== id));
    }
  };

  const filteredCars = filter === 'All' ? cars : cars.filter((car) => car.type === filter);
  const paginatedCars = filteredCars.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Stack spacing={4} p={4}>
      <Typography variant="h4" fontWeight="bold">
        Manage Car Submissions
      </Typography>

      <Stack direction="row" spacing={2}>
        {['All', 'Sport', 'Classic', 'Hybrid/Electric'].map((type) => (
          <Button
            key={type}
            variant={filter === type ? 'contained' : 'outlined'}
            onClick={() => {
              setFilter(type);
              setPage(1);
            }}
          >
            {type}
          </Button>
        ))}
      </Stack>

      <Grid container spacing={3}>
        {paginatedCars.map((car) => (
          <Grid item xs={12} sm={6} md={4} key={car.id}>
            <Card sx={{ borderRadius: 2, boxShadow: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                image={car.image}
                alt={car.name}
                sx={{ height: 140, objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" noWrap>
                  {car.name} - {car.model}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Year: {car.year} | Mileage: {car.mileage}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gear: {car.gearType} | Type: {car.type} | Color: {car.color}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {car.details}
                </Typography>
                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                  Contact: {car.phone} | {car.email}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleAccept(car.id)}
                >
                  Accept
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(car.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Pagination
        count={Math.ceil(filteredCars.length / itemsPerPage)}
        page={page}
        onChange={(_, value) => setPage(value)}
        color="primary"
        sx={{ alignSelf: 'center', mt: 3 }}
      />
    </Stack>
  );
};

export default ManageCarSubmissions;
