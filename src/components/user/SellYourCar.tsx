import React, { useState } from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const SellYourCar: React.FC = () => {
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
  const [carImages, setCarImages] = useState<File[]>([]);
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [submittedForms, setSubmittedForms] = useState<any[]>([]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('Submitting your request...');

    const formData = {
      carName,
      carModel,
      carYear,
      carMileage,
      carDetails,
      carEmail,
      carPhone,
      carColor,
      carGearType,
      carType,
      carImages: carImages.map((img) => URL.createObjectURL(img)),
      submissionStatus: 'Pending Review',
      submissionDate: new Date().toLocaleDateString()
    };

    setTimeout(() => {
      setSubmittedForms([...submittedForms, formData]);
      setStatus('Your car listing request has been submitted successfully!');
      setIsSubmitting(false);
      setTimeout(() => {
        resetForm();
        setShowForm(false);
        setShowSubmissions(true);
      }, 2000);
    }, 1500);
  };

  const resetForm = () => {
    setCarName(''); setCarModel(''); setCarYear(''); setCarMileage('');
    setCarDetails(''); setCarEmail(''); setCarPhone(''); setCarColor('');
    setCarGearType(''); setCarType(''); setCarImages([]);
  };

  const renderInitialButtons = () => (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>What would you like to do?</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => { setShowForm(true); setShowSubmissions(false); }}
        sx={{ m: 2, px: 4, py: 1.5 }}
        size="large"
      >
        Sell Your Car
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => { setShowForm(false); setShowSubmissions(true); }}
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
          <Grid item xs={12}>
            <TextField label="Car Details" value={carDetails} onChange={(e) => setCarDetails(e.target.value)}
              fullWidth multiline rows={3} required InputProps={{ style: { color: 'white' } }} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email/Username" value={carEmail} onChange={(e) => setCarEmail(e.target.value)}
              fullWidth required InputProps={{ style: { color: 'white' } }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Phone Number" value={carPhone} onChange={(e) => setCarPhone(e.target.value)}
              fullWidth required InputProps={{ style: { color: 'white' } }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Car Color" value={carColor} onChange={(e) => setCarColor(e.target.value)}
              fullWidth required InputProps={{ style: { color: 'white' } }} />
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
                <Box key={URL.createObjectURL(image)} sx={{ position: 'relative' }}>
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
      
      {submittedForms.length === 0 ? (
        <Typography color="white" sx={{ textAlign: 'center' }}>
          You have no submissions yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {submittedForms.map((form, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ backgroundColor: '#1c1c1c', color: 'white', height: '100%' }}>
                {form.carImages.length > 0 && (
                  <CardMedia
                    component="img"
                    height="160"
                    image={form.carImages[0]}
                    alt={form.carName}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{form.carName} {form.carModel}</Typography>
                  <Typography variant="body2">Year: {form.carYear}</Typography>
                  <Typography variant="body2">Mileage: {form.carMileage} km</Typography>
                  <Typography variant="body2">Type: {form.carType}</Typography>
                  <Typography variant="body2" sx={{ color: form.submissionStatus === 'Pending Review' ? 'orange' : 'green' }}>
                    Status: {form.submissionStatus}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        backgroundImage: `url('/src/assets/SellYourCarBackground.jpg')`,
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
      </Box>
    </Box>
  );
};

export default SellYourCar;