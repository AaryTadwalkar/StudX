import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  searchUsersBySkill,
  sendConnectionRequest,
  acceptConnection,
  getConnections,
  createSkillRequest,
  getSkillRequests,
  getMySkillRequests,
  createBarterProposal,
  getReceivedProposals,
  getSentProposals,
  respondToProposal
} from "../controllers/skillBarterController.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// ==================== SEARCH ====================
router.get("/search", searchUsersBySkill);

// ==================== CONNECTIONS ====================
router.post("/connections/send", sendConnectionRequest);
router.put("/connections/:connectionId/accept", acceptConnection);
router.get("/connections", getConnections);

// ==================== SKILL REQUESTS ====================
router.post("/requests", createSkillRequest);
router.get("/requests", getSkillRequests);
router.get("/requests/my", getMySkillRequests);

// ==================== BARTER PROPOSALS ====================
router.post("/proposals", createBarterProposal);
router.get("/proposals/received", getReceivedProposals);
router.get("/proposals/sent", getSentProposals);
router.put("/proposals/:proposalId/respond", respondToProposal);

export default router;
