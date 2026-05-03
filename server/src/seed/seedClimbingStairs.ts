import Problem from "../models/Problem";

// ========================================
// SEED DATA: CLIMBING STAIRS PROBLEM
// ========================================

export const climbingStairsProblem = {
  problemId: "climbing-stairs",
  title: "Climbing Stairs",
  difficulty: "Easy",
  tags: ["Dynamic Programming", "Math", "Memoization"],
  description: `You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
  
  examples: [
    {
      input: "n = 2",
      output: "2",
      explanation: "There are two ways to climb to the top: 1. 1 step + 1 step, 2. 2 steps",
    },
    {
      input: "n = 3",
      output: "3",
      explanation: "There are three ways: 1. 1+1+1, 2. 1+2, 3. 2+1",
    },
    {
      input: "n = 5",
      output: "8",
      explanation: "There are 8 distinct ways to climb 5 stairs.",
    },
  ],

  algorithmsRequired: ["dynamic-programming-fibonacci"],

  solutions: {
    "Python": `class Solution:
    def climbStairs(self, n: int) -> int:
        """
        Calculate number of ways to climb stairs using DP.
        This is actually the Fibonacci sequence!
        
        Time Complexity: O(n)
        Space Complexity: O(1)
        """
        if n <= 2:
            return n
        
        # Base cases
        prev2 = 1  # ways to reach step 1
        prev1 = 2  # ways to reach step 2
        
        # Build up to n
        for i in range(3, n + 1):
            current = prev1 + prev2
            prev2 = prev1
            prev1 = current
        
        return prev1`,

    "C++": `class Solution {
public:
    int climbStairs(int n) {
        /*
         * Calculate number of ways to climb stairs using DP.
         * This is actually the Fibonacci sequence!
         * 
         * Time Complexity: O(n)
         * Space Complexity: O(1)
         */
        if (n <= 2) {
            return n;
        }
        
        int prev2 = 1;  // ways to reach step 1
        int prev1 = 2;  // ways to reach step 2
        
        for (int i = 3; i <= n; i++) {
            int current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }
        
        return prev1;
    }
};`,

    "Java": `class Solution {
    /**
     * Calculate number of ways to climb stairs using DP.
     * This is actually the Fibonacci sequence!
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    public int climbStairs(int n) {
        if (n <= 2) {
            return n;
        }
        
        int prev2 = 1;  // ways to reach step 1
        int prev1 = 2;  // ways to reach step 2
        
        for (int i = 3; i <= n; i++) {
            int current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }
        
        return prev1;
    }
}`,

    "JavaScript": `/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    /*
     * Calculate number of ways to climb stairs using DP.
     * This is actually the Fibonacci sequence!
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    if (n <= 2) {
        return n;
    }
    
    let prev2 = 1;  // ways to reach step 1
    let prev1 = 2;  // ways to reach step 2
    
    for (let i = 3; i <= n; i++) {
        const current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
};`,

    "Go": `func climbStairs(n int) int {
    /*
     * Calculate number of ways to climb stairs using DP.
     * This is actually the Fibonacci sequence!
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    if n <= 2 {
        return n
    }
    
    prev2 := 1  // ways to reach step 1
    prev1 := 2  // ways to reach step 2
    
    for i := 3; i <= n; i++ {
        current := prev1 + prev2
        prev2 = prev1
        prev1 = current
    }
    
    return prev1
}`,
  },

  algorithmTutorial: {
    algorithmId: "dynamic-programming-fibonacci",
    algorithmName: "Dynamic Programming - Fibonacci Pattern",
    description: "Build solutions to larger problems using solutions to smaller subproblems, avoiding redundant calculations",
    
    frames: [
      {
        frameNumber: 1,
        title: "What is Dynamic Programming?",
        explanation: "DP breaks big problems into smaller overlapping subproblems, solves each once, and reuses the results. It's like climbing stairs: each step builds on the previous ones!",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 15], lookAt: [0, 0, 0] },
          objects: [
            { type: "staircase", steps: 5, position: [0, 0, 0], animation: "build-up" },
            { type: "text-3d", text: "DYNAMIC PROGRAMMING", position: [0, 4, 0], color: "#a855f7", size: 0.5 },
          ],
        },
      },
      {
        frameNumber: 2,
        title: "The Key Question",
        explanation: "To reach step N, you either came from step N-1 (one step) or N-2 (two steps). So: ways(N) = ways(N-1) + ways(N-2). Sound familiar?",
        duration: 5,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "staircase", steps: 5, position: [0, 0, 0], highlightSteps: [3, 4, 5] },
            { type: "arrow-path", from: 3, to: 5, label: "+2 steps", color: "#3b82f6" },
            { type: "arrow-path", from: 4, to: 5, label: "+1 step", color: "#22c55e" },
            { type: "formula", text: "ways(5) = ways(4) + ways(3)", position: [0, -2, 0] },
          ],
        },
      },
      {
        frameNumber: 3,
        title: "It's Fibonacci!",
        explanation: "This is the famous Fibonacci sequence! F(n) = F(n-1) + F(n-2). Each number is the sum of the previous two. Nature loves this pattern!",
        duration: 5,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "fibonacci-sequence", values: [1, 1, 2, 3, 5, 8, 13], position: [0, 0, 0], animated: true },
            { type: "connection-lines", showing: true, color: "#a855f7" },
            { type: "text-3d", text: "Fibonacci Pattern!", position: [0, 3, 0], color: "#FFD700", size: 0.6 },
          ],
        },
      },
      {
        frameNumber: 4,
        title: "Two Approaches",
        explanation: "Recursive (simple but slow - O(2^n)): calculates same values many times. DP (smart and fast - O(n)): calculates each value once!",
        duration: 5,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "comparison",
              recursive: { time: "O(2^n)", visual: "tree", redundant: true },
              dp: { time: "O(n)", visual: "linear", optimized: true },
              position: [0, 0, 0]
            },
          ],
        },
      },
      {
        frameNumber: 5,
        title: "Space Optimization!",
        explanation: "We only need the last TWO values, not all N values! Store just prev1 and prev2, update as we go. O(1) space instead of O(n)!",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "variable-boxes",
              vars: [
                { name: "prev2", value: 3, color: "#ef4444" },
                { name: "prev1", value: 5, color: "#22c55e" },
                { name: "current", value: 8, color: "#3b82f6", glow: true }
              ],
              position: [0, 0, 0]
            },
            { type: "text-3d", text: "O(1) Space! ⚡", position: [0, 3, 0], color: "#22c55e", size: 0.6 },
          ],
          particles: { type: "sparkles", count: 100, color: "#a855f7" },
        },
      },
    ],
  },

  problemSolution: {
    testCase: {
      input: { n: 5 },
      expectedOutput: 8,
    },
    
    frames: [
      {
        frameNumber: 1,
        title: "Problem Setup",
        explanation: "How many distinct ways can we climb 5 stairs if we can take 1 or 2 steps at a time?",
        code: "n = 5",
        duration: 3,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "staircase", steps: 5, position: [0, 0, 0], animation: "appear" },
            { type: "text-3d", text: "5 Steps to Climb", position: [0, 4, 0], color: "#ffa64d", size: 0.6 },
          ],
        },
      },
      {
        frameNumber: 2,
        title: "Base Cases",
        explanation: "Step 1: 1 way (just one step). Step 2: 2 ways (1+1 or 2). These are our starting points!",
        code: "ways[1] = 1\nways[2] = 2",
        duration: 3,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "staircase", steps: 5, position: [0, 0, 0] },
            { type: "step-label", step: 1, value: 1, position: [-3, 0.5, 0], color: "#22c55e" },
            { type: "step-label", step: 2, value: 2, position: [-1.5, 1, 0], color: "#22c55e" },
          ],
        },
      },
      {
        frameNumber: 3,
        title: "Step 3: Building Up",
        explanation: "ways(3) = ways(2) + ways(1) = 2 + 1 = 3. We can reach step 3 in 3 different ways!",
        code: "ways[3] = ways[2] + ways[1]\n        = 2 + 1 = 3",
        duration: 4,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "staircase", steps: 5, position: [0, 0, 0] },
            { type: "step-label", step: 1, value: 1, position: [-3, 0.5, 0] },
            { type: "step-label", step: 2, value: 2, position: [-1.5, 1, 0] },
            { type: "step-label", step: 3, value: 3, position: [0, 1.5, 0], glow: true, color: "#FFD700" },
            { type: "addition-visual", from: [2, 1], to: 3, position: [0, 3, 0] },
          ],
        },
      },
      {
        frameNumber: 4,
        title: "Step 4: Continue Pattern",
        explanation: "ways(4) = ways(3) + ways(2) = 3 + 2 = 5. The pattern continues!",
        code: "ways[4] = ways[3] + ways[2]\n        = 3 + 2 = 5",
        duration: 4,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "staircase", steps: 5, position: [0, 0, 0] },
            { type: "step-label", step: 2, value: 2, position: [-1.5, 1, 0] },
            { type: "step-label", step: 3, value: 3, position: [0, 1.5, 0] },
            { type: "step-label", step: 4, value: 5, position: [1.5, 2, 0], glow: true, color: "#FFD700" },
            { type: "addition-visual", from: [3, 2], to: 5, position: [1.5, 3, 0] },
          ],
        },
      },
      {
        frameNumber: 5,
        title: "Step 5: Final Answer!",
        explanation: "ways(5) = ways(4) + ways(3) = 5 + 3 = 8. There are 8 distinct ways to climb 5 stairs!",
        code: "ways[5] = ways[4] + ways[3]\n        = 5 + 3 = 8",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 16], animation: "zoom-out" },
          objects: [
            { type: "staircase", steps: 5, position: [0, 0, 0] },
            { type: "step-label", step: 3, value: 3, position: [0, 1.5, 0] },
            { type: "step-label", step: 4, value: 5, position: [1.5, 2, 0] },
            { type: "step-label", step: 5, value: 8, position: [3, 2.5, 0], glow: true, color: "#22c55e" },
            { type: "result-display", position: [0, -2, 0], value: "8", color: "#22c55e", size: 2 },
          ],
          particles: { type: "success-burst", position: [3, 2.5, 0], count: 150, color: "#22c55e" },
        },
      },
      {
        frameNumber: 6,
        title: "The 8 Ways Visualized",
        explanation: "Let's see all 8 ways: (1+1+1+1+1), (2+1+1+1), (1+2+1+1), (1+1+2+1), (1+1+1+2), (2+2+1), (2+1+2), (1+2+2)",
        code: "// All 8 paths to reach step 5",
        duration: 5,
        scene3D: {
          camera: { position: [0, 6, 18] },
          objects: [
            { type: "path-visualization", paths: 8, steps: 5, position: [0, 0, 0], animated: true },
          ],
        },
      },
      {
        frameNumber: 7,
        title: "Fibonacci Sequence Revealed",
        explanation: "Look at the pattern: 1, 2, 3, 5, 8... It's Fibonacci! This climbing stairs problem IS the Fibonacci sequence!",
        code: "// Fibonacci: 1,1,2,3,5,8,13,21...\n// Stairs:     1,2,3,5,8...\n// Same pattern!",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "number-sequence", values: [1, 2, 3, 5, 8], position: [0, 0, 0], animated: true },
            { type: "text-3d", text: "Fibonacci! 🌀", position: [0, 3, 0], color: "#a855f7", size: 0.8 },
          ],
        },
      },
      {
        frameNumber: 8,
        title: "Solution Complete!",
        explanation: "Dynamic programming made this easy! O(n) time, O(1) space. We built the solution step by step!",
        code: "// Time: O(n)\n// Space: O(1)\n// Perfect! ⚡",
        duration: 4,
        scene3D: {
          camera: { position: [0, 6, 18] },
          objects: [
            { type: "staircase", steps: 5, position: [0, 0, 0], complete: true, glow: true },
            { type: "complexity-card", position: [0, -2, 0], data: { time: "O(n)", space: "O(1)" } },
            { type: "text-3d", text: "SOLVED! 🎉", position: [0, 4, 0], color: "#22c55e", size: 1 },
          ],
          particles: { type: "fireworks", position: [0, 5, 0], count: 300 },
        },
      },
    ],
  },

  complexity: {
    time: "O(n)",
    space: "O(1)",
    explanation: "We iterate through n steps once, and only store two previous values at any time, making it linear time with constant space.",
  },
};

export const seedClimbingStairs = async () => {
  try {
    const existing = await Problem.findOne({ problemId: "climbing-stairs" });
    if (existing) {
      console.log("✅ Climbing Stairs problem already exists");
      return existing;
    }

    const problem = await Problem.create(climbingStairsProblem);
    console.log("✅ Climbing Stairs problem seeded successfully!");
    console.log(`   - ${problem.algorithmTutorial.frames.length} tutorial frames`);
    console.log(`   - ${problem.problemSolution.frames.length} solution frames`);
    console.log(`   - Solutions in ${Object.keys(problem.solutions || {}).length} languages`);
    
    return problem;
  } catch (error) {
    console.error("❌ Error seeding Climbing Stairs problem:", error);
    throw error;
  }
};

export default seedClimbingStairs;