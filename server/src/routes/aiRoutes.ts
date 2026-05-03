import { Router } from "express";
import { generateProblem, previewProblem } from "../controllers/aiController";

const router = Router();

// POST /api/ai/generate — generate + save a problem to DB
router.post("/generate", generateProblem);

// POST /api/ai/preview — generate but don't save (for testing)
router.post("/preview", previewProblem);

export default router;