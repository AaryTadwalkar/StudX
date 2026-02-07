import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: "No description provided"
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Textbooks',
      'Electronics',
      'Notes & Study Material',
      'Lab Equipment',
      'Stationery',
      'Sports & Fitness',
      'Room Essentials',
      'Fashion & Accessories',
      'Gadgets & Tech',
      'Musical Instruments',
      'Art Supplies',
      'Bikes & Vehicles',
      'Furniture',
      'Food & Snacks',
      'Event Tickets',
      'Other'
    ]
  },
  customCategory: {
    type: String,
    trim: true
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
    default: 'Good'
  },
  images: [{
    url: String,
    publicId: String
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerName: String,
  sellerEmail: String,
  location: {
    type: String,
    default: 'VIT Campus'
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved'],
    default: 'available'
  },
  views: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search optimization
itemSchema.index({ name: 'text', description: 'text' });
itemSchema.index({ category: 1, status: 1 });
itemSchema.index({ seller: 1 });

const Item = mongoose.model("Item", itemSchema);

export default Item;
