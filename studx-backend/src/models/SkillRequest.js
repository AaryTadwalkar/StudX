import mongoose from "mongoose";

const SkillRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  skillName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  deadline: {
    type: Date
  },
  duration: {
    type: String, // e.g., "2 weeks", "1 month"
  },
  offeringInReturn: {
    type: String, // What they're willing to offer in exchange
    maxlength: 300
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  // User details
  userDetails: {
    name: String,
    email: String,
    branch: String,
    year: Number
  },
  // Interested users who want to help
  interestedUsers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    proposedAt: {
      type: Date,
      default: Date.now
    }
  }],
  acceptedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for fast queries
SkillRequestSchema.index({ skillName: 'text', description: 'text' });
SkillRequestSchema.index({ userId: 1, status: 1 });
SkillRequestSchema.index({ status: 1, createdAt: -1 });
SkillRequestSchema.index({ category: 1 });

const SkillRequest = mongoose.model("SkillRequest", SkillRequestSchema);

export default SkillRequest;
