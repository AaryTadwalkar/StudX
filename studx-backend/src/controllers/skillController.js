
import Skill from "../models/Skill.js";
import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";

// Create new skill
// Create new skill
export const createSkill = async (req, res) => {
  try {
    // 1. Destructure all fields including badge and testScore
    const { 
      skillName, 
      category, 
      level, 
      verificationType, 
      description, 
      experience, 
      badge, 
      testScore 
    } = req.body;

    // 2. Create the skill with all fields
    const newSkill = new Skill({
      user: req.user._id,
      skillName,
      category,
      level,
      verificationType,
      description,
      experience,
      // Save the badge and score from frontend
      badge: badge || 'Self-declared',
      testScore: testScore || 0,
      // Auto-verify if they have a badge other than Self-declared
      verificationStatus: (badge && badge !== 'Self-declared') ? 'verified' : 'pending'
    });

    await newSkill.save();
    
    // Populate user details for the response
    await newSkill.populate('user', 'fullName email');

    res.status(201).json({
      success: true,
      skill: newSkill
    });
  } catch (error) {
    console.error("Create skill error:", error);
    res.status(500).json({ message: "Failed to create skill", error: error.message });
  }
};

// Submit test result
export const submitTestResult = async (req, res) => {
  try {
    const { skillId, score, answers } = req.body;

    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    skill.testCompleted = true;
    skill.testScore = score;
    skill.testDate = new Date();
    
    // Auto-verify if score is above 70%
    if (score >= 70) {
      skill.verificationStatus = 'verified';
    }

    skill.calculateBadge();
    await skill.save();

    res.json({
      success: true,
      skill,
      passed: score >= 70
    });
  } catch (error) {
    console.error("Submit test error:", error);
    res.status(500).json({ message: "Failed to submit test", error: error.message });
  }
};

// Upload media proof
export const uploadMediaProof = async (req, res) => {
  try {
    const { skillId, mediaType, description, image } = req.body;

    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: 'studx/skills',
      resource_type: 'auto'
    });

    skill.mediaProofs.push({
      type: mediaType,
      url: result.secure_url,
      publicId: result.public_id,
      description
    });

    // Auto-verify if media is uploaded
    skill.verificationStatus = 'verified';
    skill.calculateBadge();
    
    await skill.save();

    res.json({
      success: true,
      skill
    });
  } catch (error) {
    console.error("Upload media error:", error);
    res.status(500).json({ message: "Failed to upload media", error: error.message });
  }
};

// Get user's skills
export const getUserSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user._id })
      .sort('-createdAt')
      .populate('user', 'fullName email');

    res.json({
      success: true,
      skills
    });
  } catch (error) {
    console.error("Get skills error:", error);
    res.status(500).json({ message: "Failed to fetch skills", error: error.message });
  }
};

// Delete skill
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete media from Cloudinary
    for (const media of skill.mediaProofs) {
      if (media.publicId) {
        await cloudinary.uploader.destroy(media.publicId);
      }
    }

    await Skill.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Skill deleted successfully"
    });
  } catch (error) {
    console.error("Delete skill error:", error);
    res.status(500).json({ message: "Failed to delete skill", error: error.message });
  }
};