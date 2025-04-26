const mongoose = require('mongoose');

const lifeProductSchema = new mongoose.Schema({
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
  availability: {
    type: String,
    default: 'In Stock'
  },
  details: {
    type: String
  },
  sellerContact: {
    type: String,
    trim: true
  },
  images: {
    type: [String]
  }
}, { timestamps: true });

module.exports = mongoose.model('LifeProduct', lifeProductSchema);