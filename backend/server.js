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

const upload = multer({ storage: storage });

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

// Handle life product image uploads
app.post('/api/life-products/upload', upload.array('images', 5), (req, res) => {
  if (!req.files) {
    return res.status(400).json({ message: 'No files uploaded.' });
  }
  
  // Return the file paths of uploaded images
  const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
  res.json({ message: 'Files uploaded successfully.', files: imagePaths });
});

// Handle car accessories image uploads
app.post('/api/car-accessories/upload', upload.array('images', 5), (req, res) => {
  if (!req.files) {
    return res.status(400).json({ message: 'No files uploaded.' });
  }
  
  // Return the file paths of uploaded images
  const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
  res.json({ message: 'Files uploaded successfully.', files: imagePaths });
});

// Create uploads folder if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
  console.log('Created uploads directory');
}

// Database connection
mongoose.connect('mongodb://localhost:27017/ZJSpecialCars', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));