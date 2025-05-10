import React, { useState, useEffect } from 'react';
import {
  Typography, Box, TextField, Button, CircularProgress, Grid, InputLabel, MenuItem,
  Select, FormControl, Card, CardContent, CardMedia, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, Pagination, Stack, Chip,
  ImageList, ImageListItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import axios from 'axios';

// Define car interface
interface Car {
  _id?: string;
  name: string;
  model: string;
  year: number;
  mileage: string;
  details: string;
  sellerEmail: string;
  sellerPhone: string; 
  color: string;
  gearType: string;
  type: string;
  price: number;
  images: string[];
  status: string;
}

const API_URL = 'http://localhost:5000/api';

const ManageCars: React.FC = () => {
  // State management
  const [cars, setCars] = useState<Car[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [page, setPage] = useState<number>(1);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<{file: File, preview: string}[]>([]);
  
  // Form state
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
  const [carImages, setCarImages] = useState<string[]>([]);
  
  // Image gallery dialog
  const [openGallery, setOpenGallery] = useState<boolean>(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  
  const itemsPerPage = 9;

  // Fetch cars on component mount and filter change
  useEffect(() => {
    fetchCars();
  }, [filter]);
  
  // Cleanup for image previews
  useEffect(() => {
    return () => {
      selectedImages.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [selectedImages]);

  const fetchCars = async () => {
    try {
      setIsLoading(true);
      const params: any = { role: 'admin' };
      if (filter !== 'All') params.type = filter;
      
      const response = await axios.get(`${API_URL}/cars`, { params });
      setCars(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setIsLoading(false);
    }
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
    setCarPrice('');
    setCarImages([]);
    setImageFiles([]);
    selectedImages.forEach(image => URL.revokeObjectURL(image.preview));
    setSelectedImages([]);
  };

  const handleOpenAddDialog = () => {
    resetForm();
    setSelectedCar(null);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (car: Car) => {
    setSelectedCar(car);
    setCarName(car.name);
    setCarModel(car.model);
    setCarYear(String(car.year));
    setCarMileage(car.mileage);
    setCarDetails(car.details);
    setCarEmail(car.sellerEmail);
    setCarPhone(car.sellerPhone || '');
    setCarColor(car.color);
    setCarGearType(car.gearType);
    setCarType(car.type);
    setCarPrice(String(car.price));
    setCarImages(car.images || []);
    setSelectedImages([]);
    setOpenDialog(true);
  };

  const handleOpenGallery = (images: string[]) => {
    setGalleryImages(images);
    setOpenGallery(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await axios.delete(`${API_URL}/cars/${id}`);
        fetchCars(); 
      } catch (error) {
        console.error('Error deleting car:', error);
      }
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await axios.patch(`${API_URL}/cars/${id}/status`, {
        status,
        userRole: 'admin'
      });
      fetchCars();
    } catch (error) {
      console.error('Error updating car status:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(files);
      
      // Create previews for selected images
      const newSelectedImages = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      
      setSelectedImages(newSelectedImages);
    }
  };

  const handleRemoveCurrentImage = (indexToRemove: number) => {
    setCarImages(carImages.filter((_, index) => index !== indexToRemove));
  };

  const handleRemoveSelectedImage = (indexToRemove: number) => {
    const newSelectedImages = selectedImages.filter((_, index) => index !== indexToRemove);
    setSelectedImages(newSelectedImages);
    
    const newImageFiles = imageFiles.filter((_, index) => index !== indexToRemove);
    setImageFiles(newImageFiles);
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];
    
    const formData = new FormData();
    imageFiles.forEach(file => {
      formData.append('images', file);
    });
    
    try {
      const response = await axios.post(`${API_URL}/cars/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.files;
    } catch (error) {
      console.error('Error uploading images:', error);
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carName || !carModel || !carYear || !carMileage || !carColor || 
        !carGearType || !carType || !carPrice || !carEmail) {
      alert('Please fill all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let imagePaths = [...carImages];
      if (imageFiles.length > 0) {
        const uploadedPaths = await uploadImages();
        imagePaths = [...uploadedPaths, ...imagePaths]; // Add new images to beginning
      }
      
      const carData = {
        name: carName,
        model: carModel,
        year: Number(carYear),
        mileage: carMileage,
        details: carDetails,
        sellerEmail: carEmail,
        sellerPhone: carPhone,
        color: carColor,
        gearType: carGearType,
        type: carType,
        price: Number(carPrice),
        images: imagePaths,
        role: 'admin',
        status: 'approved'
      };
      
      if (selectedCar && selectedCar._id) {
        await axios.put(`${API_URL}/cars/${selectedCar._id}`, carData);
      } else {
        await axios.post(`${API_URL}/cars`, carData);
      }
      
      fetchCars();
      setIsSubmitting(false);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving car:', error);
      setIsSubmitting(false);
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'approved':
        return <Chip size="small" icon={<CheckCircleIcon />} label="Approved" color="success" />;
      case 'pending':
        return <Chip size="small" label="Pending" color="warning" />;
      case 'rejected':
        return <Chip size="small" icon={<CancelIcon />} label="Rejected" color="error" />;
      default:
        return null;
    }
  };

  const paginatedCars = cars.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>Manage Cars</Typography>
      
      {/* Filter and Add buttons */}
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

      {/* Car listing */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {paginatedCars.map((car) => (
              <Grid item xs={12} sm={6} md={4} key={car._id}>
                <Card sx={{ borderRadius: 2, boxShadow: 2, height: '100%', backgroundColor: '#1c1c1c', color: 'white' }}>
                  <CardMedia 
                    component="img" 
                    image={car.images && car.images.length > 0 
                      ? `http://localhost:5000${car.images[0]}` 
                      : '/src/assets/car-placeholder.jpg'} 
                    alt={`${car.name} image`}
                    sx={{ height: 160, objectFit: 'cover' }} 
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" noWrap>{car.name} - {car.model}</Typography>
                      {getStatusChip(car.status)}
                    </Box>
                    <Typography variant="body2">Year: {car.year}</Typography>
                    <Typography variant="body2">Mileage: {car.mileage} km</Typography>
                    <Typography variant="body2">Color: {car.color}</Typography>
                    <Typography variant="body2">Type: {car.type}</Typography>
                    {car.sellerPhone && <Typography variant="body2">Phone: {car.sellerPhone}</Typography>}
                    <Typography fontWeight="bold" color="primary">${car.price.toLocaleString()}</Typography>
                  </CardContent>
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      startIcon={<PhotoLibraryIcon />}
                      disabled={!car.images || car.images.length === 0}
                      onClick={() => handleOpenGallery(car.images)}
                    >
                      Photos
                    </Button>
                    <Button size="small" variant="outlined" startIcon={<EditIcon />}
                      onClick={() => handleOpenEditDialog(car)}>Edit</Button>
                    <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(car._id!)}>Delete</Button>
                  </Box>
                  {car.status === 'pending' && (
                    <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between' }}>
                      <Button size="small" variant="contained" color="success"
                        onClick={() => handleStatusChange(car._id!, 'approved')}>Approve</Button>
                      <Button size="small" variant="contained" color="error"
                        onClick={() => handleStatusChange(car._id!, 'rejected')}>Reject</Button>
                    </Box>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>

          {cars.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography>No cars found. Add your first car or change the filter.</Typography>
            </Box>
          )}

          {/* Pagination */}
          {cars.length > itemsPerPage && (
            <Pagination 
              count={Math.ceil(cars.length / itemsPerPage)} 
              page={page}
              onChange={(_, value) => setPage(value)}
              sx={{ mt: 3, display: 'flex', justifyContent: 'center' }} 
            />
          )}
        </>
      )}

      {/* Add/Edit Car Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        fullWidth 
        maxWidth="md"
        PaperProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white', borderRadius: 2 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {selectedCar ? 'Edit Car' : 'Add New Car'}
          <IconButton onClick={() => setOpenDialog(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Car Name" value={carName} onChange={(e) => setCarName(e.target.value)}
                  fullWidth required InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Car Model" value={carModel} onChange={(e) => setCarModel(e.target.value)}
                  fullWidth required InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Car Year" type="number" value={carYear} onChange={(e) => setCarYear(e.target.value)}
                  fullWidth required InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Car Mileage (in km)" value={carMileage} onChange={(e) => setCarMileage(e.target.value)}
                  fullWidth required InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="Car Details" value={carDetails} onChange={(e) => setCarDetails(e.target.value)}
                  multiline rows={3} fullWidth required InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="Contact Email" value={carEmail} onChange={(e) => setCarEmail(e.target.value)}
                  fullWidth required InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Phone Number" value={carPhone} onChange={(e) => setCarPhone(e.target.value)}
                  fullWidth required InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Car Color" value={carColor} onChange={(e) => setCarColor(e.target.value)}
                  fullWidth required InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel sx={{ color: '#aaa' }}>Gear Type</InputLabel>
                  <Select value={carGearType} onChange={(e) => setCarGearType(e.target.value)} inputProps={{ style: { color: 'white' } }}>
                    <MenuItem value="Automatic">Automatic</MenuItem>
                    <MenuItem value="Manual">Manual</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel sx={{ color: '#aaa' }}>Car Type</InputLabel>
                  <Select value={carType} onChange={(e) => setCarType(e.target.value)} inputProps={{ style: { color: 'white' } }}>
                    <MenuItem value="Sport">Sport</MenuItem>
                    <MenuItem value="Classic">Classic</MenuItem>
                    <MenuItem value="Hybrid/Electric">Hybrid/Electric</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Price ($)" type="number" value={carPrice} onChange={(e) => setCarPrice(e.target.value)}
                  fullWidth required InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} 
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel sx={{ color: 'white', mb: 1 }}>Car Images (Select multiple files)</InputLabel>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ color: 'white' }} />
                <Typography variant="caption" sx={{ color: '#aaa', display: 'block', mt: 1 }}>
                  No limit on number of images. You can upload as many as needed.
                </Typography>
                
                {/* Selected image previews */}
                {selectedImages.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      New Selected Images ({selectedImages.length}):
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedImages.map((img, index) => (
                        <Box key={`new-${index}`} sx={{ position: 'relative' }}>
                          <Box 
                            component="img" 
                            src={img.preview}
                            sx={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 1 }}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              backgroundColor: 'red',
                              color: 'white',
                              '&:hover': { backgroundColor: 'darkred' },
                              padding: '2px',
                              minWidth: 'unset'
                            }}
                            onClick={() => handleRemoveSelectedImage(index)}
                          >
                            <CloseIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
                
                {/* Existing images */}
                {carImages.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Current Images ({carImages.length}):
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {carImages.map((img, index) => (
                        <Box key={`existing-${index}`} sx={{ position: 'relative' }}>
                          <Box 
                            component="img" 
                            src={`http://localhost:5000${img}`}
                            sx={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 1 }}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              backgroundColor: 'red',
                              color: 'white',
                              '&:hover': { backgroundColor: 'darkred' },
                              padding: '2px',
                              minWidth: 'unset'
                            }}
                            onClick={() => handleRemoveCurrentImage(index)}
                          >
                            <CloseIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: 'white' }}>Cancel</Button>
          <Button 
            variant="contained" color="primary" onClick={handleSubmit} disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Saving...' : selectedCar ? 'Update Car' : 'Add Car'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Gallery Dialog */}
      <Dialog 
        open={openGallery} onClose={() => setOpenGallery(false)} fullWidth maxWidth="md"
        PaperProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white', borderRadius: 2 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Car Images
          <IconButton onClick={() => setOpenGallery(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {galleryImages.length > 0 ? (
            <ImageList cols={2} gap={8}>
              {galleryImages.map((img, index) => (
                <ImageListItem key={index}>
                  <img src={`http://localhost:5000${img}`} alt={`Car image ${index + 1}`} 
                    loading="lazy" style={{ width: '100%', borderRadius: 4 }} />
                </ImageListItem>
              ))}
            </ImageList>
          ) : (
            <Typography align="center">No images available for this car.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ManageCars;