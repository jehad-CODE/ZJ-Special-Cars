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

const allAccessories = [
  { id: 1, name: 'Steering Wheel', description: 'Premium leather steering wheel.', price: 200, image: '/images/accessories/steering.jpg', category: 'Car' },
  { id: 2, name: 'Racing Helmet', description: 'High quality helmet.', price: 350, image: '/images/accessories/helmet.jpg', category: 'Car' },
  { id: 3, name: 'Alloy Wheels', description: 'Set of 4 alloy wheels.', price: 1200, image: '/images/accessories/wheels.jpg', category: 'Car' },
  { id: 4, name: 'Car Cover', description: 'Weather-resistant car cover.', price: 100, image: '/images/accessories/cover.jpg', category: 'Lifestyle' },
  { id: 5, name: 'Mug', description: 'Car-themed coffee mug.', price: 15, image: '/images/accessories/mug.jpg', category: 'Lifestyle' },
  // Add more to test pagination
];

const ManageAccessories = () => {
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const filtered = filter === 'All' ? allAccessories : allAccessories.filter((item) => item.category === filter);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleEdit = (id: number) => {
    console.log('Edit accessory with id:', id);
  };

  const handleDelete = (id: number) => {
    console.log('Delete accessory with id:', id);
  };

  return (
    <>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Manage Accessories
      </Typography>

      <Stack direction="row" spacing={2} mb={3}>
        {['All', 'Car', 'Lifestyle'].map((type) => (
          <Button key={type} variant={filter === type ? 'contained' : 'outlined'} onClick={() => { setFilter(type); setPage(1); }}>
            {type}
          </Button>
        ))}
      </Stack>

      <Grid container spacing={2}>
        {paginated.map((acc) => (
          <Grid item xs={12} sm={6} md={4} key={acc.id}>
            <Card sx={{ borderRadius: 2, boxShadow: 2, height: 280 }}>
              <CardMedia
                component="img"
                image={acc.image}
                alt={`${acc.name} image`}
                sx={{ height: 120, objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="subtitle1" noWrap>
                  {acc.name}
                </Typography>
                <Typography variant="body2" noWrap>
                  {acc.description}
                </Typography>
                <Typography fontWeight="bold">Price: ${acc.price}</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(acc.id)}>Edit</Button>
                <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(acc.id)}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Pagination
        count={Math.ceil(filtered.length / itemsPerPage)}
        page={page}
        onChange={(_, value) => setPage(value)}
        sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
      />
    </>
  );
};

export default ManageAccessories;
