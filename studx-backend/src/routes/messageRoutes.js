import express from "express";
import { 
  getConversations,
  startConversation,
  getMessages,
  sendMessage,
  deleteConversation
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/messages/conversations - Get all conversations
router.get("/conversations", getConversations);

// POST /api/messages/conversations - Start new conversation
router.post("/conversations", startConversation);

// GET /api/messages/conversations/:conversationId - Get messages in conversation
router.get("/conversations/:conversationId", getMessages);

// POST /api/messages/conversations/:conversationId - Send message
router.post("/conversations/:conversationId", sendMessage);

// DELETE /api/messages/conversations/:conversationId - Delete conversation
router.delete("/conversations/:conversationId", deleteConversation);

export default router;
