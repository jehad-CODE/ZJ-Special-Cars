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
} from '@mui/material';

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
    };

    // Simulate API request delay
    setTimeout(() => {
      setSubmittedForms([...submittedForms, formData]);
      setStatus('Your car listing request has been submitted successfully!');
      setIsSubmitting(false);
      resetForm();
    }, 2000);
  };

  const resetForm = () => {
    setCarName('');
    setCarModel('');
    setCarYear('');
    setCarMileage('');
    setCarDetails('');
    setCarEmail('');
    setCarPhone('');
    setCarColor('');
    setCarGearType('');
    setCarType('');
    setCarImages([]);
  };

  const renderInitialButtons = () => (
    <Box sx={{ textAlign: 'center' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setShowForm(true);
          setShowSubmissions(false);
        }}
        sx={{ margin: 2 }}
      >
        Sell Your Car
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => {
          setShowForm(false);
          setShowSubmissions(true);
        }}
        sx={{ margin: 2 }}
      >
        View Submissions
      </Button>
    </Box>
  );

  const renderSubmissions = () => (
    <Box>
      {submittedForms.length === 0 ? (
        <Typography color="white" sx={{ mt: 2 }}>
          You have no submissions yet.
        </Typography>
      ) : (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {submittedForms.map((form, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ backgroundColor: '#1c1c1c', color: 'white' }}>
                {form.carImages.length > 0 && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={form.carImages[0]}
                    alt={form.carName}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{form.carName} ({form.carModel})</Typography>
                  <Typography variant="body2">Year: {form.carYear}</Typography>
                  <Typography variant="body2">Mileage: {form.carMileage} km</Typography>
                  <Typography variant="body2">Type: {form.carType}</Typography>
                  <Typography variant="body2">Status: {form.submissionStatus}</Typography>
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
        height: '90vh',
        backgroundImage: `url('/src/assets/SellYourCarBackground.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 4,
        overflowY: 'auto',
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: 4,
          padding: 4,
          maxWidth: 1000,
          width: '100%',
          color: 'white',
          overflowY: 'auto',
          maxHeight: '85vh',
        }}
      >
        {!showForm && !showSubmissions && renderInitialButtons()}
        {showForm && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Grid container spacing={2}>
              {/* All form fields from earlier remain unchanged... */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Car Name"
                  value={carName}
                  onChange={(e) => setCarName(e.target.value)}
                  fullWidth
                  required
                  InputProps={{ style: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Car Model"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  fullWidth
                  required
                  InputProps={{ style: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Car Year"
                  type="number"
                  value={carYear}
                  onChange={(e) => setCarYear(e.target.value)}
                  fullWidth
                  required
                  InputProps={{ style: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Car Mileage (in km)"
                  type="number"
                  value={carMileage}
                  onChange={(e) => setCarMileage(e.target.value)}
                  fullWidth
                  required
                  InputProps={{ style: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Car Details"
                  value={carDetails}
                  onChange={(e) => setCarDetails(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  required
                  InputProps={{ style: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email/Username"
                  value={carEmail}
                  onChange={(e) => setCarEmail(e.target.value)}
                  fullWidth
                  required
                  InputProps={{ style: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  value={carPhone}
                  onChange={(e) => setCarPhone(e.target.value)}
                  fullWidth
                  required
                  InputProps={{ style: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Car Color"
                  value={carColor}
                  onChange={(e) => setCarColor(e.target.value)}
                  fullWidth
                  required
                  InputProps={{ style: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel sx={{ color: 'white' }}>Gear Type</InputLabel>
                  <Select
                    value={carGearType}
                    onChange={(e) => setCarGearType(e.target.value)}
                    inputProps={{ style: { color: 'white' } }}
                  >
                    <MenuItem value="Automatic">Automatic</MenuItem>
                    <MenuItem value="Manual">Manual</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel sx={{ color: 'white' }}>Car Type</InputLabel>
                  <Select
                    value={carType}
                    onChange={(e) => setCarType(e.target.value)}
                    inputProps={{ style: { color: 'white' } }}
                  >
                    <MenuItem value="Sport">Sport</MenuItem>
                    <MenuItem value="Classic">Classic</MenuItem>
                    <MenuItem value="Hybrid/Electric">Hybrid/Electric</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <InputLabel sx={{ color: 'white' }}>Upload Car Images</InputLabel>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ marginBottom: '10px' }}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  {carImages.map((image) => (
                    <img
                      key={URL.createObjectURL(image)}
                      src={URL.createObjectURL(image)}
                      alt="Car"
                      width="100"
                      height="100"
                      style={{ borderRadius: '8px', objectFit: 'cover' }}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  sx={{ maxWidth: 400 }}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
                </Button>
              </Grid>
            </Grid>

            {/* Status Message */}
            {status && (
              <Typography
                variant="h6"
                color={status.includes('submitted') ? 'green' : 'orange'}
                sx={{ mt: 4 }}
              >
                {status}
              </Typography>
            )}
          </form>
        )}

        {showSubmissions && renderSubmissions()}
      </Box>
    </Box>
  );
};

export default SellYourCar;
