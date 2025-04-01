import React, { useState } from 'react';
import { Typography, Box, TextField, Button, CircularProgress, Grid, InputLabel, MenuItem, Select, FormControl } from '@mui/material';

const SellYourCar: React.FC = () => {
  const [carName, setCarName] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [carMileage, setCarMileage] = useState('');
  const [carDetails, setCarDetails] = useState('');
  const [carEmail, setCarEmail] = useState('');
  const [carColor, setCarColor] = useState('');
  const [carGearType, setCarGearType] = useState('');
  const [carType, setCarType] = useState('');
  const [carImages, setCarImages] = useState<File[]>([]);
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCarImages([...carImages, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('Submitting your request...');

    const formData = new FormData();
    formData.append('carName', carName);
    formData.append('carModel', carModel);
    formData.append('carYear', carYear);
    formData.append('carMileage', carMileage);
    formData.append('carDetails', carDetails);
    formData.append('carEmail', carEmail);
    formData.append('carColor', carColor);
    formData.append('carGearType', carGearType);
    formData.append('carType', carType);

    carImages.forEach((image) => {
      formData.append('carImages', image);
    });

    // Simulate API request delay
    setTimeout(() => {
      setStatus('Your car listing request has been submitted successfully!');
      setIsSubmitting(false);
    }, 2000);

    // Example API call:
    // await axios.post('/your-api-endpoint', formData);
  };

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
        overflowY: 'auto', // Enables scrolling for overflowing content
      }}
    >
      {/* Overlay for better contrast */}
      <Box
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: 4,
          padding: 4,
          maxWidth: 800,
          width: '100%',
          color: 'white',
          overflowY: 'auto',  // Ensures the form scrolls
          maxHeight: '80vh', // Controls the maximum height
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Grid container spacing={2}>
            {/* Car Name */}
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

            {/* Car Model */}
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

            {/* Car Year */}
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

            {/* Car Mileage */}
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

            {/* Car Details */}
            <Grid item xs={12}>
              <TextField
                label="Car Details"
                value={carDetails}
                onChange={(e) => setCarDetails(e.target.value)}
                fullWidth
                multiline
                rows={4}
                required
                InputProps={{ style: { color: 'white' } }}
              />
            </Grid>

            {/* Email/Username */}
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

            {/* Car Color */}
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

            {/* Car Gear Type */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Gear Type (Automatic/Manual)"
                value={carGearType}
                onChange={(e) => setCarGearType(e.target.value)}
                fullWidth
                required
                InputProps={{ style: { color: 'white' } }}
              />
            </Grid>

            {/* Car Type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel sx={{ color: 'white' }}>Car Type</InputLabel>
                <Select
                  value={carType}
                  onChange={(e) => setCarType(e.target.value)}
                  label="Car Type"
                  inputProps={{ style: { color: 'white' } }}
                >
                  <MenuItem value="Sport">Sport</MenuItem>
                  <MenuItem value="Classic">Classic</MenuItem>
                  <MenuItem value="Hybrid/Electric">Hybrid/Electric</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Car Images */}
            <Grid item xs={12}>
              <InputLabel sx={{ color: 'white' }}>Upload Car Images</InputLabel>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                accept="image/*"
                style={{ marginBottom: '10px' }}
              />
              {/* Display image previews */}
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

            {/* Submit Button */}
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
        </form>

        {/* Status Message */}
        {status && (
          <Typography variant="h6" color={status.includes('submitted') ? 'green' : 'orange'} sx={{ mt: 4 }}>
            {status}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default SellYourCar;
