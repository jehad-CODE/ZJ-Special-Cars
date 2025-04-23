// models/Car.js
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: String, required: true },
  mileage: { type: String, required: true },
  color: { type: String, required: true },
  gearType: { type: String, required: true },
  type: { type: String, required: true },
  details: { type: String, required: true },
  sellerEmail: { type: String, required: true },
  sellerPhone: { type: String, required: true },
  images: [{ type: String, required: true }],
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin', 'staff'], 
    required: true 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Car', carSchema);
