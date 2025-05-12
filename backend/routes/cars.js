const express = require('express');
const router = express.Router();
const multer = require('multer');
const Car = require('../models/Car');
const path = require('path');

// Set up multer storage configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store uploaded images in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

// Route for uploading car images (multiple images allowed)
router.post('/upload', upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded.' });
  }

  // Return the file paths of uploaded images
  const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
  res.json({ message: 'Files uploaded successfully.', files: imagePaths });
});

// Get all cars with filtering options
router.get('/', async (req, res) => {
  try {
    const { role = 'user', type, email, status } = req.query;
    
    // Build query based on parameters
    let query = {};
    
    // Role-based filtering - users only see approved cars unless they're the seller
    if (role === 'user' && !email) {
      query.status = 'approved';
    } 
    // Status filtering - if explicitly provided (especially for admin views)
    else if (status && ['approved', 'pending', 'rejected'].includes(status)) {
      query.status = status;
    }
    
    // Type filtering
    if (type && type !== 'All') {
      query.type = type;
    }
    
    // Email filtering - if email is provided, show all cars from that seller
    if (email) {
      query.sellerEmail = email;
    }
    
    const cars = await Car.find(query).sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single car by ID
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new car
router.post('/', async (req, res) => {
  try {
    const status = ['admin', 'staff'].includes(req.body.role) ? 'approved' : 'pending';
    
    // Check if sellerPhone is provided directly, if not, use it from phone field
    let sellerPhone = req.body.sellerPhone;
    if (!sellerPhone && req.body.phone) {
      sellerPhone = req.body.phone;
    } else if (!sellerPhone) {
      sellerPhone = ''; // Default to empty string if neither is provided
    }
    
    const carData = {
      ...req.body,
      sellerPhone,
      images: Array.isArray(req.body.images) ? req.body.images : [],
      status
    };
    
    const car = new Car(carData);
    const newCar = await car.save();
    res.status(201).json(newCar);
  } catch (err) {
    console.error('Error saving car:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update car status (admin/staff only)
router.patch('/:id/status', async (req, res) => {
  try {
    if (!['admin', 'staff'].includes(req.body.userRole)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const car = await Car.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update car details
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Handle the phone field consistently
    if (req.body.phone !== undefined && !req.body.sellerPhone) {
      updateData.sellerPhone = req.body.phone;
    } else if (updateData.sellerPhone === undefined) {
      updateData.sellerPhone = '';
    }
    
    // Ensure images is handled correctly if present
    if (updateData.images && !Array.isArray(updateData.images)) {
      updateData.images = [];
    }
    
    const car = await Car.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (err) {
    console.error('Error updating car:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a car
router.delete('/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json({ message: 'Car deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get cars count by status (for admin dashboard)
router.get('/stats/count', async (req, res) => {
  try {
    // Check if user has admin/staff role
    const { role } = req.query;
    if (!['admin', 'staff'].includes(role)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Aggregate cars by status
    const stats = await Car.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Format the results
    const result = {
      approved: 0,
      pending: 0,
      rejected: 0,
      total: 0
    };
    
    stats.forEach(item => {
      if (item._id && ['approved', 'pending', 'rejected'].includes(item._id)) {
        result[item._id] = item.count;
        result.total += item.count;
      }
    });
    
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bulk update car status (admin/staff only)
router.patch('/bulk/status', async (req, res) => {
  try {
    const { userRole, status, carIds } = req.body;
    
    // Authorization check
    if (!['admin', 'staff'].includes(userRole)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Validate status
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Validate car IDs
    if (!Array.isArray(carIds) || carIds.length === 0) {
      return res.status(400).json({ message: 'No car IDs provided' });
    }
    
    // Update multiple cars
    const result = await Car.updateMany(
      { _id: { $in: carIds } },
      { status }
    );
    
    res.json({
      message: `Updated status to ${status} for ${result.modifiedCount} cars`,
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;