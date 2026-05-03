import { Request, Response } from "express";
import Problem from "../models/Problem";

// Get all problems (list view)
export const getAllProblems = async (req: Request, res: Response) => {
  try {
    const { difficulty, tags } = req.query;
    
    // Build filter object
    const filter: any = {};
    
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    
    if (tags) {
      const tagArray = typeof tags === 'string' ? tags.split(',') : tags;
      filter.tags = { $in: tagArray };
    }

    // Get problems with only essential fields for list view
    const problems = await Problem.find(filter)
      .select('problemId title difficulty tags description')
      .sort({ difficulty: 1, title: 1 });

    res.json({
      success: true,
      count: problems.length,
      data: problems,
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching problems",
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get single problem by ID (complete with all frames)
export const getProblemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findOne({ problemId: id });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: `Problem with ID '${id}' not found`,
      });
    }

    res.json({
      success: true,
      data: problem,
    });
  } catch (error) {
    console.error(`Error fetching problem ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: "Error fetching problem",
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get only algorithm tutorial for a problem
export const getAlgorithmTutorial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findOne({ problemId: id })
      .select('algorithmTutorial');

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: `Problem with ID '${id}' not found`,
      });
    }

    res.json({
      success: true,
      data: problem.algorithmTutorial,
    });
  } catch (error) {
    console.error(`Error fetching algorithm tutorial for ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: "Error fetching algorithm tutorial",
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get only problem solution for a problem
export const getProblemSolution = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findOne({ problemId: id })
      .select('problemSolution testCase');

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: `Problem with ID '${id}' not found`,
      });
    }

    res.json({
      success: true,
      data: problem.problemSolution,
    });
  } catch (error) {
    console.error(`Error fetching problem solution for ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: "Error fetching problem solution",
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get problem statistics
export const getProblemStats = async (req: Request, res: Response) => {
  try {
    const totalProblems = await Problem.countDocuments();
    
    const byDifficulty = await Problem.aggregate([
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 },
        },
      },
    ]);

    const byTag = await Problem.aggregate([
      { $unwind: "$tags" },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      data: {
        total: totalProblems,
        byDifficulty: byDifficulty.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>),
        topTags: byTag.map(item => ({
          tag: item._id,
          count: item.count,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching problem stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching problem statistics",
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};