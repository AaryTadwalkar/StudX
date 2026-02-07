import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    },
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryLocation: String,
  contactNumber: String,
  orderDate: {
    type: Date,
    default: Date.now
  },
  deliveryDate: Date
}, {
  timestamps: true
});

export default mongoose.model("Order", orderSchema);
