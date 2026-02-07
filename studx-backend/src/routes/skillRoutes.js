
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createSkill,
  submitTestResult,
  uploadMediaProof,
  getUserSkills,
  deleteSkill
} from "../controllers/skillController.js";

const router = express.Router();

router.post("/", protect, createSkill);
router.post("/test-result", protect, submitTestResult);
router.post("/media-proof", protect, uploadMediaProof);
router.get("/my-skills", protect, getUserSkills);
router.delete("/:id", protect, deleteSkill);

export default router;