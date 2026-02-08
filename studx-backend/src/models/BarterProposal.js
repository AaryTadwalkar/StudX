import mongoose from "mongoose";

const BarterProposalSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // What the sender is offering
  offeringSkill: {
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill'
    },
    skillName: String,
    description: String
  },
  // What the sender wants in return
  requestingSkill: {
    skillName: String,
    description: String
  },
  message: {
    type: String,
    maxlength: 500
  },
  duration: {
    type: String // e.g., "2 hours", "1 week"
  },
  proposedSchedule: {
    type: String // e.g., "Weekends", "After 6 PM"
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  // User details for quick access
  fromUserDetails: {
    name: String,
    email: String,
    branch: String,
    year: Number
  },
  toUserDetails: {
    name: String,
    email: String,
    branch: String,
    year: Number
  },
  // Linked skill request if this is in response to one
  skillRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillRequest'
  },
  responseMessage: String,
  respondedAt: Date
}, {
  timestamps: true
});

// Indexes
BarterProposalSchema.index({ fromUserId: 1, status: 1 });
BarterProposalSchema.index({ toUserId: 1, status: 1 });
BarterProposalSchema.index({ skillRequestId: 1 });

const BarterProposal = mongoose.model("BarterProposal", BarterProposalSchema);

export default BarterProposal;
