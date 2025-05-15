// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Admin/Staff check middleware
const isAdminOrStaff = async (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'staff') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admin or Staff role required.' });
  }
};

// Admin-only check middleware
const isAdmin = async (req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
};

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

// Login user
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

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/update-profile/:id', auth, async (req, res) => {
  try {
    const { username, email, phone, password, currentPassword } = req.body;
    const userId = req.params.id;
    
    // Security check - users can only update their own profile unless they're admin or staff
    if (req.user.id !== userId && req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }
    
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password if provided and if password change is requested
    if (password && currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
    }
    
    // Update basic info
    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    
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

// Get all users (admin and staff)
router.get('/users', auth, async (req, res) => {
  try {
    // Check if the requesting user is an admin or staff
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Access denied. Admin or Staff role required.' });
    }
    
    // Fetch all users, excluding password field
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new user (admin and staff)
router.post('/users', auth, isAdminOrStaff, async (req, res) => {
  try {
    const { username, email, password, phone, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Staff can only create regular users, not other staff or admins
    let userRole = role || 'user';
    if (req.user.role === 'staff' && (userRole === 'staff' || userRole === 'admin')) {
      userRole = 'user'; // Force to user role if staff tries to create admin/staff
    }
    
    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      role: userRole
    });
    
    await user.save();
    
    res.status(201).json({ 
      message: 'User created successfully',
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
    res.status(500).json({ message: err.message });
  }
});

// Update a user (admin or staff)
router.put('/users/:id', auth, async (req, res) => {
  try {
    // Check if the requesting user is an admin or staff
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Access denied. Admin or Staff role required.' });
    }

    const { username, email, password, phone, role } = req.body;
    const userId = req.params.id;
    
    // Get the user to be updated first
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Staff can only update regular users, not other staff or admins
    if (req.user.role === 'staff' && userToUpdate.role !== 'user') {
      return res.status(403).json({ message: 'Staff can only update regular users' });
    }
    
    // Update fields
    if (username) userToUpdate.username = username;
    if (email) userToUpdate.email = email;
    if (phone) userToUpdate.phone = phone;
    
    // Only allow admins to change roles
    if (role && req.user.role === 'admin') {
      userToUpdate.role = role;
    }
    
    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      userToUpdate.password = await bcrypt.hash(password, salt);
    }
    
    await userToUpdate.save();
    
    res.json({ 
      message: 'User updated successfully',
      user: {
        id: userToUpdate._id,
        username: userToUpdate.username,
        email: userToUpdate.email,
        phone: userToUpdate.phone,
        role: userToUpdate.role
      }
    });
  } catch (err) {
    console.error(err);
    
    // Handle duplicate email/username error
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email or username already in use' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a user (admin and staff)
router.delete('/users/:id', auth, isAdminOrStaff, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent deleting yourself
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    // Staff can only delete regular users, not other staff or admins
    if (req.user.role === 'staff' && user.role !== 'user') {
      return res.status(403).json({ message: 'Staff can only delete regular users' });
    }
    
    // Delete the user
    await User.findByIdAndDelete(userId);
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;