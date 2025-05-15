import React, { useState, useEffect } from 'react';
import {
  Typography, Box, TextField, Button, CircularProgress, Grid, InputLabel, MenuItem,
  Select, FormControl, Card, CardContent, CardMedia, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, Pagination, Stack, Chip,
  ImageList, ImageListItem, FormControlLabel, RadioGroup, Radio, styled
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import PendingIcon from '@mui/icons-material/PendingActions';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SortIcon from '@mui/icons-material/Sort';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';

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

// Styled Pagination component to use success colors
const StyledPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    margin: theme.spacing(0, 0.5),
  },
  // Style the pagination to use the success color
  '& .Mui-selected': {
    backgroundColor: `${theme.palette.success.main} !important`,
    color: theme.palette.common.white,
  },
  '& .MuiPaginationItem-root:hover': {
    backgroundColor: theme.palette.success.light,
  }
}));

const PendingCars: React.FC = () => {
  // State
  const [cars, setCars] = useState<Car[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Dialogs
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openSortDialog, setOpenSortDialog] = useState<boolean>(false);
  const [openGallery, setOpenGallery] = useState<boolean>(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Car form state
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<{file: File, preview: string}[]>([]);
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
  
  const itemsPerPage = 6;

  // Fetch cars when filter or sort changes
  useEffect(() => {
    fetchCars();
  }, [filter, sortBy]);
  
  // Clean up image previews on unmount
  useEffect(() => {
    return () => {
      selectedImages.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [selectedImages]);

  const fetchCars = async () => {
    try {
      setIsLoading(true);
      const params: any = { 
        role: 'staff', // Changed from 'admin' to 'staff'
        status: 'pending' 
      };
      if (filter !== 'All') params.type = filter;
      
      const response = await axios.get(`${API_URL}/cars`, { params });
      let sortedCars = [...response.data];
      
      // Apply sorting
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
      }
      
      setCars(sortedCars);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setIsLoading(false);
    }
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
        userRole: 'staff' // Changed from 'admin' to 'staff'
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
      setSelectedImages(files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      })));
    }
  };

  const handleRemoveCurrentImage = (indexToRemove: number) => {
    setCarImages(carImages.filter((_, index) => index !== indexToRemove));
  };

  const handleRemoveSelectedImage = (indexToRemove: number) => {
    setSelectedImages(selectedImages.filter((_, index) => index !== indexToRemove));
    setImageFiles(imageFiles.filter((_, index) => index !== indexToRemove));
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];
    
    const formData = new FormData();
    imageFiles.forEach(file => {
      formData.append('images', file);
    });
    
    try {
      const response = await axios.post(`${API_URL}/cars/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
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
        role: 'staff', // Changed from 'admin' to 'staff'
        status: 'pending'
      };
      
      if (selectedCar && selectedCar._id) {
        await axios.put(`${API_URL}/cars/${selectedCar._id}`, carData);
      }
      
      fetchCars();
      setIsSubmitting(false);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving car:', error);
      setIsSubmitting(false);
    }
  };

  const paginatedCars = cars.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(cars.length / itemsPerPage));

  // Text field styling
  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
    }
  };

  return (
    <Box>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 3, 
          fontWeight: 'bold', 
          color: 'white',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          textShadow: '0px 2px 3px rgba(0,0,0,0.3)'
        }}
      >
        Pending Cars
      </Typography>
      
      {/* Filters and Actions */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: 3,
        gap: 2
      }}>
        {/* Type filter buttons */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ flexWrap: 'wrap' }}>
          {['All', 'Sport', 'Classic', 'Hybrid/Electric'].map((type) => (
            <Button 
              key={type} 
              variant={filter === type ? 'contained' : 'outlined'} 
              color="success" // Changed to green
              onClick={() => { setFilter(type); setPage(1); }} 
              sx={{ mb: 1 }}
            >
              {type}
            </Button>
          ))}
        </Stack>
        
        {/* Action buttons */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button 
            variant="outlined" 
            color="success" // Changed to green
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
        </Stack>
      </Box>

      {/* Car listing */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress color="success" /> {/* Changed to green */}
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
                        <Chip size="small" icon={<PendingIcon />} label="Pending" color="warning" />
                      </Box>
                      <Typography variant="body2">Year: {car.year}</Typography>
                      <Typography variant="body2">Mileage: {car.mileage} km</Typography>
                      <Typography variant="body2">Type: {car.type} | Color: {car.color}</Typography>
                      <Typography fontWeight="bold" color="success.main" sx={{ mt: 1 }}>${car.price.toLocaleString()}</Typography> {/* Changed to green */}
                    </CardContent>
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                      <Button size="small" variant="outlined" color="success" startIcon={<PhotoLibraryIcon />} 
                        disabled={!car.images || car.images.length === 0}
                        onClick={() => handleOpenGallery(car.images)}
                        sx={{ flexGrow: { xs: 1, sm: 0 }, mb: { xs: 1, sm: 0 } }}>
                        Photos
                      </Button>
                      <Button size="small" variant="outlined" color="success" startIcon={<EditIcon />} 
                        onClick={() => handleOpenEditDialog(car)}
                        sx={{ flexGrow: { xs: 1, sm: 0 } }}>
                        Edit
                      </Button>
                      <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(car._id!)}
                        sx={{ flexGrow: { xs: 1, sm: 0 } }}>
                        Delete
                      </Button>
                    </Box>
                    <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                      <Button size="small" variant="contained" color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleStatusChange(car._id!, 'approved')}
                        sx={{ flexGrow: 1 }}>
                        Approve
                      </Button>
                      <Button size="small" variant="contained" color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => handleStatusChange(car._id!, 'rejected')}
                        sx={{ flexGrow: 1 }}>
                        Reject
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography>No pending cars found. Cars pending approval will appear here.</Typography>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Pagination */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <StyledPagination 
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
      <Dialog open={openSortDialog} onClose={() => setOpenSortDialog(false)}
        PaperProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white' } }}>
        <DialogTitle>Sort Cars</DialogTitle>
        <DialogContent>
          <RadioGroup value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <FormControlLabel value="newest" control={<Radio color="success" />} label="Newest First" /> {/* Changed to green */}
            <FormControlLabel value="oldest" control={<Radio color="success" />} label="Oldest First" /> {/* Changed to green */}
            <FormControlLabel value="priceHighToLow" control={<Radio color="success" />} label="Price: High to Low" /> {/* Changed to green */}
            <FormControlLabel value="priceLowToHigh" control={<Radio color="success" />} label="Price: Low to High" /> {/* Changed to green */}
            <FormControlLabel value="yearNewest" control={<Radio color="success" />} label="Year: Newest First" /> {/* Changed to green */}
            <FormControlLabel value="yearOldest" control={<Radio color="success" />} label="Year: Oldest First" /> {/* Changed to green */}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSortDialog(false)} variant="contained" color="success">Done</Button> {/* Changed to green */}
        </DialogActions>
      </Dialog>

      {/* Edit Car Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md"
        PaperProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white' } }}>
        <DialogTitle>
          Edit Car
          <IconButton onClick={() => setOpenDialog(false)} sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Car Name" 
                  value={carName} 
                  onChange={(e) => setCarName(e.target.value)}
                  fullWidth 
                  required 
                  InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} 
                  sx={textFieldStyle}
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
                  InputLabelProps={{ style: { color: '#aaa' } }} 
                  sx={textFieldStyle}
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
                  InputLabelProps={{ style: { color: '#aaa' } }} 
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Car Mileage (km)" 
                  value={carMileage} 
                  onChange={(e) => setCarMileage(e.target.value)}
                  fullWidth 
                  required 
                  InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} 
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="Car Details" 
                  value={carDetails} 
                  onChange={(e) => setCarDetails(e.target.value)}
                  multiline 
                  rows={3} 
                  fullWidth 
                  required 
                  InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} 
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Contact Email" 
                  value={carEmail} 
                  onChange={(e) => setCarEmail(e.target.value)}
                  fullWidth 
                  required 
                  InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} 
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Phone Number" 
                  value={carPhone} 
                  onChange={(e) => setCarPhone(e.target.value)}
                  fullWidth 
                  InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} 
                  sx={textFieldStyle}
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
                  InputLabelProps={{ style: { color: '#aaa' } }} 
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Price ($)" 
                  type="number" 
                  value={carPrice} 
                  onChange={(e) => setCarPrice(e.target.value)}
                  fullWidth 
                  required 
                  InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} 
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel sx={{ color: '#aaa' }}>Gear Type</InputLabel>
                  <Select 
                    value={carGearType} 
                    onChange={(e) => setCarGearType(e.target.value)} 
                    inputProps={{ style: { color: 'white' } }}
                    sx={textFieldStyle}
                  >
                    <MenuItem value="Automatic">Automatic</MenuItem>
                    <MenuItem value="Manual">Manual</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel sx={{ color: '#aaa' }}>Car Type</InputLabel>
                  <Select 
                    value={carType} 
                    onChange={(e) => setCarType(e.target.value)}
                    inputProps={{ style: { color: 'white' } }}
                    sx={textFieldStyle}
                  >
                    <MenuItem value="Sport">Sport</MenuItem>
                    <MenuItem value="Classic">Classic</MenuItem>
                    <MenuItem value="Hybrid/Electric">Hybrid/Electric</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <InputLabel sx={{ color: 'white', mb: 1 }}>Car Images</InputLabel>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ color: 'white' }} />
                
                {/* Image previews */}
                {selectedImages.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">New Images ({selectedImages.length}):</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {selectedImages.map((img, index) => (
                        <Box key={`new-${index}`} sx={{ position: 'relative' }}>
                          <Box component="img" src={img.preview}
                            sx={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 1 }} />
                          <IconButton size="small" sx={{
                              position: 'absolute', top: -8, right: -8, backgroundColor: 'red',
                              color: 'white', padding: '2px'
                            }}
                            onClick={() => handleRemoveSelectedImage(index)}>
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
                    <Typography variant="subtitle2">Current Images ({carImages.length}):</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {carImages.map((img, index) => (
                        <Box key={`existing-${index}`} sx={{ position: 'relative' }}>
                          <Box component="img" src={`http://localhost:5000${img}`}
                            sx={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 1 }} />
                          <IconButton size="small" sx={{
                              position: 'absolute', top: -8, right: -8, backgroundColor: 'red',
                              color: 'white', padding: '2px'
                            }}
                            onClick={() => handleRemoveCurrentImage(index)}>
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
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: 'white' }}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleSubmit} disabled={isSubmitting}> {/* Changed to green */}
            {isSubmitting ? 'Saving...' : 'Update Car'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Gallery Dialog */}
      <Dialog open={openGallery} onClose={() => setOpenGallery(false)} fullWidth maxWidth="md"
        PaperProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white' } }}>
        <DialogTitle>
          Car Images
          <IconButton onClick={() => setOpenGallery(false)} sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}>
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

export default PendingCars;