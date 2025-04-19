import React, { useState } from 'react';
import {
  Typography, Box, TextField, Button, CircularProgress, Grid, InputLabel,
  MenuItem, Select, FormControl, Card, CardContent, CardMedia, IconButton, 
  Dialog, DialogTitle, DialogContent, DialogActions, Pagination, Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

// Define accessory interface
interface Accessory {
  id: number; name: string; description: string; price: number; 
  image: string; category: string; brand?: string; stock?: number;
}

// Sample accessories data
const allAccessories: Accessory[] = [
  { id: 1, name: 'Steering Wheel', description: 'Premium leather steering wheel with ergonomic grip.', 
    price: 200, image: '/src/assets/wheel.jpg', category: 'Car', brand: 'AutoGrip', stock: 15 },
  { id: 2, name: 'Racing Helmet', description: 'High quality racing helmet with safety certification.', 
    price: 350, image: '/src/assets/wheel.jpg', category: 'Car', brand: 'SpeedSafe', stock: 8 },
  { id: 3, name: 'Alloy Wheels', description: 'Set of 4 lightweight alloy wheels for improved performance.', 
    price: 1200, image: '/src/assets/wheel.jpg', category: 'Car', brand: 'TurboWheel', stock: 12 },
  { id: 4, name: 'Car Cover', description: 'Weather-resistant car cover for all-season protection.', 
    price: 100, image: '/src/assets/watch.jpg', category: 'Lifestyle', brand: 'ShieldPro', stock: 25 },
  { id: 5, name: 'Car-Themed Mug', description: 'Premium ceramic mug with car design for enthusiasts.', 
    price: 15, image: '/src/assets/watch.jpg', category: 'Lifestyle', brand: 'AutoStyle', stock: 50 },
];

const ManageAccessories: React.FC = () => {
  const [accessories, setAccessories] = useState<Accessory[]>(allAccessories);
  const [filter, setFilter] = useState<string>('All');
  const [page, setPage] = useState<number>(1);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('/src/assets/wheel.jpg');
  
  const itemsPerPage = 9;
  const filtered = filter === 'All' ? accessories : accessories.filter(item => item.category === filter);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const resetForm = () => {
    setName(''); setDescription(''); setPrice(''); setCategory('');
    setBrand(''); setStock(''); setImage('/src/assets/wheel.jpg');
  };

  const handleOpenAddDialog = () => {
    resetForm();
    setSelectedAccessory(null);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (accessory: Accessory) => {
    setSelectedAccessory(accessory);
    setName(accessory.name);
    setDescription(accessory.description);
    setPrice(String(accessory.price));
    setCategory(accessory.category);
    setBrand(accessory.brand || '');
    setStock(accessory.stock ? String(accessory.stock) : '');
    setImage(accessory.image);
    setOpenDialog(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this accessory?')) {
      setAccessories(accessories.filter(item => item.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !price || !category) {
      alert('Please fill all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      if (selectedAccessory) {
        // Edit existing accessory
        setAccessories(accessories.map(item => 
          item.id === selectedAccessory.id 
            ? {
                ...item,
                name, description, price: Number(price), category,
                brand: brand || undefined, stock: stock ? Number(stock) : undefined,
                image
              }
            : item
        ));
      } else {
        // Add new accessory
        const newAccessory: Accessory = {
          id: accessories.length > 0 ? Math.max(...accessories.map(item => item.id)) + 1 : 1,
          name, description, price: Number(price), category,
          brand: brand || undefined, stock: stock ? Number(stock) : undefined,
          image
        };
        setAccessories([...accessories, newAccessory]);
      }
      
      setIsSubmitting(false);
      setOpenDialog(false);
    }, 1000);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        Manage Accessories
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ flexWrap: 'wrap' }}>
          {['All', 'Car', 'Lifestyle'].map((type) => (
            <Button key={type} variant={filter === type ? 'contained' : 'outlined'} 
              onClick={() => { setFilter(type); setPage(1); }} sx={{ mb: 1 }}>
              {type}
            </Button>
          ))}
        </Stack>
        
        <Button variant="contained" color="primary" startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}>
          Add Accessory
        </Button>
      </Box>

      <Grid container spacing={2}>
        {paginated.map((acc) => (
          <Grid item xs={12} sm={6} md={4} key={acc.id}>
            <Card sx={{ borderRadius: 2, boxShadow: 2, height: '100%', backgroundColor: '#1c1c1c', color: 'white' }}>
              <CardMedia component="img" image={acc.image} alt={`${acc.name} image`}
                sx={{ height: 140, objectFit: 'cover' }} />
              <CardContent>
                <Typography variant="h6" noWrap>{acc.name}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>{acc.description}</Typography>
                <Typography variant="body2">Category: {acc.category}</Typography>
                {acc.brand && <Typography variant="body2">Brand: {acc.brand}</Typography>}
                {acc.stock !== undefined && <Typography variant="body2">Stock: {acc.stock}</Typography>}
                <Typography fontWeight="bold" color="primary" sx={{ mt: 1 }}>
                  ${acc.price.toLocaleString()}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button size="small" variant="outlined" startIcon={<EditIcon />}
                  onClick={() => handleOpenEditDialog(acc)}>Edit</Button>
                <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(acc.id)}>Delete</Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filtered.length > itemsPerPage && (
        <Pagination count={Math.ceil(filtered.length / itemsPerPage)} page={page}
          onChange={(_, value) => setPage(value)}
          sx={{ mt: 3, display: 'flex', justifyContent: 'center' }} />
      )}

      {/* Add/Edit Accessory Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md"
        PaperProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white', borderRadius: 2 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">{selectedAccessory ? 'Edit Accessory' : 'Add New Accessory'}</Typography>
          <IconButton onClick={() => setOpenDialog(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)}
                  fullWidth required InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel sx={{ color: '#aaa' }}>Category</InputLabel>
                  <Select value={category} onChange={(e) => setCategory(e.target.value)}
                    inputProps={{ style: { color: 'white' } }}>
                    <MenuItem value="Car">Car</MenuItem>
                    <MenuItem value="Lifestyle">Lifestyle</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField label="Description" value={description} multiline rows={2}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth required InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField label="Price ($)" type="number" value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  fullWidth required InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField label="Brand" value={brand} onChange={(e) => setBrand(e.target.value)}
                  fullWidth InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField label="Stock" type="number" value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  fullWidth InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} />
              </Grid>
              
              <Grid item xs={12}>
                <InputLabel sx={{ color: 'white', mb: 1 }}>Image</InputLabel>
                <input type="file" accept="image/*" style={{ color: 'white' }} />
                <Typography variant="caption" sx={{ color: '#aaa', display: 'block', mt: 1 }}>
                  Using default image path for demo
                </Typography>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: 'white' }}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}
            disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={20} /> : null}>
            {isSubmitting ? 'Saving...' : selectedAccessory ? 'Update' : 'Add Accessory'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageAccessories;