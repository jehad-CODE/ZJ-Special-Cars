import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const SellYourCar: React.FC = () => {
  const [carName, setCarName] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [carMileage, setCarMileage] = useState('');
  const [carDetails, setCarDetails] = useState('');
  const [carPrice, setCarPrice] = useState('');
  const [carEmail, setCarEmail] = useState('');
  const [carPhone, setCarPhone] = useState('');
  const [carColor, setCarColor] = useState('');
  const [carGearType, setCarGearType] = useState('');
  const [carType, setCarType] = useState('');
  const [carImages, setCarImages] = useState<File[]>([]);
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [userCars, setUserCars] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const userEmail = localStorage.getItem('email');
      const userPhone = localStorage.getItem('phone');
      setCarEmail(userEmail || '');
      setCarPhone(userPhone || '');
      
      // Load user's submissions
      if (showSubmissions) {
        fetchUserCars();
      }
    }
  }, [showSubmissions]);

  const fetchUserCars = async () => {
    try {
      setLoading(true);
      const userEmail = localStorage.getItem('email');
      const token = localStorage.getItem('token');
      
      console.log('Fetching cars with email:', userEmail);
      
      // Fetch cars filtered by email directly from the server
      const response = await fetch(`http://localhost:5000/api/cars?email=${encodeURIComponent(userEmail || '')}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('User cars fetched by email:', data);
        setUserCars(data);
      } else {
        console.error('Failed to fetch cars');
        setStatus('Failed to load your submissions. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching user cars:', error);
      setStatus('Error loading your submissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCarImages([...carImages, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...carImages];
    newImages.splice(index, 1);
    setCarImages(newImages);
  };

  const handleLoginRedirect = () => {
    setLoginDialogOpen(false);
    navigate('/sign-in');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!isLoggedIn) {
      setLoginDialogOpen(true);
      return;
    }
    
    setIsSubmitting(true);
    setStatus('Uploading images...');

    try {
      // First upload the images
      let uploadedImagePaths: string[] = [];
      
      if (carImages.length > 0) {
        const formData = new FormData();
        carImages.forEach(image => {
          formData.append('images', image);
        });
        
        const uploadResponse = await fetch('http://localhost:5000/api/cars/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload images');
        }
        
        const uploadResult = await uploadResponse.json();
        uploadedImagePaths = uploadResult.files;
      }
      
      setStatus('Submitting your car listing...');
      
      const userId = localStorage.getItem('userId');
      console.log('Submitting with userId:', userId);
      
      // Prepare car data matching the expected backend structure
      const carData = {
        name: carName,
        model: carModel,
        year: carYear,
        mileage: carMileage,
        details: carDetails,
        price: carPrice,
        sellerEmail: carEmail,
        sellerPhone: carPhone,
        color: carColor,
        gearType: carGearType,
        type: carType,
        images: uploadedImagePaths,
        userId: userId,
        sellerId: userId,
        user: userId,
        seller: userId,
        role: localStorage.getItem('role')
      };
      
      console.log('Submitting car data:', carData);
      
      // Submit the car data
      const submitResponse = await fetch('http://localhost:5000/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(carData)
      });
      
      if (!submitResponse.ok) {
        const errorData = await submitResponse.json();
        throw new Error(errorData.message || 'Failed to submit car listing');
      }
      
      const newCar = await submitResponse.json();
      console.log('Car submitted successfully:', newCar);
      
      setStatus('Your car listing has been submitted successfully!');
      
      // Reset form and show submissions after success
      setTimeout(() => {
        resetForm();
        setShowForm(false);
        setShowSubmissions(true);
        // Fetch user cars after successful submission
        fetchUserCars();
      }, 2000);
    } catch (error: any) {
      console.error('Error submitting car:', error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCarName(''); 
    setCarModel(''); 
    setCarYear(''); 
    setCarMileage('');
    setCarDetails(''); 
    setCarPrice('');
    setCarColor(''); 
    setCarGearType(''); 
    setCarType(''); 
    setCarImages([]);
  };

  const handleShowForm = () => {
    // Check if user is logged in before showing form
    if (!isLoggedIn) {
      setLoginDialogOpen(true);
      return;
    }
    setShowForm(true);
    setShowSubmissions(false);
  };
  
  const handleShowSubmissions = () => {
    // Check if user is logged in before showing submissions
    if (!isLoggedIn) {
      setLoginDialogOpen(true);
      return;
    }
    setShowForm(false);
    setShowSubmissions(true);
  };

  // Helper function to get full image URL
  const getFullImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    
    // If the path already starts with http, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Check if path starts with /uploads
    if (imagePath.startsWith('/uploads')) {
      return `http://localhost:5000${imagePath}`;
    }
    
    // Otherwise, just return the path
    return imagePath;
  };

  const renderInitialButtons = () => (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>What would you like to do?</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleShowForm}
        sx={{ m: 2, px: 4, py: 1.5 }}
        size="large"
      >
        Sell Your Car
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleShowSubmissions}
        sx={{ m: 2, px: 4, py: 1.5 }}
        size="large"
      >
        View Submissions
      </Button>
    </Box>
  );

  const renderForm = () => (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => { setShowForm(false); setStatus(''); }} sx={{ mb: 3 }}>
        Back
      </Button>
      
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
        Sell Your Car
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Car Name" value={carName} onChange={(e) => setCarName(e.target.value)}
              fullWidth required InputProps={{ style: { color: 'white' } }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Car Model" value={carModel} onChange={(e) => setCarModel(e.target.value)}
              fullWidth required InputProps={{ style: { color: 'white' } }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Car Year" type="number" value={carYear} onChange={(e) => setCarYear(e.target.value)}
              fullWidth required InputProps={{ style: { color: 'white' } }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Car Mileage (in km)" type="number" value={carMileage} onChange={(e) => setCarMileage(e.target.value)}
              fullWidth required InputProps={{ style: { color: 'white' } }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Car Price ($)" type="number" value={carPrice} onChange={(e) => setCarPrice(e.target.value)}
              fullWidth required InputProps={{ style: { color: 'white' } }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Car Color" value={carColor} onChange={(e) => setCarColor(e.target.value)}
              fullWidth required InputProps={{ style: { color: 'white' } }} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Car Details" value={carDetails} onChange={(e) => setCarDetails(e.target.value)}
              fullWidth multiline rows={3} required InputProps={{ style: { color: 'white' } }} />
          </Grid>
          <Grid item xs={12}>
            <TextField 
              label="Email/Username" 
              value={carEmail} 
              fullWidth required 
              disabled 
              InputProps={{ style: { color: 'white' } }} 
            />
          </Grid>
          <Grid item xs={12}>
            <TextField 
              label="Phone Number" 
              value={carPhone} 
              fullWidth required 
              disabled // Disabled since it's auto-populated
              InputProps={{ style: { color: 'white' } }} 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel sx={{ color: 'white' }}>Gear Type</InputLabel>
              <Select value={carGearType} onChange={(e) => setCarGearType(e.target.value as string)}
                inputProps={{ style: { color: 'white' } }}>
                <MenuItem value="Automatic">Automatic</MenuItem>
                <MenuItem value="Manual">Manual</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel sx={{ color: 'white' }}>Car Type</InputLabel>
              <Select value={carType} onChange={(e) => setCarType(e.target.value as string)}
                inputProps={{ style: { color: 'white' } }}>
                <MenuItem value="Sport">Sport</MenuItem>
                <MenuItem value="Classic">Classic</MenuItem>
                <MenuItem value="Hybrid/Electric">Hybrid/Electric</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <InputLabel sx={{ color: 'white', mb: 1 }}>Upload Car Images</InputLabel>
            <input type="file" multiple onChange={handleImageChange} accept="image/*" />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {carImages.map((image, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Car"
                    width="100"
                    height="100"
                    style={{ borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    sx={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ px: 4, py: 1 }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Submit Listing'}
            </Button>
          </Grid>
        </Grid>
      </form>
      
      {status && (
        <Paper sx={{ mt: 4, p: 2, backgroundColor: status.includes('success') ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)' }}>
          <Typography color={status.includes('success') ? 'green' : 'orange'}>{status}</Typography>
        </Paper>
      )}
    </Box>
  );

  const renderSubmissions = () => (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => setShowSubmissions(false)} sx={{ mb: 3 }}>Back</Button>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>Your Car Listings</Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : userCars.length === 0 ? (
        <Typography color="white" sx={{ textAlign: 'center' }}>
          You have no submissions yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {userCars.map((car) => (
            <Grid item xs={12} sm={6} md={4} key={car._id}>
              <Card sx={{ backgroundColor: '#1c1c1c', color: 'white', height: '100%' }}>
                {car.images && car.images.length > 0 ? (
                  <CardMedia
                    component="img"
                    height="160"
                    image={getFullImageUrl(car.images[0])}
                    alt={car.name}
                    sx={{ objectFit: 'cover' }}
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/src/assets/car-placeholder.jpg'; // Set a placeholder image on error
                      target.onerror = null; // Prevent infinite error loop
                    }}
                  />
                ) : (
                  <CardMedia
                    component="img"
                    height="160"
                    image="/src/assets/car-placeholder.jpg"
                    alt="No image available"
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{car.name} {car.model}</Typography>
                  <Typography variant="body2">Year: {car.year}</Typography>
                  <Typography variant="body2">Mileage: {car.mileage} km</Typography>
                  <Typography variant="body2">Price: ${car.price}</Typography>
                  <Typography variant="body2">Type: {car.type}</Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: car.status === 'pending' 
                        ? 'orange' 
                        : car.status === 'approved' 
                          ? 'green' 
                          : 'red' 
                    }}
                  >
                    Status: {car.status === 'pending' 
                      ? 'Pending Review' 
                      : car.status === 'approved' 
                        ? 'Approved' 
                        : 'Rejected'}
                  </Typography>
                  {car.createdAt && (
                    <Typography variant="body2">
                      Submitted: {new Date(car.createdAt).toLocaleDateString()}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  // Login Dialog
  const renderLoginDialog = () => (
    <Dialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)}>
      <DialogTitle>Login Required</DialogTitle>
      <DialogContent>
        <Typography>
          You need to be logged in to {showSubmissions ? 'view your submissions' : 'sell your car'}.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setLoginDialogOpen(false)} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleLoginRedirect} color="primary" variant="contained">
          Go to Login
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        backgroundImage: `url('/src/assets/Login8.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          borderRadius: { xs: 2, sm: 4 },
          padding: { xs: 2, sm: 3, md: 4 },
          maxWidth: 1000,
          width: '100%',
          color: 'white',
          overflowY: 'auto',
          maxHeight: '90vh',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        {!showForm && !showSubmissions && renderInitialButtons()}
        {showForm && renderForm()}
        {showSubmissions && renderSubmissions()}
        {renderLoginDialog()}
      </Box>
    </Box>
  );
};

export default SellYourCar;