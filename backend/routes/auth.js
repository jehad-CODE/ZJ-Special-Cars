// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      role: 'user' // Default role
    });
    
    await user.save();
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// update the login route
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user by email instead of username
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      // Create JWT token
      const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email, role: user.role },
        'your_jwt_secret',
        { expiresIn: '1h' }
      );
      
      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  // routes/auth.js - Add this new route

// Update user profile
router.put('/update-profile/:id', async (req, res) => {
    try {
      const { username, email, phone, password } = req.body;
      const userId = req.params.id;
      
      // Find user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Update basic info
      user.username = username || user.username;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      
      // Update password if provided
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
      
      // Save updated user
      await user.save();
      
      res.json({ 
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } catch (err) {
      console.error(err);
      
      // Handle duplicate email error
      if (err.code === 11000) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;