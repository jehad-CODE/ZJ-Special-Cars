'use client';

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CardActions,
  Button,
  Pagination,
  Stack,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

const allCars = [
  { id: 1, name: 'Ferrari', model: '488 GTB', year: 2020, price: 250000, image: '/src/assets/ZjUserBackground.jpg', type: 'Sport' },
  { id: 2, name: 'Tesla', model: 'Model S', year: 2022, price: 80000, image: '/src/assets/watch.jpg', type: 'Hybrid/Electric' },
  { id: 3, name: 'Lamborghini', model: 'Aventador', year: 2019, price: 300000, image: '/images/cars/lamborghini.jpg', type: 'Sport' },
  { id: 4, name: 'Porsche', model: '911', year: 2021, price: 150000, image: '/images/cars/porsche.jpg', type: 'Classic' },
  { id: 5, name: 'BMW', model: 'i8', year: 2020, price: 140000, image: '/images/cars/bmw.jpg', type: 'Hybrid/Electric' },
  // Add more to test pagination
];

const ManageCars = () => {
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const filteredCars =
    filter === 'All' ? allCars : allCars.filter((car) => car.type === filter);

  const paginatedCars = filteredCars.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleEdit = (id: number) => {
    console.log('Edit car with id:', id);
  };

  const handleDelete = (id: number) => {
    console.log('Delete car with id:', id);
  };

  return (
    <>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Manage Cars
      </Typography>

      <Stack direction="row" spacing={2} mb={3}>
        {['All', 'Sport', 'Classic', 'Hybrid/Electric'].map((type) => (
          <Button key={type} variant={filter === type ? 'contained' : 'outlined'} onClick={() => { setFilter(type); setPage(1); }}>
            {type}
          </Button>
        ))}
      </Stack>

      <Grid container spacing={2}>
        {paginatedCars.map((car) => (
          <Grid item xs={12} sm={6} md={4} key={car.id}>
            <Card sx={{ borderRadius: 2, boxShadow: 2, height: 280 }}>
              <CardMedia
                component="img"
                image={car.image}
                alt={`${car.name} image`}
                sx={{ height: 120, objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="subtitle1" noWrap>
                  {car.name} - {car.model}
                </Typography>
                <Typography variant="body2">Year: {car.year}</Typography>
                <Typography fontWeight="bold">Price: ${car.price.toLocaleString()}</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(car.id)}>Edit</Button>
                <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(car.id)}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Pagination
        count={Math.ceil(filteredCars.length / itemsPerPage)}
        page={page}
        onChange={(_, value) => setPage(value)}
        sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
      />
    </>
  );
};

export default ManageCars;
