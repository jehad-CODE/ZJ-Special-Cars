const express = require('express');
const router = express.Router();
const CarAccessory = require('../models/CarAccessory');

// GET all car accessories
router.get('/', async (req, res) => {
  try {
    const accessories = await CarAccessory.find().sort({ createdAt: -1 });
    res.json(accessories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single car accessory
router.get('/:id', async (req, res) => {
  try {
    const accessory = await CarAccessory.findById(req.params.id);
    if (!accessory) return res.status(404).json({ message: 'Accessory not found' });
    res.json(accessory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new car accessory
router.post('/', async (req, res) => {
  try {
    const accessory = new CarAccessory(req.body);
    const savedAccessory = await accessory.save();
    res.status(201).json(savedAccessory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update car accessory
router.put('/:id', async (req, res) => {
  try {
    const updatedAccessory = await CarAccessory.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }
    );
    if (!updatedAccessory) return res.status(404).json({ message: 'Accessory not found' });
    res.json(updatedAccessory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE car accessory
router.delete('/:id', async (req, res) => {
  try {
    const deletedAccessory = await CarAccessory.findByIdAndDelete(req.params.id);
    if (!deletedAccessory) return res.status(404).json({ message: 'Accessory not found' });
    res.json({ message: 'Accessory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET accessories by category
router.get('/category/:category', async (req, res) => {
  try {
    const accessories = await CarAccessory.find({ category: req.params.category });
    res.json(accessories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET accessories by brand
router.get('/brand/:brand', async (req, res) => {
  try {
    const accessories = await CarAccessory.find({ brand: req.params.brand });
    res.json(accessories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;