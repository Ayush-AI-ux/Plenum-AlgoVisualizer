import mongoose, { Schema, Document } from "mongoose";

// ========================================
// INTERFACES
// ========================================

export interface IFrame {
  frameNumber: number;
  title: string;
  explanation: string;
  code?: string;
  duration: number; // seconds
  scene3D: {
    camera: {
      position: number[];
      lookAt?: number[];
      animation?: string;
    };
    objects: Array<{
      type: string;
      id?: string;
      position: number[];
      [key: string]: any; // flexible for different object properties
    }>;
    lights?: Array<{
      type: string;
      position?: number[];
      intensity?: number;
      [key: string]: any;
    }>;
    particles?: {
      type: string;
      position: number[];
      count: number;
      [key: string]: any;
    };
  };
}

export interface IAlgorithmTutorial {
  algorithmId: string;
  algorithmName: string;
  description: string;
  frames: IFrame[];
}

export interface IProblemSolution {
  testCase: {
    input: any;
    expectedOutput: any;
  };
  frames: IFrame[];
}

export interface IExample {
  input: string;
  output: string;
  explanation: string;
}

export interface IProblem extends Document {
  problemId: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  description: string;
  examples: IExample[];
  algorithmsRequired: string[];
  algorithmTutorial: IAlgorithmTutorial;
  problemSolution: IProblemSolution;
  solutions?: {
    [language: string]: string;
  };
  complexity: {
    time: string;
    space: string;
    explanation: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ========================================
// SCHEMAS
// ========================================

const FrameSchema = new Schema({
  frameNumber: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
  code: {
    type: String,
  },
  duration: {
    type: Number,
    required: true,
    default: 3,
  },
  scene3D: {
    camera: {
      position: {
        type: [Number],
        required: true,
        default: [0, 5, 15],
      },
      lookAt: {
        type: [Number],
        default: [0, 0, 0],
      },
      animation: String,
    },
    objects: [
      {
        type: Schema.Types.Mixed,
      },
    ],
    lights: [
      {
        type: Schema.Types.Mixed,
      },
    ],
    particles: {
      type: Schema.Types.Mixed,
    },
  },
});

const AlgorithmTutorialSchema = new Schema({
  algorithmId: {
    type: String,
    required: true,
  },
  algorithmName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  frames: {
    type: [FrameSchema],
    required: true,
  },
});

const ProblemSolutionSchema = new Schema({
  testCase: {
    input: {
      type: Schema.Types.Mixed,
      required: true,
    },
    expectedOutput: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  frames: {
    type: [FrameSchema],
    required: true,
  },
});

const ExampleSchema = new Schema({
  input: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
});

const ProblemSchema: Schema = new Schema(
  {
    problemId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
    },
    tags: {
      type: [String],
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    examples: {
      type: [ExampleSchema],
      required: true,
    },
    algorithmsRequired: {
      type: [String],
      required: true,
    },
    algorithmTutorial: {
      type: AlgorithmTutorialSchema,
      required: true,
    },
    problemSolution: {
      type: ProblemSolutionSchema,
      required: true,
    },
    solutions: {
      type: Map,
      of: String,
      default: {},
    },
    complexity: {
      time: {
        type: String,
        required: true,
      },
      space: {
        type: String,
        required: true,
      },
      explanation: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
ProblemSchema.index({ difficulty: 1, tags: 1 });
ProblemSchema.index({ problemId: 1 });

export default mongoose.model<IProblem>("Problem", ProblemSchema);