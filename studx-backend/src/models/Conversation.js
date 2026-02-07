import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  participantDetails: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    branch: String
  }],
  lastMessage: {
    text: String,
    senderId: mongoose.Schema.Types.ObjectId,
    timestamp: Date
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  }
}, {
  timestamps: true
});

// Index for faster queries
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ 'lastMessage.timestamp': -1 });

// Static method to find conversation between two users
ConversationSchema.statics.findBetweenUsers = function(userId1, userId2) {
  return this.findOne({
    participants: { 
      $all: [userId1, userId2],
      $size: 2
    }
  });
};

const Conversation = mongoose.model("Conversation", ConversationSchema);

export default Conversation;
