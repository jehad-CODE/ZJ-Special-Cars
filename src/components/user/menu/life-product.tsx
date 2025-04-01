import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Button, Pagination, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const LifeProduct: React.FC = () => {
  const products = [
    { name: 'Car-Themed Mug', price: '$15', image: '/src/assets/watch.jpg', details: 'A mug with a car theme design.' },
    { name: 'Driving Gloves', price: '$30', image: 'https://example.com/gloves.jpg', details: 'Stylish and comfortable driving gloves.' },
    { name: 'Racing Jacket', price: '$120', image: 'https://example.com/jacket.jpg', details: 'A high-quality racing jacket for car enthusiasts.' },
    { name: 'Watch', price: '$50', image: 'https://example.com/watch.jpg', details: 'A watch designed for driving enthusiasts.' },
    { name: 'Car-Themed T-Shirt', price: '$25', image: 'https://example.com/tshirt.jpg', details: 'A stylish T-shirt with a car logo.' },
    { name: 'Driving Shoes', price: '$80', image: 'https://example.com/shoes.jpg', details: 'High-performance shoes for driving.' },
    { name: 'Cap', price: '$15', image: 'https://example.com/cap.jpg', details: 'A cap with a car-themed design.' },
    { name: 'Car-Themed Backpack', price: '$45', image: 'https://example.com/backpack.jpg', details: 'A backpack designed for car lovers.' },
    { name: 'Keychain', price: '$8', image: 'https://example.com/keychain.jpg', details: 'A keychain with a car logo.' },
    { name: 'Car-Themed Poster', price: '$10', image: 'https://example.com/poster.jpg', details: 'A poster featuring car artwork.' },
  ];

  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);

  const productsPerPage = 6; // Number of products per page
  const startIndex = (page - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

  const handleChangePage = (value: number) => {
    setPage(value);
  };

  const handleOpenModal = (product: any) => {
    setCurrentProduct(product);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setCurrentProduct(null);
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: 'black', color: 'white', height: '100vh', overflowY: 'auto', paddingBottom: '100px' }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>Life Products</Typography>

      <Grid container spacing={3} justifyContent="center">
        {currentProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={4} sx={{ borderRadius: 3, padding: 2, textAlign: 'center', backgroundColor: '#333' }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '8px' }} />
              <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>{product.name}</Typography>
              <Typography variant="h6" sx={{ color: 'green', fontWeight: 'bold' }}>{product.price}</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => handleOpenModal(product)}>View Details</Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(products.length / productsPerPage)}
        page={page}
        onChange={(_, value) => handleChangePage(value)}
        color="primary"
        sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}
      />

      {/* Modal for Product Details */}
      <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{currentProduct?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center' }}>
            <img src={currentProduct?.image} alt={currentProduct?.name} style={{ width: '100%', borderRadius: '8px' }} />
            <Typography variant="h6" sx={{ mt: 2 }}>{currentProduct?.price}</Typography>
            <Typography variant="body1" sx={{ mt: 2, color: 'gray' }}>{currentProduct?.details}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LifeProduct;
