import mongoose from "mongoose";

const EmailOTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index - automatically deletes after expiry
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
EmailOTPSchema.index({ email: 1, otp: 1 });

const EmailOTP = mongoose.model("EmailOTP", EmailOTPSchema);

export default EmailOTP;
