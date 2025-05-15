const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Save uploaded images to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Use the current timestamp for unique filenames
  }
});

// Configure multer with file size limits and file filter
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 50 // Max 50 files at once (adjust as needed)
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Serve images statically from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const carRoutes = require('./routes/cars');
const authRoutes = require('./routes/auth');
const lifeProductRoutes = require('./routes/LifeProducts');
const carAccessoryRoutes = require('./routes/carAccessories');

// API Routes
app.use('/api/cars', carRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/life-products', lifeProductRoutes);
app.use('/api/car-accessories', carAccessoryRoutes);

// Handle car image uploads (unlimited)
app.post('/api/cars/upload', upload.array('images'), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }
    
    // Return the file paths of uploaded images
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ 
      message: 'Files uploaded successfully.', 
      files: imagePaths,
      count: imagePaths.length 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading files.', error: error.message });
  }
});

// Handle life product image uploads (unlimited)
app.post('/api/life-products/upload', upload.array('images'), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }
    
    // Return the file paths of uploaded images
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ 
      message: 'Files uploaded successfully.', 
      files: imagePaths,
      count: imagePaths.length 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading files.', error: error.message });
  }
});

// Handle car accessories image uploads (unlimited)
app.post('/api/car-accessories/upload', upload.array('images'), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }
    
    // Return the file paths of uploaded images
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ 
      message: 'Files uploaded successfully.', 
      files: imagePaths,
      count: imagePaths.length 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading files.', error: error.message });
  }
});

// Error handling middleware for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files. Maximum 50 files allowed.' });
    }
  }
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
});

// Create uploads folder if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
  console.log('Created uploads directory');
}

// Database connection - UPDATED WITHOUT DEPRECATED OPTIONS
mongoose.connect('mongodb://localhost:27017/ZJSpecialCars')
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));