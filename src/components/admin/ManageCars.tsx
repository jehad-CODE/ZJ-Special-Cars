import React, { useState } from 'react';
import {
  Typography, Box, TextField, Button, CircularProgress, Grid, InputLabel, MenuItem,
  Select, FormControl, Card, CardContent, CardMedia, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, Pagination, Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

// Define car interface with all fields from SellYourCar
interface Car {
  id: number; name: string; model: string; year: number; mileage: string;
  details: string; email: string; phone: string; color: string;
  gearType: string; type: string; price: number; image: string;
}

// Sample car data with all fields
const allCars: Car[] = [
  { id: 1, name: 'Ferrari', model: '488 GTB', year: 2020, mileage: '3,500',
    details: 'Ferrari 488 GTB with twin-turbo V8 engine, excellent condition, one owner.',
    email: 'seller1@example.com', phone: '+966 501 111 222', color: 'Red',
    gearType: 'Automatic', type: 'Sport', price: 250000, image: '/src/assets/ZjUserBackground.jpg' },
  { id: 2, name: 'Tesla', model: 'Model S', year: 2022, mileage: '1,200',
    details: 'Tesla Model S with autopilot, premium interior, and extended range battery.',
    email: 'seller2@example.com', phone: '+966 502 333 444', color: 'White',
    gearType: 'Automatic', type: 'Hybrid/Electric', price: 80000, image: '/src/assets/watch.jpg' },
  { id: 3, name: 'Lamborghini', model: 'Aventador', year: 2019, mileage: '5,800',
    details: 'Lamborghini Aventador in perfect condition with V12 engine.',
    email: 'seller3@example.com', phone: '+966 503 555 666', color: 'Yellow',
    gearType: 'Automatic', type: 'Sport', price: 300000, image: '/src/assets/ZjUserBackground.jpg' },
  { id: 4, name: 'Porsche', model: '911', year: 2021, mileage: '2,400',
    details: 'Porsche 911 Turbo S with sports package and custom interior.',
    email: 'seller4@example.com', phone: '+966 504 777 888', color: 'Silver',
    gearType: 'Manual', type: 'Classic', price: 150000, image: '/src/assets/watch.jpg' },
  { id: 5, name: 'BMW', model: 'i8', year: 2020, mileage: '3,200',
    details: 'BMW i8 hybrid sports car with butterfly doors and futuristic design.',
    email: 'seller5@example.com', phone: '+966 505 999 000', color: 'Blue',
    gearType: 'Automatic', type: 'Hybrid/Electric', price: 140000, image: '/src/assets/ZjUserBackground.jpg' },
];

const ManageCars: React.FC = () => {
  const [cars, setCars] = useState<Car[]>(allCars);
  const [filter, setFilter] = useState<string>('All');
  const [page, setPage] = useState<number>(1);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  
  // Form state - matching SellYourCar component
  const [carName, setCarName] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [carMileage, setCarMileage] = useState('');
  const [carDetails, setCarDetails] = useState('');
  const [carEmail, setCarEmail] = useState('');
  const [carPhone, setCarPhone] = useState('');
  const [carColor, setCarColor] = useState('');
  const [carGearType, setCarGearType] = useState('');
  const [carType, setCarType] = useState('');
  const [carPrice, setCarPrice] = useState('');
  const [carImage, setCarImage] = useState('/src/assets/ZjUserBackground.jpg');
  
  const itemsPerPage = 9;
  const filteredCars = filter === 'All' ? cars : cars.filter(car => car.type === filter);
  const paginatedCars = filteredCars.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const resetForm = () => {
    setCarName(''); setCarModel(''); setCarYear(''); setCarMileage('');
    setCarDetails(''); setCarEmail(''); setCarPhone(''); setCarColor('');
    setCarGearType(''); setCarType(''); setCarPrice(''); 
    setCarImage('/src/assets/ZjUserBackground.jpg');
  };

  const handleOpenAddDialog = () => {
    resetForm();
    setSelectedCar(null);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (car: Car) => {
    setSelectedCar(car);
    setCarName(car.name); setCarModel(car.model); setCarYear(String(car.year));
    setCarMileage(car.mileage); setCarDetails(car.details); setCarEmail(car.email);
    setCarPhone(car.phone); setCarColor(car.color); setCarGearType(car.gearType);
    setCarType(car.type); setCarPrice(String(car.price)); setCarImage(car.image);
    setOpenDialog(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      setCars(cars.filter(car => car.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!carName || !carModel || !carYear || !carMileage || !carColor || !carGearType || !carType || !carPrice) {
      alert('Please fill all required fields');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      if (selectedCar) {
        // Edit existing car
        setCars(cars.map(car => car.id === selectedCar.id ? {
          ...car, name: carName, model: carModel, year: Number(carYear),
          mileage: carMileage, details: carDetails, email: carEmail,
          phone: carPhone, color: carColor, gearType: carGearType,
          type: carType, price: Number(carPrice), image: carImage
        } : car));
      } else {
        // Add new car
        const newCar: Car = {
          id: cars.length > 0 ? Math.max(...cars.map(car => car.id)) + 1 : 1,
          name: carName, model: carModel, year: Number(carYear),
          mileage: carMileage, details: carDetails, email: carEmail,
          phone: carPhone, color: carColor, gearType: carGearType,
          type: carType, price: Number(carPrice), image: carImage
        };
        setCars([...cars, newCar]);
      }
      setIsSubmitting(false);
      setOpenDialog(false);
    }, 1000);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>Manage Cars</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ flexWrap: 'wrap' }}>
          {['All', 'Sport', 'Classic', 'Hybrid/Electric'].map((type) => (
            <Button key={type} variant={filter === type ? 'contained' : 'outlined'} 
              onClick={() => { setFilter(type); setPage(1); }} sx={{ mb: 1 }}>
              {type}
            </Button>
          ))}
        </Stack>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenAddDialog}>
          Add Car
        </Button>
      </Box>

      <Grid container spacing={2}>
        {paginatedCars.map((car) => (
          <Grid item xs={12} sm={6} md={4} key={car.id}>
            <Card sx={{ borderRadius: 2, boxShadow: 2, height: '100%', backgroundColor: '#1c1c1c', color: 'white' }}>
              <CardMedia component="img" image={car.image} alt={`${car.name} image`}
                sx={{ height: 160, objectFit: 'cover' }} />
              <CardContent>
                <Typography variant="h6" noWrap>{car.name} - {car.model}</Typography>
                <Typography variant="body2">Year: {car.year}</Typography>
                <Typography variant="body2">Mileage: {car.mileage} km</Typography>
                <Typography variant="body2">Color: {car.color}</Typography>
                <Typography variant="body2">Type: {car.type}</Typography>
                <Typography fontWeight="bold" color="primary">${car.price.toLocaleString()}</Typography>
              </CardContent>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button size="small" variant="outlined" startIcon={<EditIcon />}
                  onClick={() => handleOpenEditDialog(car)}>Edit</Button>
                <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(car.id)}>Delete</Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredCars.length > itemsPerPage && (
        <Pagination count={Math.ceil(filteredCars.length / itemsPerPage)} page={page}
          onChange={(_, value) => setPage(value)}
          sx={{ mt: 3, display: 'flex', justifyContent: 'center' }} />
      )}

      {/* Add/Edit Car Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md"
        PaperProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white', borderRadius: 2 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">{selectedCar ? 'Edit Car' : 'Add New Car'}</Typography>
          <IconButton onClick={() => setOpenDialog(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Car Name" value={carName} onChange={(e) => setCarName(e.target.value)}
                  fullWidth required InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Car Model" value={carModel} onChange={(e) => setCarModel(e.target.value)}
                  fullWidth required InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Car Year" type="number" value={carYear} onChange={(e) => setCarYear(e.target.value)}
                  fullWidth required InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Car Mileage (in km)" value={carMileage} onChange={(e) => setCarMileage(e.target.value)}
                  fullWidth required InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Car Details" value={carDetails} onChange={(e) => setCarDetails(e.target.value)}
                  multiline rows={3} fullWidth required InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Contact Email" value={carEmail} onChange={(e) => setCarEmail(e.target.value)}
                  fullWidth required InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Phone Number" value={carPhone} onChange={(e) => setCarPhone(e.target.value)}
                  fullWidth required InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Car Color" value={carColor} onChange={(e) => setCarColor(e.target.value)}
                  fullWidth required InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel sx={{ color: '#aaa' }}>Gear Type</InputLabel>
                  <Select value={carGearType} onChange={(e) => setCarGearType(e.target.value)}
                    inputProps={{ style: { color: 'white' } }}>
                    <MenuItem value="Automatic">Automatic</MenuItem>
                    <MenuItem value="Manual">Manual</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel sx={{ color: '#aaa' }}>Car Type</InputLabel>
                  <Select value={carType} onChange={(e) => setCarType(e.target.value)}
                    inputProps={{ style: { color: 'white' } }}>
                    <MenuItem value="Sport">Sport</MenuItem>
                    <MenuItem value="Classic">Classic</MenuItem>
                    <MenuItem value="Hybrid/Electric">Hybrid/Electric</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Price ($)" type="number" value={carPrice} onChange={(e) => setCarPrice(e.target.value)}
                  fullWidth required InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel sx={{ color: 'white', mb: 1 }}>Car Image</InputLabel>
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
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}>
            {isSubmitting ? 'Saving...' : selectedCar ? 'Update Car' : 'Add Car'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageCars;