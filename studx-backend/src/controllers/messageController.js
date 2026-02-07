import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

/**
 * GET /api/messages/conversations
 * Get all conversations for the logged-in user
 */
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const conversations = await Conversation.find({
      participants: userId
    })
    .sort({ 'lastMessage.timestamp': -1 })
    .lean();

    // Format for frontend
    const formatted = conversations.map(conv => {
      // Find the other participant
      const otherParticipant = conv.participantDetails.find(
        p => p.userId.toString() !== userId
      );

      return {
        id: conv._id,
        name: otherParticipant?.name || 'Unknown User',
        email: otherParticipant?.email || '',
        branch: otherParticipant?.branch || '',
        lastMessage: conv.lastMessage?.text || 'No messages yet',
        time: conv.lastMessage?.timestamp 
          ? formatTimestamp(conv.lastMessage.timestamp) 
          : 'Just now',
        unreadCount: (conv.unreadCount && conv.unreadCount[userId]) || 0
      };
    });

    res.json({ conversations: formatted });
  } catch (err) {
    console.error("Get conversations error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/messages/conversations
 * Start a new conversation with another user
 */
export const startConversation = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { otherUserId, otherUserName, otherUserEmail } = req.body;

    if (!otherUserId) {
      return res.status(400).json({ message: "Other user ID required" });
    }

    // Check if conversation already exists
    const existing = await Conversation.findBetweenUsers(userId, otherUserId);
    
    if (existing) {
      return res.json({ 
        conversationId: existing._id,
        message: "Conversation already exists" 
      });
    }

    // Get current user details
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get other user details if not provided
    let otherUser;
    if (!otherUserName || !otherUserEmail) {
      otherUser = await User.findById(otherUserId);
      if (!otherUser) {
        return res.status(404).json({ message: "Other user not found" });
      }
    }

    // Create new conversation
    const conversation = await Conversation.create({
      participants: [userId, otherUserId],
      participantDetails: [
        {
          userId: currentUser._id,
          name: currentUser.fullName,
          email: currentUser.email,
          branch: currentUser.branch
        },
        {
          userId: otherUserId,
          name: otherUserName || otherUser?.fullName || 'Unknown',
          email: otherUserEmail || otherUser?.email || '',
          branch: otherUser?.branch || ''
        }
      ],
      unreadCount: {
        [userId]: 0,
        [otherUserId]: 0
      }
    });

    res.json({ 
      conversationId: conversation._id,
      message: "Conversation created successfully" 
    });
  } catch (err) {
    console.error("Start conversation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/messages/conversations/:conversationId
 * Get all messages in a conversation
 */
export const getMessages = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { conversationId } = req.params;

    // Verify user is part of this conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Get messages
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .lean();

    // Mark messages as read
    await Message.updateMany(
      { 
        conversationId, 
        senderId: { $ne: userId },
        isRead: false 
      },
      { isRead: true }
    );

    // Reset unread count for this user
    // Ensure unreadCount exists, update it, and mark as modified
    if (!conversation.unreadCount) conversation.unreadCount = {};
    conversation.unreadCount[userId] = 0;
    conversation.markModified('unreadCount');
    await conversation.save();

    // Format messages for frontend
    const formatted = messages.map(msg => ({
      id: msg._id,
      sender: msg.senderName,
      text: msg.text,
      timestamp: formatTime(msg.createdAt),
      isMe: msg.senderId.toString() === userId,
      isRead: msg.isRead
    }));

    res.json({ messages: formatted });
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/messages/conversations/:conversationId
 * Send a message in a conversation
 */
export const sendMessage = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text required" });
    }

    // Verify user is part of this conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Get sender details
    const sender = await User.findById(userId);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    // Create message
    const message = await Message.create({
      conversationId,
      senderId: userId,
      senderName: sender.fullName,
      text: text.trim()
    });

    // Update conversation's last message
    conversation.lastMessage = {
      text: text.trim(),
      senderId: userId,
      timestamp: new Date()
    };

    // Increment unread count for other participant
    const otherParticipantId = conversation.participants.find(
      p => p.toString() !== userId
    );
    if (otherParticipantId) {
  const otherId = otherParticipantId.toString();
  // Ensure unreadCount object exists
    if (!conversation.unreadCount) conversation.unreadCount = {};
    
    // Get current count safely
      const currentCount = conversation.unreadCount[otherId] || 0;
      
      // Update and mark modified
      conversation.unreadCount[otherId] = currentCount + 1;
      conversation.markModified('unreadCount');
    }

    await conversation.save();

    // Return formatted message
    const formatted = {
      id: message._id,
      sender: sender.fullName,
      text: message.text,
      timestamp: formatTime(message.createdAt),
      isMe: true,
      isRead: false
    };

    res.json({ 
      message: formatted,
      success: true 
    });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /api/messages/conversations/:conversationId
 * Delete a conversation
 */
export const deleteConversation = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { conversationId } = req.params;

    // Verify user is part of this conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Delete all messages in this conversation
    await Message.deleteMany({ conversationId });

    // Delete conversation
    await Conversation.deleteOne({ _id: conversationId });

    res.json({ message: "Conversation deleted successfully" });
  } catch (err) {
    console.error("Delete conversation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper function to format timestamp
function formatTimestamp(date) {
  const now = new Date();
  const messageDate = new Date(date);
  const diffMs = now - messageDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return messageDate.toLocaleDateString();
}

// Helper function to format time
function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}
