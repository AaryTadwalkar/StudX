import User from "../models/User.js";
import Skill from "../models/Skill.js";
import Connection from "../models/Connection.js";
import SkillRequest from "../models/SkillRequest.js";
import BarterProposal from "../models/BarterProposal.js";

// ==================== USER SEARCH ====================

/**
 * GET /api/skill-barter/search
 * Search users by skills they have
 */
// ==================== USER SEARCH ====================

/**
 * GET /api/skill-barter/search
 * Search users by Name OR Skills
 */
export const searchUsersBySkill = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ message: "Search query must be at least 2 characters" });
    }

    const searchRegex = new RegExp(query, 'i');

    // 1. Find Users matching the name/email directly
    const usersByName = await User.find({
      $or: [
        { fullName: searchRegex }, // Matches "Vishal"
        { email: searchRegex }
      ]
    }).select('_id');
    
    // 2. Find Users who have a matching Skill
    const skillsMatching = await Skill.find({
      $or: [
        { skillName: searchRegex }, // Matches "React"
        { category: searchRegex },
        { description: searchRegex }
      ],
      isPublic: true
    }).select('user');

    // 3. Combine unique User IDs from both lists
    const userIdsByName = usersByName.map(u => u._id.toString());
    const userIdsBySkill = skillsMatching.map(s => s.user.toString());
    const allUserIds = [...new Set([...userIdsByName, ...userIdsBySkill])];

    // 4. Fetch full details for these users
    const users = await User.find({ _id: { $in: allUserIds } })
      .select('fullName email branch year')
      .lean();

    // 5. Attach their skills to the result
    const results = await Promise.all(users.map(async (user) => {
      const userSkills = await Skill.find({ 
        user: user._id,
        isPublic: true 
      });
      
      return {
        userId: user._id,
        name: user.fullName,
        email: user.email,
        branch: user.branch,
        year: user.year,
        skills: userSkills.map(s => ({
          skillId: s._id,
          skillName: s.skillName,
          category: s.category,
          level: s.level,
          badge: s.badge,
          testScore: s.testScore,
          verificationStatus: s.verificationStatus
        }))
      };
    }));

    res.json({
      success: true,
      count: results.length,
      users: results
    });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== CONNECTIONS ====================

/**
 * POST /api/skill-barter/connections/send
 * Send connection request to another user
 */
export const sendConnectionRequest = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ message: "Target user ID required" });
    }

    if (userId === targetUserId) {
      return res.status(400).json({ message: "Cannot connect with yourself" });
    }

    // Check if connection already exists
    const existing = await Connection.checkConnection(userId, targetUserId);
    if (existing) {
      return res.status(400).json({ 
        message: "Connection already exists",
        status: existing.status 
      });
    }

    // Get target user details
    const targetUser = await User.findById(targetUserId).select('-password');
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create connection requests for both users
    const connections = await Connection.create([
      {
        userId: userId,
        connectedUserId: targetUserId,
        connectedUserDetails: {
          name: targetUser.fullName,
          email: targetUser.email,
          branch: targetUser.branch,
          year: targetUser.year
        },
        initiatorId: userId,
        status: 'pending'
      },
      {
        userId: targetUserId,
        connectedUserId: userId,
        connectedUserDetails: {
          name: req.user.fullName,
          email: req.user.email,
          branch: req.user.branch,
          year: req.user.year
        },
        initiatorId: userId,
        status: 'pending'
      }
    ]);

    res.json({
      success: true,
      message: "Connection request sent",
      connection: connections[0]
    });
  } catch (error) {
    console.error("Send connection error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/skill-barter/connections/:connectionId/accept
 * Accept a connection request
 */
export const acceptConnection = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { connectionId } = req.params;

    const connection = await Connection.findOne({
      _id: connectionId,
      userId: userId,
      status: 'pending'
    });

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    // Update both connection records
    await Connection.updateMany(
      {
        $or: [
          { userId: userId, connectedUserId: connection.connectedUserId },
          { userId: connection.connectedUserId, connectedUserId: userId }
        ]
      },
      { status: 'accepted' }
    );

    res.json({
      success: true,
      message: "Connection accepted"
    });
  } catch (error) {
    console.error("Accept connection error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/skill-barter/connections
 * Get all connections for current user
 */
export const getConnections = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { status } = req.query;

    const query = { userId };
    if (status) query.status = status;

    const connections = await Connection.find(query)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      connections
    });
  } catch (error) {
    console.error("Get connections error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== SKILL REQUESTS ====================

/**
 * POST /api/skill-barter/requests
 * Create a skill request
 */
export const createSkillRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { skillName, category, description, deadline, duration, offeringInReturn } = req.body;

    if (!skillName || !category || !description) {
      return res.status(400).json({ message: "Skill name, category, and description required" });
    }

    const skillRequest = await SkillRequest.create({
      userId,
      skillName,
      category,
      description,
      deadline: deadline ? new Date(deadline) : null,
      duration,
      offeringInReturn,
      userDetails: {
        name: req.user.fullName,
        email: req.user.email,
        branch: req.user.branch,
        year: req.user.year
      }
    });

    res.status(201).json({
      success: true,
      skillRequest
    });
  } catch (error) {
    console.error("Create skill request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/skill-barter/requests
 * Get all skill requests (with filters)
 */
export const getSkillRequests = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    
    const query = { isPublic: true };
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$text = { $search: search };
    }

    const requests = await SkillRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error("Get skill requests error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/skill-barter/requests/my
 * Get current user's skill requests
 */
export const getMySkillRequests = async (req, res) => {
  try {
    const requests = await SkillRequest.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error("Get my requests error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== BARTER PROPOSALS ====================

/**
 * POST /api/skill-barter/proposals
 * Create a barter proposal
 */
export const createBarterProposal = async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { 
      toUserId, 
      offeringSkill, 
      requestingSkill, 
      message, 
      duration, 
      proposedSchedule,
      skillRequestId 
    } = req.body;

    if (!toUserId || !offeringSkill || !requestingSkill) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get target user details
    const toUser = await User.findById(toUserId).select('-password');
    if (!toUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    const proposal = await BarterProposal.create({
      fromUserId,
      toUserId,
      offeringSkill,
      requestingSkill,
      message,
      duration,
      proposedSchedule,
      skillRequestId: skillRequestId || null,
      fromUserDetails: {
        name: req.user.fullName,
        email: req.user.email,
        branch: req.user.branch,
        year: req.user.year
      },
      toUserDetails: {
        name: toUser.fullName,
        email: toUser.email,
        branch: toUser.branch,
        year: toUser.year
      }
    });

    // If responding to skill request, add to interested users
    if (skillRequestId) {
      await SkillRequest.findByIdAndUpdate(skillRequestId, {
        $push: {
          interestedUsers: {
            userId: fromUserId,
            message: message
          }
        }
      });
    }

    res.status(201).json({
      success: true,
      proposal
    });
  } catch (error) {
    console.error("Create proposal error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/skill-barter/proposals/received
 * Get proposals received by current user
 */
export const getReceivedProposals = async (req, res) => {
  try {
    const proposals = await BarterProposal.find({ 
      toUserId: req.user._id 
    })
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      proposals
    });
  } catch (error) {
    console.error("Get received proposals error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/skill-barter/proposals/sent
 * Get proposals sent by current user
 */
export const getSentProposals = async (req, res) => {
  try {
    const proposals = await BarterProposal.find({ 
      fromUserId: req.user._id 
    })
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      proposals
    });
  } catch (error) {
    console.error("Get sent proposals error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/skill-barter/proposals/:proposalId/respond
 * Accept or reject a barter proposal
 */
export const respondToProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { status, responseMessage } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const proposal = await BarterProposal.findOne({
      _id: proposalId,
      toUserId: req.user._id,
      status: 'pending'
    });

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    proposal.status = status;
    proposal.responseMessage = responseMessage;
    proposal.respondedAt = new Date();
    await proposal.save();

    res.json({
      success: true,
      message: `Proposal ${status}`,
      proposal
    });
  } catch (error) {
    console.error("Respond to proposal error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
