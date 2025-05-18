import React, { useState, useEffect } from 'react';
import {
  Typography, Box, TextField, Button, CircularProgress, Grid, InputLabel, MenuItem,
  Select, FormControl, Card, CardContent, CardMedia, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, Pagination, Stack, Chip,
  ImageList, ImageListItem, FormControlLabel, RadioGroup, Radio
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SortIcon from '@mui/icons-material/Sort';
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
  createdAt?: string;
}

const API_URL = 'http://localhost:5000/api';

const ApprovedCars: React.FC = () => {
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
  const [sortBy, setSortBy] = useState<string>('newest');
  const [openSortDialog, setOpenSortDialog] = useState<boolean>(false);
  
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
  
  const itemsPerPage = 6;

  // Fetch cars on component mount and filter/sort change
  useEffect(() => {
    fetchCars();
  }, [filter, sortBy]);
  
  // Cleanup for image previews
  useEffect(() => {
    return () => {
      selectedImages.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [selectedImages]);

  const fetchCars = async () => {
    try {
      setIsLoading(true);
      const params: any = { 
        role: 'admin',
        status: 'approved'  // Only get approved cars
      };
      if (filter !== 'All') params.type = filter;
      
      const response = await axios.get(`${API_URL}/cars`, { params });
      
      // Sort the cars based on the selected sort option
      let sortedCars = [...response.data];
      
      switch (sortBy) {
        case 'newest':
          sortedCars.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          break;
        case 'oldest':
          sortedCars.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
          break;
        case 'priceHighToLow':
          sortedCars.sort((a, b) => b.price - a.price);
          break;
        case 'priceLowToHigh':
          sortedCars.sort((a, b) => a.price - b.price);
          break;
        case 'yearNewest':
          sortedCars.sort((a, b) => b.year - a.year);
          break;
        case 'yearOldest':
          sortedCars.sort((a, b) => a.year - b.year);
          break;
        default:
          // Default to newest first
          sortedCars.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      }
      
      setCars(sortedCars);
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
        imagePaths = [...uploadedPaths, ...imagePaths]; 
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

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortBy(event.target.value);
    setPage(1); // Reset to first page when sort changes
  };

  const paginatedCars = cars.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(cars.length / itemsPerPage)); // Always at least 1 page

  return (
    <Box>
      
      {/* Filter, Sort and Add buttons */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: 3,
        gap: 2
      }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ flexWrap: 'wrap' }}>
          {['All', 'Sport', 'Classic', 'Hybrid/Electric'].map((type) => (
            <Button key={type} variant={filter === type ? 'contained' : 'outlined'} 
              onClick={() => { setFilter(type); setPage(1); }} sx={{ mb: 1 }}>
              {type}
            </Button>
          ))}
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<SortIcon />} 
            onClick={() => setOpenSortDialog(true)}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Sort By: {sortBy === 'newest' ? 'Newest First' : 
                      sortBy === 'oldest' ? 'Oldest First' : 
                      sortBy === 'priceHighToLow' ? 'Price: High to Low' : 
                      sortBy === 'priceLowToHigh' ? 'Price: Low to High' :
                      sortBy === 'yearNewest' ? 'Year: Newest First' :
                      'Year: Oldest First'}
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />} 
            onClick={handleOpenAddDialog}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Add Car
          </Button>
        </Stack>
      </Box>

      {/* Car listing */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedCars.length > 0 ? (
              paginatedCars.map((car) => (
                <Grid item xs={12} sm={6} md={4} key={car._id}>
                  <Card sx={{ 
                    borderRadius: 2, 
                    boxShadow: 2, 
                    height: '100%', 
                    backgroundColor: '#1c1c1c', 
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <CardMedia 
                      component="img" 
                      image={car.images && car.images.length > 0 
                        ? `http://localhost:5000${car.images[0]}` 
                        : '/src/assets/car-placeholder.jpg'} 
                      alt={`${car.name} image`}
                      sx={{ height: 180, objectFit: 'cover' }} 
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" noWrap sx={{ maxWidth: '70%' }}>{car.name} - {car.model}</Typography>
                        <Chip size="small" icon={<CheckCircleIcon />} label="Approved" color="success" />
                      </Box>
                      <Typography variant="body2">Year: {car.year}</Typography>
                      <Typography variant="body2">Mileage: {car.mileage} km</Typography>
                      <Typography variant="body2">Color: {car.color}</Typography>
                      <Typography variant="body2">Type: {car.type}</Typography>
                      {car.sellerPhone && <Typography variant="body2">Phone: {car.sellerPhone}</Typography>}
                      <Typography fontWeight="bold" color="primary" sx={{ mt: 1 }}>${car.price.toLocaleString()}</Typography>
                    </CardContent>
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        startIcon={<PhotoLibraryIcon />}
                        disabled={!car.images || car.images.length === 0}
                        onClick={() => handleOpenGallery(car.images)}
                        sx={{ flexGrow: { xs: 1, sm: 0 }, mb: { xs: 1, sm: 0 } }}
                      >
                        Photos
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenEditDialog(car)}
                        sx={{ flexGrow: { xs: 1, sm: 0 } }}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error" 
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(car._id!)}
                        sx={{ flexGrow: { xs: 1, sm: 0 } }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography>No approved cars found. Add your first car or change the filter.</Typography>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Pagination - always shown */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination 
              count={totalPages} 
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              size="large"
              hideNextButton
              hidePrevButton
            />
          </Box>
        </>
      )}

      {/* Sort Dialog */}
      <Dialog 
        open={openSortDialog} 
        onClose={() => setOpenSortDialog(false)}
        PaperProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white', borderRadius: 2 } }}
      >
        <DialogTitle>Sort Cars</DialogTitle>
        <DialogContent>
          <RadioGroup value={sortBy} onChange={handleSortChange}>
            <FormControlLabel value="newest" control={<Radio sx={{ color: 'white' }} />} label="Newest First" />
            <FormControlLabel value="oldest" control={<Radio sx={{ color: 'white' }} />} label="Oldest First" />
            <FormControlLabel value="priceHighToLow" control={<Radio sx={{ color: 'white' }} />} label="Price: High to Low" />
            <FormControlLabel value="priceLowToHigh" control={<Radio sx={{ color: 'white' }} />} label="Price: Low to High" />
            <FormControlLabel value="yearNewest" control={<Radio sx={{ color: 'white' }} />} label="Year: Newest First" />
            <FormControlLabel value="yearOldest" control={<Radio sx={{ color: 'white' }} />} label="Year: Oldest First" />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSortDialog(false)} variant="contained">Done</Button>
        </DialogActions>
      </Dialog>

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
            <ImageList cols={2} gap={8} sx={{ 
              '& .MuiImageListItem-root': { 
                width: '100%', 
                '@media (max-width: 600px)': {
                  width: '100%',
                  gridColumnEnd: 'span 2 !important',
                }
              } 
            }}>
              {galleryImages.map((img, index) => (
                <ImageListItem key={index}>
                  <img 
                    src={`http://localhost:5000${img}`} 
                    alt={`Car image ${index + 1}`} 
                    loading="lazy" 
                    style={{ width: '100%', borderRadius: 4 }} 
                  />
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

export default ApprovedCars;