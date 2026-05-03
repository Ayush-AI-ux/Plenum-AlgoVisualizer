import Problem from "../models/Problem";

// ========================================
// SEED DATA: MAXIMUM SUBARRAY PROBLEM
// ========================================

export const maximumSubarrayProblem = {
  problemId: "maximum-subarray",
  title: "Maximum Subarray",
  difficulty: "Medium",
  tags: ["Array", "Dynamic Programming", "Divide and Conquer"],
  description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous part of an array.`,
  
  examples: [
    {
      input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
      output: "6",
      explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
    },
    {
      input: "nums = [1]",
      output: "1",
      explanation: "The subarray [1] has the largest sum 1.",
    },
    {
      input: "nums = [5,4,-1,7,8]",
      output: "23",
      explanation: "The subarray [5,4,-1,7,8] has the largest sum 23.",
    },
  ],

  algorithmsRequired: ["kadane-algorithm"],

  solutions: {
    "Python": `class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        """
        Find maximum subarray sum using Kadane's Algorithm.
        
        Time Complexity: O(n)
        Space Complexity: O(1)
        """
        # Initialize with first element
        max_sum = nums[0]
        current_sum = nums[0]
        
        # Iterate through array starting from second element
        for i in range(1, len(nums)):
            # Either extend existing subarray or start new one
            current_sum = max(nums[i], current_sum + nums[i])
            
            # Update global maximum
            max_sum = max(max_sum, current_sum)
        
        return max_sum`,

    "C++": `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        /*
         * Find maximum subarray sum using Kadane's Algorithm.
         * 
         * Time Complexity: O(n)
         * Space Complexity: O(1)
         */
        int maxSum = nums[0];
        int currentSum = nums[0];
        
        for (int i = 1; i < nums.size(); i++) {
            // Either extend existing subarray or start new one
            currentSum = max(nums[i], currentSum + nums[i]);
            
            // Update global maximum
            maxSum = max(maxSum, currentSum);
        }
        
        return maxSum;
    }
};`,

    "Java": `class Solution {
    /**
     * Find maximum subarray sum using Kadane's Algorithm.
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    public int maxSubArray(int[] nums) {
        int maxSum = nums[0];
        int currentSum = nums[0];
        
        for (int i = 1; i < nums.length; i++) {
            // Either extend existing subarray or start new one
            currentSum = Math.max(nums[i], currentSum + nums[i]);
            
            // Update global maximum
            maxSum = Math.max(maxSum, currentSum);
        }
        
        return maxSum;
    }
}`,

    "JavaScript": `/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    /*
     * Find maximum subarray sum using Kadane's Algorithm.
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    let maxSum = nums[0];
    let currentSum = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        // Either extend existing subarray or start new one
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        
        // Update global maximum
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
};`,

    "Go": `func maxSubArray(nums []int) int {
    /*
     * Find maximum subarray sum using Kadane's Algorithm.
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    maxSum := nums[0]
    currentSum := nums[0]
    
    for i := 1; i < len(nums); i++ {
        // Either extend existing subarray or start new one
        if nums[i] > currentSum + nums[i] {
            currentSum = nums[i]
        } else {
            currentSum = currentSum + nums[i]
        }
        
        // Update global maximum
        if currentSum > maxSum {
            maxSum = currentSum
        }
    }
    
    return maxSum
}`,
  },

  algorithmTutorial: {
    algorithmId: "kadane-algorithm",
    algorithmName: "Kadane's Algorithm",
    description: "An efficient dynamic programming algorithm for finding the maximum sum of a contiguous subarray in O(n) time",
    
    frames: [
      {
        frameNumber: 1,
        title: "The Maximum Subarray Problem",
        explanation: "Given an array, we need to find the contiguous subarray with the largest sum. Brute force would check all subarrays (O(n²) or O(n³)), but we can do better!",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 15], lookAt: [0, 0, 0] },
          objects: [
            { type: "array", values: [-2, 1, -3, 4, -1, 2, 1, -5, 4], position: [0, 0, 0], animation: "fly-in" },
            { type: "text-3d", text: "Find Max Sum", position: [0, 4, 0], color: "#a855f7", size: 0.6 },
          ],
        },
      },
      {
        frameNumber: 2,
        title: "Kadane's Brilliant Insight",
        explanation: "At each position, we ask: Should we EXTEND the current subarray, or START a new one? If current sum is negative, starting fresh is better!",
        duration: 5,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "decision-tree",
              question: "At position i",
              options: ["Extend current", "Start new"],
              position: [0, 0, 0]
            },
            { type: "formula", text: "max(nums[i], currentSum + nums[i])", position: [0, -3, 0] },
          ],
        },
      },
      {
        frameNumber: 3,
        title: "Two Variables Track Everything",
        explanation: "We need only TWO variables: currentSum (best ending here) and maxSum (best seen so far). That's it!",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "variable-box", name: "currentSum", value: "?", position: [-3, 0, 0], color: "#3b82f6" },
            { type: "variable-box", name: "maxSum", value: "?", position: [3, 0, 0], color: "#22c55e" },
            { type: "text-3d", text: "O(1) Space!", position: [0, 3, 0], color: "#FFD700", size: 0.5 },
          ],
        },
      },
      {
        frameNumber: 4,
        title: "The Algorithm Flow",
        explanation: "Start with first element. For each next element: update currentSum (extend or restart), then update maxSum (track best). Simple!",
        duration: 5,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "flowchart",
              steps: [
                "Initialize: current = max = nums[0]",
                "For each element i:",
                "  current = max(nums[i], current + nums[i])",
                "  max = max(max, current)",
                "Return max"
              ],
              position: [0, 0, 0]
            },
          ],
        },
      },
      {
        frameNumber: 5,
        title: "O(n) Time, O(1) Space!",
        explanation: "Kadane's algorithm is elegant and optimal! One pass through the array, constant space. Perfect for finding maximum subarray sum!",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "complexity-card", data: { time: "O(n)", space: "O(1)" }, position: [0, 0, 0], color: "#22c55e" },
            { type: "text-3d", text: "Optimal! ⚡", position: [0, 3, 0], color: "#22c55e", size: 0.8 },
          ],
          particles: { type: "sparkles", count: 100, color: "#a855f7" },
        },
      },
    ],
  },

  problemSolution: {
    testCase: {
      input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
      expectedOutput: 6,
    },
    
    frames: [
      {
        frameNumber: 1,
        title: "Problem Setup",
        explanation: "Find the maximum sum of a contiguous subarray in [-2,1,-3,4,-1,2,1,-5,4].",
        code: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        duration: 3,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "array", values: [-2, 1, -3, 4, -1, 2, 1, -5, 4], position: [0, 0, 0], animation: "fly-in" },
          ],
        },
      },
      {
        frameNumber: 2,
        title: "Initialize",
        explanation: "Start with first element: maxSum = -2, currentSum = -2",
        code: "max_sum = nums[0] = -2\ncurrent_sum = nums[0] = -2",
        duration: 3,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "array", values: [-2, 1, -3, 4, -1, 2, 1, -5, 4], position: [0, 0, 0], highlightIndex: 0 },
            { type: "variable-display", name: "currentSum", value: -2, position: [-3, -2, 0], color: "#3b82f6" },
            { type: "variable-display", name: "maxSum", value: -2, position: [3, -2, 0], color: "#22c55e" },
          ],
        },
      },
      {
        frameNumber: 3,
        title: "Index 1: Value = 1",
        explanation: "currentSum = max(1, -2+1) = max(1, -1) = 1. Starting fresh is better! maxSum = max(-2, 1) = 1",
        code: "current = max(1, -2+1) = 1\nmax = max(-2, 1) = 1",
        duration: 4,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "array", values: [-2, 1, -3, 4, -1, 2, 1, -5, 4], position: [0, 0, 0], highlightIndex: 1 },
            { type: "decision-visual", options: ["Start new: 1", "Extend: -1"], chosen: 0, position: [0, 2.5, 0] },
            { type: "variable-display", name: "currentSum", value: 1, position: [-3, -2, 0], glow: true },
            { type: "variable-display", name: "maxSum", value: 1, position: [3, -2, 0], glow: true },
          ],
        },
      },
      {
        frameNumber: 4,
        title: "Index 2: Value = -3",
        explanation: "currentSum = max(-3, 1+(-3)) = max(-3, -2) = -2. Extending is less bad. maxSum stays 1.",
        code: "current = max(-3, 1-3) = -2\nmax = max(1, -2) = 1",
        duration: 4,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "array", values: [-2, 1, -3, 4, -1, 2, 1, -5, 4], position: [0, 0, 0], highlightIndex: 2 },
            { type: "variable-display", name: "currentSum", value: -2, position: [-3, -2, 0] },
            { type: "variable-display", name: "maxSum", value: 1, position: [3, -2, 0] },
          ],
        },
      },
      {
        frameNumber: 5,
        title: "Index 3: Value = 4",
        explanation: "currentSum = max(4, -2+4) = max(4, 2) = 4. Start fresh! maxSum = max(1, 4) = 4",
        code: "current = max(4, -2+4) = 4\nmax = max(1, 4) = 4",
        duration: 4,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "array", values: [-2, 1, -3, 4, -1, 2, 1, -5, 4], position: [0, 0, 0], highlightIndex: 3 },
            { type: "variable-display", name: "currentSum", value: 4, position: [-3, -2, 0], glow: true },
            { type: "variable-display", name: "maxSum", value: 4, position: [3, -2, 0], glow: true },
            { type: "subarray-highlight", start: 3, end: 3, position: [0, 0, 0], color: "#22c55e" },
          ],
        },
      },
      {
        frameNumber: 6,
        title: "Index 4: Value = -1",
        explanation: "currentSum = max(-1, 4+(-1)) = max(-1, 3) = 3. Extend! maxSum stays 4.",
        code: "current = max(-1, 4-1) = 3\nmax = max(4, 3) = 4",
        duration: 3,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "array", values: [-2, 1, -3, 4, -1, 2, 1, -5, 4], position: [0, 0, 0], highlightIndex: 4 },
            { type: "variable-display", name: "currentSum", value: 3, position: [-3, -2, 0] },
            { type: "variable-display", name: "maxSum", value: 4, position: [3, -2, 0] },
            { type: "subarray-highlight", start: 3, end: 4, position: [0, 0, 0] },
          ],
        },
      },
      {
        frameNumber: 7,
        title: "Index 5: Value = 2",
        explanation: "currentSum = max(2, 3+2) = 5. Extend! maxSum = max(4, 5) = 5. New best!",
        code: "current = max(2, 3+2) = 5\nmax = max(4, 5) = 5",
        duration: 3,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "array", values: [-2, 1, -3, 4, -1, 2, 1, -5, 4], position: [0, 0, 0], highlightIndex: 5 },
            { type: "variable-display", name: "currentSum", value: 5, position: [-3, -2, 0], glow: true },
            { type: "variable-display", name: "maxSum", value: 5, position: [3, -2, 0], glow: true },
            { type: "subarray-highlight", start: 3, end: 5, position: [0, 0, 0], color: "#22c55e" },
          ],
        },
      },
      {
        frameNumber: 8,
        title: "Index 6: Value = 1",
        explanation: "currentSum = max(1, 5+1) = 6. Extend! maxSum = max(5, 6) = 6. New best!",
        code: "current = max(1, 5+1) = 6\nmax = max(5, 6) = 6",
        duration: 4,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "array", values: [-2, 1, -3, 4, -1, 2, 1, -5, 4], position: [0, 0, 0], highlightIndex: 6 },
            { type: "variable-display", name: "currentSum", value: 6, position: [-3, -2, 0], glow: true },
            { type: "variable-display", name: "maxSum", value: 6, position: [3, -2, 0], glow: true },
            { type: "subarray-highlight", start: 3, end: 6, position: [0, 0, 0], color: "#FFD700" },
          ],
        },
      },
      {
        frameNumber: 9,
        title: "Remaining Elements",
        explanation: "Indices 7,8: currentSum becomes 1, then 5. But maxSum stays 6. The subarray [4,-1,2,1] gives us 6!",
        code: "// Final: max_sum = 6\n// Subarray: [4,-1,2,1]",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 16], animation: "zoom-out" },
          objects: [
            { type: "array", values: [-2, 1, -3, 4, -1, 2, 1, -5, 4], position: [0, 1, 0] },
            { type: "subarray-highlight", start: 3, end: 6, position: [0, 1, 0], color: "#22c55e", glow: true },
            { type: "result-display", position: [0, -2, 0], value: "6", color: "#22c55e", size: 2 },
          ],
          particles: { type: "success-burst", position: [0, 1, 0], count: 150, color: "#22c55e" },
        },
      },
      {
        frameNumber: 10,
        title: "Solution Complete!",
        explanation: "Kadane's algorithm found the maximum subarray sum in just one pass! O(n) time, O(1) space. Elegant!",
        code: "// Time: O(n)\n// Space: O(1)\n// Perfect! ⚡",
        duration: 4,
        scene3D: {
          camera: { position: [0, 6, 18] },
          objects: [
            { type: "array", values: [-2, 1, -3, 4, -1, 2, 1, -5, 4], position: [0, 1, 0] },
            { type: "subarray-highlight", start: 3, end: 6, position: [0, 1, 0], glowing: true },
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
    explanation: "We traverse the array once, and only use two variables to track current and maximum sums, making it optimal in both time and space.",
  },
};

export const seedMaximumSubarray = async () => {
  try {
    const existing = await Problem.findOne({ problemId: "maximum-subarray" });
    if (existing) {
      console.log("✅ Maximum Subarray problem already exists");
      return existing;
    }

    const problem = await Problem.create(maximumSubarrayProblem);
    console.log("✅ Maximum Subarray problem seeded successfully!");
    console.log(`   - ${problem.algorithmTutorial.frames.length} tutorial frames`);
    console.log(`   - ${problem.problemSolution.frames.length} solution frames`);
    console.log(`   - Solutions in ${Object.keys(problem.solutions || {}).length} languages`);
    
    return problem;
  } catch (error) {
    console.error("❌ Error seeding Maximum Subarray problem:", error);
    throw error;
  }
};

export default seedMaximumSubarray;