import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography, Box, TextField, Button, CircularProgress, Grid, InputLabel,
  Card, CardContent, CardMedia, IconButton, 
  Dialog, DialogTitle, DialogContent, DialogActions, Pagination, Stack,
  ImageList, ImageListItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

// Define accessory interface
interface LifeAccessory {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  brand?: string;
  stock?: number;
  type?: 'life';
}

interface CarAccessory {
  _id: string;
  name: string;
  price: string;
  category: string;
  brand: string;
  compatibility: string;
  installation: string;
  details: string;
  sellerContact: string;
  images: string[];
  type?: 'car';
}

type Accessory = (LifeAccessory | CarAccessory) & { type: 'car' | 'life' };

// API base URL
const API_URL = 'http://localhost:5000';

const ManageAccessories: React.FC = () => {
  // State management
  const [selectedType, setSelectedType] = useState<'all' | 'car' | 'life'>('all');
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [page, setPage] = useState<number>(1);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<{file: File, preview: string}[]>([]);
  
  // Form state for common fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [accessoryImages, setAccessoryImages] = useState<string[]>([]);
  
  // Form state for life products specific fields
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  
  // Form state for car accessories specific fields
  const [compatibility, setCompatibility] = useState('');
  const [installation, setInstallation] = useState('');
  const [details, setDetails] = useState('');
  const [sellerContact, setSellerContact] = useState('');
  
  // Image gallery dialog
  const [openGallery, setOpenGallery] = useState<boolean>(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  
  const itemsPerPage = 9;

  // Fetch accessories when type changes
  useEffect(() => {
    fetchAccessories();
    setPage(1);
  }, [selectedType]);
  
  // Cleanup for image previews
  useEffect(() => {
    return () => {
      selectedImages.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [selectedImages]);

  const fetchAccessories = async () => {
    setIsLoading(true);
    try {
      if (selectedType === 'all') {
        // Fetch from both databases
        const [carResponse, lifeResponse] = await Promise.all([
          axios.get(`${API_URL}/api/car-accessories`),
          axios.get(`${API_URL}/api/life-products`)
        ]);
        
        // Add type to each accessory
        const carAccessories = carResponse.data.map((acc: CarAccessory) => ({ ...acc, type: 'car' }));
        const lifeAccessories = lifeResponse.data.map((acc: LifeAccessory) => ({ ...acc, type: 'life' }));
        
        setAccessories([...carAccessories, ...lifeAccessories]);
      } else {
        // Fetch from specific database
        const endpoint = selectedType === 'car' ? 'car-accessories' : 'life-products';
        const response = await axios.get(`${API_URL}/api/${endpoint}`);
        const dataWithType = response.data.map((acc: any) => ({ ...acc, type: selectedType }));
        setAccessories(dataWithType);
      }
    } catch (error) {
      console.error(`Error fetching accessories:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setCategory('');
    setBrand('');
    setAccessoryImages([]);
    setImageFiles([]);
    setDescription('');
    setStock('');
    setCompatibility('');
    setInstallation('');
    setDetails('');
    setSellerContact('');
    selectedImages.forEach(image => URL.revokeObjectURL(image.preview));
    setSelectedImages([]);
  };

  const handleOpenAddDialog = () => {
    if (selectedType === 'all') {
      alert('Please select Car Accessories or Life Products before adding');
      return;
    }
    resetForm();
    setSelectedAccessory(null);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (accessory: Accessory) => {
    setSelectedAccessory(accessory);
    setName(accessory.name);
    setPrice(String(accessory.price));
    setCategory(accessory.category);
    setAccessoryImages(accessory.images || []);
    setSelectedImages([]);
    
    if (accessory.type === 'life') {
      const lifeAcc = accessory as LifeAccessory;
      setDescription(lifeAcc.description);
      setBrand(lifeAcc.brand || '');
      setStock(lifeAcc.stock ? String(lifeAcc.stock) : '');
    } else {
      const carAcc = accessory as CarAccessory;
      setBrand(carAcc.brand);
      setCompatibility(carAcc.compatibility);
      setInstallation(carAcc.installation);
      setDetails(carAcc.details);
      setSellerContact(carAcc.sellerContact);
    }
    
    setOpenDialog(true);
  };

  const handleOpenGallery = (images: string[]) => {
    setGalleryImages(images);
    setOpenGallery(true);
  };

  const handleDelete = async (id: string, type: 'car' | 'life') => {
    if (window.confirm(`Are you sure you want to delete this accessory?`)) {
      try {
        const endpoint = type === 'car' ? 'car-accessories' : 'life-products';
        await axios.delete(`${API_URL}/api/${endpoint}/${id}`);
        fetchAccessories();
      } catch (error) {
        console.error(`Error deleting accessory:`, error);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(files);
      
      const newSelectedImages = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      
      setSelectedImages(newSelectedImages);
    }
  };

  const handleRemoveCurrentImage = (indexToRemove: number) => {
    setAccessoryImages(accessoryImages.filter((_, index) => index !== indexToRemove));
  };

  const handleRemoveSelectedImage = (indexToRemove: number) => {
    const newSelectedImages = selectedImages.filter((_, index) => index !== indexToRemove);
    setSelectedImages(newSelectedImages);
    
    const newImageFiles = imageFiles.filter((_, index) => index !== indexToRemove);
    setImageFiles(newImageFiles);
  };

  const uploadImages = async (type: 'car' | 'life') => {
    if (imageFiles.length === 0) return [];
    
    const formData = new FormData();
    imageFiles.forEach(file => {
      formData.append('images', file);
    });
    
    try {
      const endpoint = type === 'car' ? 'car-accessories' : 'life-products';
      const response = await axios.post(`${API_URL}/api/${endpoint}/upload`, formData, {
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
    
    // Determine type - use selected accessory's type if editing, otherwise use selectedType
    const type = selectedAccessory ? selectedAccessory.type! : selectedType as 'car' | 'life';
    
    // Validate required fields based on type
    if (type === 'car') {
      if (!name || !price || !category || !brand || !compatibility || !installation || !details || !sellerContact) {
        alert('Please fill all required fields');
        return;
      }
    } else {
      if (!name || !price || !category || !description) {
        alert('Please fill all required fields');
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      let imagePaths = [...accessoryImages];
      if (imageFiles.length > 0) {
        const uploadedPaths = await uploadImages(type);
        imagePaths = [...uploadedPaths, ...imagePaths];
      }
      
      let accessoryData: any;
      
      if (type === 'car') {
        accessoryData = {
          name,
          price, // Car accessories store price as string
          category,
          brand,
          compatibility,
          installation,
          details,
          sellerContact,
          images: imagePaths
        };
      } else {
        accessoryData = {
          name,
          description,
          price: Number(price), // Life products store price as number
          category,
          brand: brand || undefined,
          stock: stock ? Number(stock) : undefined,
          images: imagePaths
        };
      }
      
      const endpoint = type === 'car' ? 'car-accessories' : 'life-products';
      
      if (selectedAccessory) {
        await axios.put(`${API_URL}/api/${endpoint}/${selectedAccessory._id}`, accessoryData);
      } else {
        await axios.post(`${API_URL}/api/${endpoint}`, accessoryData);
      }
      
      fetchAccessories();
      setIsSubmitting(false);
      setOpenDialog(false);
    } catch (error) {
      console.error(`Error saving accessory:`, error);
      alert('Error saving accessory. Please check all fields and try again.');
      setIsSubmitting(false);
    }
  };

  const paginatedAccessories = accessories.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Helper function to safely get image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/src/assets/accessory-placeholder.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}${imagePath}`;
  };

  // Helper function to get description or details
  const getDescription = (accessory: Accessory): string => {
    if (accessory.type === 'life') {
      return (accessory as LifeAccessory).description;
    } else {
      return (accessory as CarAccessory).details;
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        Manage Accessories
      </Typography>
      
      {/* Type selector buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Stack direction="row" spacing={1}>
          <Button 
            variant={selectedType === 'all' ? 'contained' : 'outlined'} 
            onClick={() => setSelectedType('all')}
          >
            All
          </Button>
          <Button 
            variant={selectedType === 'car' ? 'contained' : 'outlined'} 
            onClick={() => setSelectedType('car')}
          >
            Car Accessories
          </Button>
          <Button 
            variant={selectedType === 'life' ? 'contained' : 'outlined'} 
            onClick={() => setSelectedType('life')}
          >
            Life Products
          </Button>
        </Stack>
        
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />} 
          onClick={handleOpenAddDialog}
          disabled={selectedType === 'all'}
        >
          Add Accessory
        </Button>
      </Box>

      {/* Accessory listing */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {paginatedAccessories.map((accessory) => (
              <Grid item xs={12} sm={6} md={4} key={accessory._id}>
                <Card sx={{ borderRadius: 2, boxShadow: 2, height: '100%', backgroundColor: '#1c1c1c', color: 'white' }}>
                  <CardMedia 
                    component="img" 
                    image={accessory.images && accessory.images.length > 0 
                      ? getImageUrl(accessory.images[0])
                      : '/src/assets/accessory-placeholder.jpg'} 
                    alt={`${accessory.name} image`}
                    sx={{ height: 160, objectFit: 'cover' }}
                    onError={(e: any) => {
                      e.target.src = '/src/assets/accessory-placeholder.jpg';
                    }}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" noWrap>{accessory.name}</Typography>
                      <Box sx={{
                        backgroundColor: accessory.type === 'car' ? '#2196f3' : '#4caf50',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {accessory.type?.toUpperCase()}
                      </Box>
                    </Box>
                    <Typography variant="body2" noWrap sx={{ mb: 1 }}>{getDescription(accessory)}</Typography>
                    <Typography variant="body2">Category: {accessory.category}</Typography>
                    <Typography variant="body2">Brand: {accessory.brand}</Typography>
                    {accessory.type === 'car' && (
                      <Typography variant="body2">Contact: {(accessory as CarAccessory).sellerContact}</Typography>
                    )}
                    {accessory.type === 'life' && (accessory as LifeAccessory).stock !== undefined && (
                      <Typography variant="body2">Stock: {(accessory as LifeAccessory).stock}</Typography>
                    )}
                    <Typography fontWeight="bold" color="primary">
                      ${typeof accessory.price === 'number' ? accessory.price.toLocaleString() : accessory.price}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      startIcon={<PhotoLibraryIcon />}
                      disabled={!accessory.images || accessory.images.length === 0}
                      onClick={() => handleOpenGallery(accessory.images)}
                    >
                      Photos
                    </Button>
                    <Button size="small" variant="outlined" startIcon={<EditIcon />}
                      onClick={() => handleOpenEditDialog(accessory)}>Edit</Button>
                    <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(accessory._id, accessory.type!)}>Delete</Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {accessories.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography>No accessories found.</Typography>
            </Box>
          )}

          {/* Pagination */}
          {accessories.length > itemsPerPage && (
            <Pagination 
              count={Math.ceil(accessories.length / itemsPerPage)} 
              page={page}
              onChange={(_, value) => setPage(value)}
              sx={{ mt: 3, display: 'flex', justifyContent: 'center' }} 
            />
          )}
        </>
      )}

      {/* Add/Edit Accessory Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        fullWidth 
        maxWidth="md"
        PaperProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white', borderRadius: 2 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {selectedAccessory ? 'Edit Accessory' : 'Add New Accessory'}
          <IconButton onClick={() => setOpenDialog(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  fullWidth 
                  required 
                  InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} 
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Type" 
                  value={selectedAccessory ? selectedAccessory.type?.toUpperCase() : selectedType.toUpperCase()} 
                  fullWidth 
                  disabled
                  InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} 
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Price ($)" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  fullWidth 
                  required 
                  InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} 
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Category" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  fullWidth 
                  required 
                  InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} 
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Brand" 
                  value={brand} 
                  onChange={(e) => setBrand(e.target.value)}
                  fullWidth 
                  required={selectedAccessory?.type === 'car' || selectedType === 'car'}
                  InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#aaa' } }} 
                />
              </Grid>
              
              {/* Car Accessories specific fields */}
              {(selectedAccessory?.type === 'car' || (!selectedAccessory && selectedType === 'car')) && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      label="Compatibility" 
                      value={compatibility} 
                      onChange={(e) => setCompatibility(e.target.value)}
                      fullWidth 
                      required 
                      InputProps={{ style: { color: 'white' } }}
                      InputLabelProps={{ style: { color: '#aaa' } }} 
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField 
                      label="Installation" 
                      value={installation} 
                      onChange={(e) => setInstallation(e.target.value)}
                      fullWidth 
                      required 
                      InputProps={{ style: { color: 'white' } }}
                      InputLabelProps={{ style: { color: '#aaa' } }} 
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField 
                      label="Details" 
                      value={details} 
                      multiline 
                      rows={3}
                      onChange={(e) => setDetails(e.target.value)}
                      fullWidth 
                      required 
                      InputProps={{ style: { color: 'white' } }}
                      InputLabelProps={{ style: { color: '#aaa' } }} 
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField 
                      label="Seller Contact" 
                      value={sellerContact} 
                      onChange={(e) => setSellerContact(e.target.value)}
                      fullWidth 
                      required 
                      InputProps={{ style: { color: 'white' } }}
                      InputLabelProps={{ style: { color: '#aaa' } }} 
                    />
                  </Grid>
                </>
              )}
              
              {/* Life Products specific fields */}
              {(selectedAccessory?.type === 'life' || (!selectedAccessory && selectedType === 'life')) && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      label="Stock" 
                      type="number" 
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      fullWidth 
                      InputProps={{ style: { color: 'white' } }}
                      InputLabelProps={{ style: { color: '#aaa' } }} 
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField 
                      label="Description" 
                      value={description} 
                      multiline 
                      rows={3}
                      onChange={(e) => setDescription(e.target.value)}
                      fullWidth 
                      required 
                      InputProps={{ style: { color: 'white' } }}
                      InputLabelProps={{ style: { color: '#aaa' } }} 
                    />
                  </Grid>
                </>
              )}
              
              <Grid item xs={12}>
                <InputLabel sx={{ color: 'white', mb: 1 }}>Images (Select multiple files)</InputLabel>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple
                  onChange={handleImageChange}
                  style={{ color: 'white' }} 
                />
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
                {accessoryImages.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Current Images ({accessoryImages.length}):
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {accessoryImages.map((img, index) => (
                        <Box key={`existing-${index}`} sx={{ position: 'relative' }}>
                          <Box 
                            component="img" 
                            src={getImageUrl(img)}
                            sx={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 1 }}
                            onError={(e: any) => {
                              e.target.src = '/src/assets/accessory-placeholder.jpg';
                            }}
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
            variant="contained" 
            color="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting} 
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Saving...' : selectedAccessory ? 'Update' : 'Add'} Accessory
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Gallery Dialog */}
      <Dialog 
        open={openGallery} 
        onClose={() => setOpenGallery(false)} 
        fullWidth 
        maxWidth="md"
        PaperProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white', borderRadius: 2 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Accessory Images
          <IconButton onClick={() => setOpenGallery(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {galleryImages.length > 0 ? (
            <ImageList cols={2} gap={8}>
              {galleryImages.map((img, index) => (
                <ImageListItem key={index}>
                  <img 
                    src={getImageUrl(img)} 
                    alt={`Image ${index + 1}`} 
                    loading="lazy" 
                    style={{ width: '100%', borderRadius: 4 }}
                    onError={(e: any) => {
                      e.target.src = '/src/assets/accessory-placeholder.jpg';
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          ) : (
            <Typography align="center">No images available for this item.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ManageAccessories;