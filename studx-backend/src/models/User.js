import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  year: {
    type: Number,
    required: true
  },

  branch: {
    type: String,
    required: true
  },

  prn: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    match: /@vit\.edu$/
  },

  phone: {
    type: String,
    required: true
  },

  passwordHash: {
    type: String,
    required: true
  },

  isEmailVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);