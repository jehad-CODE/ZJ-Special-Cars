const mongoose = require('mongoose');

const carAccessorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  compatibility: {
    type: String,
    required: true,
    trim: true
  },
  installation: {
    type: String,
    required: true,
    trim: true
  },
  details: {
    type: String,
    required: true
  },
  sellerContact: {
    type: String,
    required: true,
    trim: true
  },
  images: {
    type: [String],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('CarAccessory', carAccessorySchema);