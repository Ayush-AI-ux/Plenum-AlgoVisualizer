import Problem from "../models/Problem";

// ========================================
// SEED DATA: TWO SUM PROBLEM
// Complete with Algorithm Tutorial + Problem Solution
// Total: 5 tutorial frames + 10 solution frames = 15 frames
// ========================================

export const twoSumProblem = {
  problemId: "two-sum",
  title: "Two Sum",
  difficulty: "Easy",
  tags: ["Array", "Hash Table"],
  description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
  
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
    },
    {
      input: "nums = [3,3], target = 6",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 6, we return [0, 1].",
    },
  ],

  algorithmsRequired: ["hash-map"],

  // ========================================
  // PART 1: ALGORITHM TUTORIAL (Hash Map)
  // 5 frames teaching the concept
  // ========================================
  algorithmTutorial: {
    algorithmId: "hash-map",
    algorithmName: "Hash Map / Hash Table",
    description: "A data structure that provides O(1) average-case lookup, insertion, and deletion",
    
    frames: [
      // Frame 1: Introduction
      {
        frameNumber: 1,
        title: "What is a Hash Map?",
        explanation: "A hash map (or hash table) is a data structure that stores key-value pairs. Think of it like a dictionary where you can instantly look up a value using its key.",
        duration: 4,
        scene3D: {
          camera: {
            position: [0, 5, 15],
            lookAt: [0, 0, 0],
            animation: "pan-in",
          },
          objects: [
            {
              type: "container",
              id: "hashmap-box",
              position: [0, 0, 0],
              size: [5, 6, 2],
              color: "#3b82f6",
              opacity: 0.3,
              animation: "materialize",
            },
            {
              type: "text-3d",
              text: "HASH MAP",
              position: [0, 4, 0],
              color: "#ffffff",
              size: 0.6,
              animation: "fade-in",
            },
          ],
          lights: [
            { type: "ambient", intensity: 0.5 },
            { type: "point", position: [10, 10, 10], intensity: 1 },
          ],
        },
      },

      // Frame 2: Storing Key-Value Pairs
      {
        frameNumber: 2,
        title: "Storing Key-Value Pairs",
        explanation: "You store data as key-value pairs. For example, 'apple' → 5 means the key 'apple' maps to the value 5. The hash map remembers this connection.",
        duration: 4,
        scene3D: {
          camera: {
            position: [0, 5, 15],
            lookAt: [0, 0, 0],
          },
          objects: [
            {
              type: "container",
              id: "hashmap-box",
              position: [0, 0, 0],
              size: [5, 6, 2],
              opacity: 0.3,
            },
            {
              type: "key-value-pair",
              key: "apple",
              value: 5,
              position: [-8, 2, 0],
              animation: "fly-in",
              targetPosition: [0, 1.5, 0],
              duration: 1.5,
            },
            {
              type: "key-value-pair",
              key: "banana",
              value: 3,
              position: [-8, -1, 0],
              animation: "fly-in",
              targetPosition: [0, -0.5, 0],
              duration: 1.5,
              delay: 0.5,
            },
            {
              type: "text-3d",
              text: "Key → Value",
              position: [0, 4, 0],
              color: "#60a5fa",
              size: 0.4,
            },
          ],
          particles: {
            type: "sparkles",
            position: [0, 0, 0],
            count: 50,
            color: "#3b82f6",
          },
        },
      },

      // Frame 3: Fast Lookup - The Magic
      {
        frameNumber: 3,
        title: "Fast Lookup - The Magic!",
        explanation: "Hash maps find values INSTANTLY without searching through everything. No matter how many items you have, looking up a value takes the same amount of time - O(1)!",
        duration: 5,
        scene3D: {
          camera: {
            position: [0, 5, 15],
            lookAt: [0, 0, 0],
          },
          objects: [
            {
              type: "container",
              id: "hashmap-box",
              position: [0, 0, -3],
              size: [5, 6, 2],
              opacity: 0.3,
            },
            {
              type: "key-value-pair",
              key: "apple",
              value: 5,
              position: [0, 1.5, -3],
              highlighted: false,
            },
            {
              type: "key-value-pair",
              key: "banana",
              value: 3,
              position: [0, -0.5, -3],
              highlighted: true,
            },
            {
              type: "search-magnifier",
              position: [4, -0.5, 0],
              animation: "zoom-in",
              target: [0, -0.5, -3],
              searchKey: "banana",
            },
            {
              type: "text-3d",
              text: "INSTANT LOOKUP ⚡",
              position: [0, 4, 0],
              color: "#22c55e",
              size: 0.5,
              animation: "pulse",
            },
            {
              type: "comparison-table",
              position: [6, 0, 0],
              data: [
                { method: "Array", time: "O(n)" },
                { method: "Hash Map", time: "O(1)", highlight: true },
              ],
            },
          ],
          particles: {
            type: "energy-burst",
            position: [0, -0.5, -3],
            count: 100,
            color: "#22c55e",
          },
        },
      },

      // Frame 4: Why It's Fast
      {
        frameNumber: 4,
        title: "How Does It Work?",
        explanation: "Behind the scenes, the hash map uses a 'hash function' to convert your key into a number, which tells it exactly where to store or find the value. It's like having a perfect filing system!",
        duration: 5,
        scene3D: {
          camera: {
            position: [0, 5, 15],
            lookAt: [0, 0, 0],
          },
          objects: [
            {
              type: "hash-function-visualizer",
              position: [0, 2, 0],
              input: "apple",
              output: "3",
              animation: "transform",
            },
            {
              type: "array-buckets",
              position: [0, -2, 0],
              buckets: 5,
              highlightIndex: 3,
              content: { 3: { key: "apple", value: 5 } },
            },
            {
              type: "arrow-flow",
              from: [0, 2, 0],
              to: [0, -2, 0],
              animated: true,
              label: "hash('apple') = 3",
            },
            {
              type: "text-3d",
              text: "Hash Function Magic ✨",
              position: [0, 5, 0],
              color: "#a855f7",
              size: 0.5,
            },
          ],
        },
      },

      // Frame 5: Perfect for Two Sum
      {
        frameNumber: 5,
        title: "Perfect for Two Sum!",
        explanation: "Hash maps are PERFECT for the Two Sum problem! We can check if a number exists and get its index instantly. Let's see how to use this for solving Two Sum.",
        duration: 4,
        scene3D: {
          camera: {
            position: [0, 5, 15],
            lookAt: [0, 0, 0],
          },
          objects: [
            {
              type: "container",
              id: "hashmap-box",
              position: [0, 0, -3],
              size: [5, 6, 2],
              opacity: 0.4,
              glowColor: "#22c55e",
            },
            {
              type: "text-3d",
              text: "Ready to Solve Two Sum!",
              position: [0, 4, 0],
              color: "#22c55e",
              size: 0.5,
              animation: "celebrate",
            },
            {
              type: "checkmark-icon",
              position: [0, 0, 0],
              size: 3,
              color: "#22c55e",
              animation: "pop-in",
            },
          ],
          particles: {
            type: "confetti",
            position: [0, 5, 0],
            count: 200,
            colors: ["#22c55e", "#3b82f6", "#a855f7"],
          },
        },
      },
    ],
  },

  // ========================================
  // PART 2: PROBLEM SOLUTION (Two Sum)
  // 10 frames showing step-by-step solution
  // ========================================
  problemSolution: {
    testCase: {
      input: {
        nums: [2, 7, 11, 15],
        target: 9,
      },
      expectedOutput: [0, 1],
    },
    
    frames: [
      // Frame 1: Problem Setup
      {
        frameNumber: 1,
        title: "Problem Setup",
        explanation: "We have an array [2, 7, 11, 15] and need to find two numbers that add up to 9. Let's solve this using a hash map!",
        code: "// Given:\nconst nums = [2, 7, 11, 15];\nconst target = 9;",
        duration: 3,
        scene3D: {
          camera: {
            position: [0, 4, 14],
            lookAt: [0, 0, 0],
          },
          objects: [
            {
              type: "array",
              values: [2, 7, 11, 15],
              positions: [
                [-6, 1, 0],
                [-2, 1, 0],
                [2, 1, 0],
                [6, 1, 0],
              ],
              animation: "fly-in",
              boxColor: "#3b82f6",
            },
            {
              type: "target-display",
              value: 9,
              position: [0, 4, 0],
              animation: "glow-pulse",
              color: "#FFD700",
            },
            {
              type: "text-3d",
              text: "TARGET: 9",
              position: [0, 5.5, 0],
              color: "#FFD700",
              size: 0.5,
            },
          ],
        },
      },

      // Frame 2: Initialize Hash Map
      {
        frameNumber: 2,
        title: "Initialize Hash Map",
        explanation: "First, we create an empty hash map to store numbers and their indices as we go through the array.",
        code: "const map = new Map();",
        duration: 2,
        scene3D: {
          camera: {
            position: [0, 4, 14],
          },
          objects: [
            {
              type: "array",
              values: [2, 7, 11, 15],
              positions: [
                [-6, 1, 0],
                [-2, 1, 0],
                [2, 1, 0],
                [6, 1, 0],
              ],
            },
            {
              type: "hashmap-container",
              position: [0, -3, 0],
              size: [4, 5, 1.5],
              opacity: 0.25,
              contents: [],
              animation: "materialize",
              label: "HashMap: { }",
            },
          ],
        },
      },

      // Frame 3: Check First Number (index 0)
      {
        frameNumber: 3,
        title: "Check First Number",
        explanation: "Looking at index 0: value is 2. We check if we need this number to reach our target.",
        code: "for (let i = 0; i < nums.length; i++)",
        duration: 2,
        scene3D: {
          camera: {
            position: [0, 4, 14],
            animation: "focus-on",
            target: [-6, 1, 0],
          },
          objects: [
            {
              type: "array",
              values: [2, 7, 11, 15],
              positions: [
                [-6, 1, 0],
                [-2, 1, 0],
                [2, 1, 0],
                [6, 1, 0],
              ],
              highlights: [0],
              highlightColor: "#22c55e",
            },
            {
              type: "pointer-arrow",
              position: [-6, 3, 0],
              animation: "bounce",
              label: "i = 0",
            },
            {
              type: "hashmap-container",
              position: [0, -3, 0],
              contents: [],
            },
          ],
        },
      },

      // Frame 4: Calculate Complement
      {
        frameNumber: 4,
        title: "Calculate Complement",
        explanation: "We need 7 to make 9, because 9 - 2 = 7. Let's check if 7 is already in our hash map.",
        code: "const complement = target - nums[i]; // 9 - 2 = 7",
        duration: 3,
        scene3D: {
          camera: {
            position: [0, 4, 14],
          },
          objects: [
            {
              type: "array",
              values: [2, 7, 11, 15],
              positions: [
                [-6, 1, 0],
                [-2, 1, 0],
                [2, 1, 0],
                [6, 1, 0],
              ],
              highlights: [0],
            },
            {
              type: "math-equation",
              position: [-6, 5, 0],
              parts: [
                { value: "9", color: "#FFD700" },
                { value: "-", color: "#ffffff" },
                { value: "2", color: "#22c55e" },
                { value: "=", color: "#ffffff" },
                { value: "7", color: "#f59e0b", glow: true },
              ],
              animation: "build-up",
            },
            {
              type: "text-3d",
              text: "LOOKING FOR: 7",
              position: [-6, 6.5, 0],
              color: "#f59e0b",
              size: 0.4,
              animation: "pulse",
            },
            {
              type: "hashmap-container",
              position: [0, -3, 0],
              contents: [],
            },
          ],
        },
      },

      // Frame 5: Check Hash Map (Not Found)
      {
        frameNumber: 5,
        title: "Check Hash Map",
        explanation: "Is 7 in our hash map? No! The map is empty. So we'll store 2 for later.",
        code: "if (map.has(complement)) // false",
        duration: 3,
        scene3D: {
          camera: {
            position: [0, 0, 14],
            animation: "pan-to",
            target: [0, -3, 0],
          },
          objects: [
            {
              type: "array",
              values: [2, 7, 11, 15],
              positions: [
                [-6, 1, 0],
                [-2, 1, 0],
                [2, 1, 0],
                [6, 1, 0],
              ],
              highlights: [0],
              opacity: 0.4,
            },
            {
              type: "hashmap-container",
              position: [0, -3, 0],
              contents: [],
              searching: 7,
              found: false,
              searchAnimation: "scan",
            },
            {
              type: "text-3d",
              text: "7 NOT FOUND ✗",
              position: [0, 0, 0],
              color: "#ef4444",
              size: 0.5,
              animation: "fade-in",
            },
          ],
        },
      },

      // Frame 6: Store in Hash Map
      {
        frameNumber: 6,
        title: "Store in Hash Map",
        explanation: "We store 2 at index 0 in our hash map. Now if we need 2 later, we can find it instantly!",
        code: "map.set(nums[i], i); // map.set(2, 0)",
        duration: 3,
        scene3D: {
          camera: {
            position: [0, 0, 14],
          },
          objects: [
            {
              type: "array",
              values: [2, 7, 11, 15],
              positions: [
                [-6, 1, 0],
                [-2, 1, 0],
                [2, 1, 0],
                [6, 1, 0],
              ],
              highlights: [0],
            },
            {
              type: "hashmap-container",
              position: [0, -3, 0],
              contents: [
                {
                  key: 2,
                  value: 0,
                  position: [0, -2, 0],
                  animation: "insert",
                  glow: true,
                },
              ],
              label: "HashMap: { 2 → 0 }",
            },
            {
              type: "particle-trail",
              from: [-6, 1, 0],
              to: [0, -2, 0],
              animation: "flow",
              color: "#3b82f6",
            },
          ],
        },
      },

      // Frame 7: Check Second Number (index 1)
      {
        frameNumber: 7,
        title: "Check Second Number",
        explanation: "Moving to index 1: value is 7. We need 2 to make 9 (because 9 - 7 = 2).",
        code: "// i = 1, nums[1] = 7\nconst complement = 9 - 7; // = 2",
        duration: 3,
        scene3D: {
          camera: {
            position: [0, 4, 14],
            animation: "pan-to",
            target: [-2, 1, 0],
          },
          objects: [
            {
              type: "array",
              values: [2, 7, 11, 15],
              positions: [
                [-6, 1, 0],
                [-2, 1, 0],
                [2, 1, 0],
                [6, 1, 0],
              ],
              highlights: [1],
              highlightColor: "#22c55e",
            },
            {
              type: "pointer-arrow",
              position: [-2, 3, 0],
              animation: "bounce",
              label: "i = 1",
            },
            {
              type: "math-equation",
              position: [-2, 5, 0],
              parts: [
                { value: "9", color: "#FFD700" },
                { value: "-", color: "#ffffff" },
                { value: "7", color: "#22c55e" },
                { value: "=", color: "#ffffff" },
                { value: "2", color: "#f59e0b", glow: true },
              ],
              animation: "build-up",
            },
            {
              type: "hashmap-container",
              position: [0, -3, 0],
              contents: [{ key: 2, value: 0 }],
              label: "HashMap: { 2 → 0 }",
            },
          ],
        },
      },

      // Frame 8: Found in Hash Map!
      {
        frameNumber: 8,
        title: "Found in Hash Map! ✓",
        explanation: "Is 2 in our hash map? YES! We found it! The value 2 is at index 0. So indices [0, 1] are our answer!",
        code: "if (map.has(complement)) // true!\n  return [map.get(complement), i];",
        duration: 4,
        scene3D: {
          camera: {
            position: [0, 0, 14],
          },
          objects: [
            {
              type: "array",
              values: [2, 7, 11, 15],
              positions: [
                [-6, 1, 0],
                [-2, 1, 0],
                [2, 1, 0],
                [6, 1, 0],
              ],
              highlights: [0, 1],
              highlightColor: "#22c55e",
            },
            {
              type: "hashmap-container",
              position: [0, -3, 0],
              contents: [
                {
                  key: 2,
                  value: 0,
                  highlighted: true,
                  glow: true,
                },
              ],
              searching: 2,
              found: true,
              searchAnimation: "found",
            },
            {
              type: "text-3d",
              text: "FOUND! ✓",
              position: [0, 0, 0],
              color: "#22c55e",
              size: 0.8,
              animation: "celebrate",
            },
            {
              type: "connection-line",
              from: [0, -2, 0],
              to: [-6, 1, 0],
              animated: true,
              color: "#22c55e",
              label: "Index 0",
            },
          ],
          particles: {
            type: "success-burst",
            position: [0, 0, 0],
            count: 150,
            color: "#22c55e",
          },
        },
      },

      // Frame 9: Show Connection
      {
        frameNumber: 9,
        title: "The Solution",
        explanation: "We found both numbers! Index 0 has value 2, and index 1 has value 7. Together they equal 9!",
        code: "// Answer: [0, 1]\n// nums[0] + nums[1] = 2 + 7 = 9 ✓",
        duration: 4,
        scene3D: {
          camera: {
            position: [0, 5, 16],
            animation: "zoom-out",
          },
          objects: [
            {
              type: "array",
              values: [2, 7, 11, 15],
              positions: [
                [-6, 1, 0],
                [-2, 1, 0],
                [2, 1, 0],
                [6, 1, 0],
              ],
              highlights: [0, 1],
              highlightColor: "#22c55e",
            },
            {
              type: "connection-arc",
              from: [-6, 1, 0],
              to: [-2, 1, 0],
              height: 3,
              animation: "draw",
              color: "#22c55e",
              thickness: 0.15,
              label: "2 + 7 = 9 ✓",
            },
            {
              type: "result-box",
              position: [0, -2, 0],
              content: "[0, 1]",
              color: "#22c55e",
              size: 1.5,
              animation: "pop-in",
            },
            {
              type: "hashmap-container",
              position: [5, -2, 0],
              contents: [{ key: 2, value: 0 }],
              opacity: 0.3,
            },
          ],
        },
      },

      // Frame 10: Complexity Analysis
      {
        frameNumber: 10,
        title: "Solution Complete! 🎉",
        explanation: "We found the answer in just one pass through the array! Time: O(n), Space: O(n). The hash map made this super efficient!",
        code: "// Time Complexity: O(n)\n// Space Complexity: O(n)\n// One pass, constant lookup!",
        duration: 5,
        scene3D: {
          camera: {
            position: [0, 6, 18],
            lookAt: [0, 0, 0],
          },
          objects: [
            {
              type: "array",
              values: [2, 7, 11, 15],
              positions: [
                [-6, 2, 0],
                [-2, 2, 0],
                [2, 2, 0],
                [6, 2, 0],
              ],
              highlights: [0, 1],
              highlightColor: "#22c55e",
            },
            {
              type: "connection-arc",
              from: [-6, 2, 0],
              to: [-2, 2, 0],
              height: 3,
              color: "#22c55e",
              glowing: true,
            },
            {
              type: "result-display",
              position: [0, -1, 0],
              title: "ANSWER",
              value: "[0, 1]",
              color: "#FFD700",
              size: 2,
            },
            {
              type: "complexity-card",
              position: [0, -4, 0],
              data: {
                time: "O(n)",
                space: "O(n)",
              },
              color: "#3b82f6",
            },
            {
              type: "text-3d",
              text: "SOLVED! 🎉",
              position: [0, 6, 0],
              color: "#22c55e",
              size: 1,
              animation: "celebrate",
            },
          ],
          particles: {
            type: "fireworks",
            position: [0, 5, 0],
            count: 300,
            colors: ["#22c55e", "#3b82f6", "#FFD700", "#a855f7"],
          },
          lights: [
            { type: "ambient", intensity: 0.8 },
            { type: "point", position: [0, 10, 5], intensity: 2, color: "#22c55e" },
          ],
        },
      },
    ],
  },

  complexity: {
    time: "O(n)",
    space: "O(n)",
    explanation: "We iterate through the array once (O(n)), and the hash map stores at most n elements (O(n) space). Hash map lookups are O(1) on average.",
  },
};

// ========================================
// SEED FUNCTION
// ========================================

export const seedTwoSumProblem = async () => {
  try {
    // Check if problem already exists
    const existing = await Problem.findOne({ problemId: "two-sum" });
    if (existing) {
      console.log("✅ Two Sum problem already exists");
      return existing;
    }

    // Create new problem
    const problem = await Problem.create(twoSumProblem);
    console.log("✅ Two Sum problem seeded successfully!");
    console.log(`   - ${problem.algorithmTutorial.frames.length} tutorial frames`);
    console.log(`   - ${problem.problemSolution.frames.length} solution frames`);
    console.log(`   - Total: ${problem.algorithmTutorial.frames.length + problem.problemSolution.frames.length} frames`);
    
    return problem;
  } catch (error) {
    console.error("❌ Error seeding Two Sum problem:", error);
    throw error;
  }
};

export default seedTwoSumProblem;