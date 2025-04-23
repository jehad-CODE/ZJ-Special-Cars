// routes/cars.js
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
    cb(null, Date.now() + path.extname(file.originalname)); // Make filenames unique by appending timestamp
  }
});

const upload = multer({ storage: storage });

// Route for uploading car images (multiple images allowed)
router.post('/upload', upload.array('images', 5), (req, res) => {
  if (!req.files) {
    return res.status(400).json({ message: 'No files uploaded.' });
  }

  // Return the file paths of uploaded images
  const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
  res.json({ message: 'Files uploaded successfully.', files: imagePaths });
});

// Get all approved cars or all cars for admins/staff
router.get('/', async (req, res) => {
  try {
    const { role = 'user', type } = req.query;
    
    // Build query - users only see approved cars
    const query = role === 'user' 
      ? { status: 'approved' } 
      : {};
    
    // Add type filter if provided
    if (type && type !== 'All') {
      query.type = type;
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
    // If user role, set status to pending, if admin/staff, set status to approved
    const status = ['admin', 'staff'].includes(req.body.role) ? 'approved' : 'pending';
    
    const car = new Car({
      ...req.body,
      images: req.body.images || [], // images will be an array of file paths
      status
    });
    
    const newCar = await car.save();
    res.status(201).json(newCar);
  } catch (err) {
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
    if (!['approved', 'rejected'].includes(status)) {
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
    const car = await Car.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (err) {
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

module.exports = router;
