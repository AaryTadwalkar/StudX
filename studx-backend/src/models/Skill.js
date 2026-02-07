import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    // enum: [
    //   'Programming',
    //   'Web Development',
    //   'Mobile Development',
    //   'Data Science',
    //   'Design',
    //   'Marketing',
    //   'Business',
    //   'Content Creation',
    //   'Music',
    //   'Sports',
    //   'Languages',
    //   'Other'
    // ]
  },
  level: {
    type: String,
    required: true,
    // enum: ['beginner', 'intermediate', 'advanced']
  },
  verificationType: {
    type: String,
    required: true,
    enum: ['test', 'media', 'both', 'self-declared']
  },
  // Test Verification
  testCompleted: {
    type: Boolean,
    default: false
  },
  testScore: {
    type: Number,
    min: 0,
    max: 100
  },
  testDate: {
    type: Date
  },
  // Media Verification
  mediaProofs: [{
    type: {
      type: String,
      // enum: ['image', 'video'],
      required: true
    },
    url: String,
    publicId: String,
    description: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Verification Status
  verificationStatus: {
    type: String,
    // enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  badge: {
    type: String,
    // enum: ['Verified', 'Expert', 'Master', 'Self-Declared'],
    default: 'Self-Declared'
  },
  // Additional Info
  description: {
    type: String,
    maxlength: 500
  },
  experience: {
    type: String, // e.g., "2 years", "6 months"
  },
  projects: [{
    name: String,
    url: String,
    description: String
  }],
  // Visibility
  isPublic: {
    type: Boolean,
    default: true
  },
  // Skills Offered/Seeking (for barter)
  offering: {
    type: Boolean,
    default: false
  },
  seeking: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
skillSchema.index({ user: 1, skillName: 1 });
skillSchema.index({ verificationStatus: 1 });
skillSchema.index({ category: 1 });

// Methods
skillSchema.methods.calculateBadge = function() {
  if (this.verificationStatus !== 'verified') {
    this.badge = 'Self-Declared';
    return;
  }

  if (this.testScore) {
    if (this.testScore >= 95) this.badge = 'Master';
    else if (this.testScore >= 85) this.badge = 'Expert';
    else this.badge = 'Verified';
  } else if (this.mediaProofs && this.mediaProofs.length > 0) {
    this.badge = 'Verified';
  }
};

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
