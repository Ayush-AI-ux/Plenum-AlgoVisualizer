import { Router } from "express";
import {
  getAllProblems,
  getProblemById,
  getAlgorithmTutorial,
  getProblemSolution,
  getProblemStats,
} from "../controllers/problemController";

const router = Router();

// Get all problems (with optional filters)
// Query params: ?difficulty=Easy&tags=Array,Hash
router.get("/", getAllProblems);

// Get problem statistics
router.get("/stats", getProblemStats);

// Get single problem by ID (complete data)
router.get("/:id", getProblemById);

// Get only algorithm tutorial for a problem
router.get("/:id/tutorial", getAlgorithmTutorial);

// Get only problem solution for a problem
router.get("/:id/solution", getProblemSolution);

export default router;