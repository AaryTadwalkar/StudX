import mongoose from "mongoose";

const ConnectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  connectedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  // User details for quick access
  connectedUserDetails: {
    name: String,
    email: String,
    branch: String,
    year: Number
  },
  initiatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes for fast queries
ConnectionSchema.index({ userId: 1, connectedUserId: 1 }, { unique: true });
ConnectionSchema.index({ userId: 1, status: 1 });
ConnectionSchema.index({ connectedUserId: 1, status: 1 });

// Static method to check if connection exists
ConnectionSchema.statics.checkConnection = async function(userId1, userId2) {
  return await this.findOne({
    $or: [
      { userId: userId1, connectedUserId: userId2 },
      { userId: userId2, connectedUserId: userId1 }
    ]
  });
};

const Connection = mongoose.model("Connection", ConnectionSchema);

export default Connection;
