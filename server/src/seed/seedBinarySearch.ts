import Problem from "../models/Problem";

// ========================================
// SEED DATA: BINARY SEARCH PROBLEM
// ========================================

export const binarySearchProblem = {
  problemId: "binary-search",
  title: "Binary Search",
  difficulty: "Easy",
  tags: ["Array", "Binary Search"],
  description: `Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.

You must write an algorithm with O(log n) runtime complexity.`,
  
  examples: [
    {
      input: "nums = [-1,0,3,5,9,12], target = 9",
      output: "4",
      explanation: "9 exists in nums and its index is 4",
    },
    {
      input: "nums = [-1,0,3,5,9,12], target = 2",
      output: "-1",
      explanation: "2 does not exist in nums so return -1",
    },
  ],

  algorithmsRequired: ["binary-search"],

  solutions: {
    "Python": `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        """
        Binary search in a sorted array.
        
        Time Complexity: O(log n)
        Space Complexity: O(1)
        """
        left = 0
        right = len(nums) - 1
        
        while left <= right:
            # Find middle index (avoid overflow)
            mid = left + (right - left) // 2
            
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                # Target is in right half
                left = mid + 1
            else:
                # Target is in left half
                right = mid - 1
        
        # Target not found
        return -1`,

    "C++": `class Solution {
public:
    int search(vector<int>& nums, int target) {
        /*
         * Binary search in a sorted array.
         * 
         * Time Complexity: O(log n)
         * Space Complexity: O(1)
         */
        int left = 0;
        int right = nums.size() - 1;
        
        while (left <= right) {
            // Find middle index (avoid overflow)
            int mid = left + (right - left) / 2;
            
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                // Target is in right half
                left = mid + 1;
            } else {
                // Target is in left half
                right = mid - 1;
            }
        }
        
        // Target not found
        return -1;
    }
};`,

    "Java": `class Solution {
    /**
     * Binary search in a sorted array.
     * 
     * Time Complexity: O(log n)
     * Space Complexity: O(1)
     */
    public int search(int[] nums, int target) {
        int left = 0;
        int right = nums.length - 1;
        
        while (left <= right) {
            // Find middle index (avoid overflow)
            int mid = left + (right - left) / 2;
            
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                // Target is in right half
                left = mid + 1;
            } else {
                // Target is in left half
                right = mid - 1;
            }
        }
        
        // Target not found
        return -1;
    }
}`,

    "JavaScript": `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    /*
     * Binary search in a sorted array.
     * 
     * Time Complexity: O(log n)
     * Space Complexity: O(1)
     */
    let left = 0;
    let right = nums.length - 1;
    
    while (left <= right) {
        // Find middle index (avoid overflow)
        const mid = Math.floor(left + (right - left) / 2);
        
        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            // Target is in right half
            left = mid + 1;
        } else {
            // Target is in left half
            right = mid - 1;
        }
    }
    
    // Target not found
    return -1;
};`,

    "Go": `func search(nums []int, target int) int {
    /*
     * Binary search in a sorted array.
     * 
     * Time Complexity: O(log n)
     * Space Complexity: O(1)
     */
    left := 0
    right := len(nums) - 1
    
    for left <= right {
        // Find middle index (avoid overflow)
        mid := left + (right - left) / 2
        
        if nums[mid] == target {
            return mid
        } else if nums[mid] < target {
            // Target is in right half
            left = mid + 1
        } else {
            // Target is in left half
            right = mid - 1
        }
    }
    
    // Target not found
    return -1
}`,
  },

  algorithmTutorial: {
    algorithmId: "binary-search",
    algorithmName: "Binary Search",
    description: "An efficient algorithm for finding an item in a sorted array by repeatedly dividing the search space in half",
    
    frames: [
      {
        frameNumber: 1,
        title: "The Power of Binary Search",
        explanation: "Imagine finding a word in a dictionary. Do you start from page 1? No! You open the middle, then jump to the right section. That's binary search!",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 15], lookAt: [0, 0, 0] },
          objects: [
            { type: "book-visualization", position: [0, 0, 0], pages: 1000, animation: "flip-to-middle" },
            { type: "text-3d", text: "BINARY SEARCH", position: [0, 4, 0], color: "#3b82f6", size: 0.6 },
          ],
        },
      },
      {
        frameNumber: 2,
        title: "Linear vs Binary Search",
        explanation: "Linear search checks every element: O(n). Binary search cuts the problem in HALF each time: O(log n). Huge difference!",
        duration: 5,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "comparison-demo", 
              linear: { steps: 100, color: "#ef4444" },
              binary: { steps: 7, color: "#22c55e" },
              arraySize: 100
            },
            { type: "complexity-labels", 
              linear: "O(n) - slow",
              binary: "O(log n) - fast!",
              position: [0, -3, 0]
            },
          ],
        },
      },
      {
        frameNumber: 3,
        title: "The Divide & Conquer Strategy",
        explanation: "Binary search works ONLY on sorted arrays. It uses three pointers: left, right, and middle. Each step eliminates half the possibilities!",
        duration: 5,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "array", values: [1, 3, 5, 7, 9, 11, 13, 15], position: [0, 0, 0] },
            { type: "pointer", label: "left", position: [-6, 2, 0], color: "#ef4444", targetIndex: 0 },
            { type: "pointer", label: "mid", position: [0, 2, 0], color: "#3b82f6", targetIndex: 4 },
            { type: "pointer", label: "right", position: [6, 2, 0], color: "#22c55e", targetIndex: 7 },
          ],
        },
      },
      {
        frameNumber: 4,
        title: "How It Works",
        explanation: "1) Find middle. 2) If target equals middle: found! 3) If target < middle: search left half. 4) If target > middle: search right half. Repeat!",
        duration: 5,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "flowchart",
              nodes: [
                "Find Middle",
                "Target = Mid?",
                "Target < Mid?",
                "Search Left",
                "Search Right",
                "Found!"
              ],
              position: [0, 0, 0]
            },
          ],
        },
      },
      {
        frameNumber: 5,
        title: "Logarithmic Speed!",
        explanation: "Each step cuts the search space in half. For 1 million items, binary search needs only ~20 comparisons vs 1 million for linear. Mind-blowing!",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "size-comparison",
              sizes: [
                { n: 100, steps: 7 },
                { n: 1000, steps: 10 },
                { n: 1000000, steps: 20 }
              ],
              position: [0, 0, 0]
            },
            { type: "text-3d", text: "O(log n) Magic! ⚡", position: [0, 4, 0], color: "#22c55e", size: 0.6 },
          ],
          particles: { type: "sparkles", count: 100, color: "#3b82f6" },
        },
      },
    ],
  },

  problemSolution: {
    testCase: {
      input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 },
      expectedOutput: 4,
    },
    
    frames: [
      {
        frameNumber: 1,
        title: "Problem Setup",
        explanation: "We need to find the value 9 in the sorted array [-1, 0, 3, 5, 9, 12]. Let's use binary search!",
        code: "nums = [-1, 0, 3, 5, 9, 12]\ntarget = 9",
        duration: 3,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "array", values: [-1, 0, 3, 5, 9, 12], position: [0, 0, 0], animation: "fly-in" },
            { type: "target-display", value: 9, position: [0, 3, 0], color: "#FFD700" },
          ],
        },
      },
      {
        frameNumber: 2,
        title: "Initialize Pointers",
        explanation: "Set left = 0, right = 5 (last index). Calculate middle: mid = (0 + 5) / 2 = 2",
        code: "left = 0\nright = 5\nmid = (0 + 5) // 2 = 2",
        duration: 3,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "array", values: [-1, 0, 3, 5, 9, 12], position: [0, 0, 0] },
            { type: "pointer", label: "L=0", position: [-7, 2.5, 0], color: "#ef4444", targetIndex: 0 },
            { type: "pointer", label: "M=2", position: [-1, 2.5, 0], color: "#3b82f6", targetIndex: 2 },
            { type: "pointer", label: "R=5", position: [8, 2.5, 0], color: "#22c55e", targetIndex: 5 },
          ],
        },
      },
      {
        frameNumber: 3,
        title: "Step 1: Check Middle",
        explanation: "nums[2] = 3. Is 3 == 9? No. Is 3 < 9? Yes! Target must be in the RIGHT half. Move left pointer to mid + 1.",
        code: "nums[mid] = 3\n3 < 9 → search right\nleft = mid + 1 = 3",
        duration: 4,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "array", values: [-1, 0, 3, 5, 9, 12], position: [0, 0, 0], highlightIndex: 2, eliminated: [0, 1, 2] },
            { type: "comparison", left: 3, right: 9, result: "<", position: [0, 3.5, 0] },
            { type: "arrow-indication", text: "Search Right →", position: [2, -2, 0], color: "#22c55e" },
          ],
        },
      },
      {
        frameNumber: 4,
        title: "Step 2: New Middle",
        explanation: "Now: left = 3, right = 5. New mid = (3 + 5) / 2 = 4. Check nums[4] = 9.",
        code: "left = 3, right = 5\nmid = (3 + 5) // 2 = 4\nnums[4] = 9",
        duration: 3,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "array", values: [-1, 0, 3, 5, 9, 12], position: [0, 0, 0], activeRange: [3, 5] },
            { type: "pointer", label: "L=3", position: [1, 2.5, 0], color: "#ef4444", targetIndex: 3 },
            { type: "pointer", label: "M=4", position: [5, 2.5, 0], color: "#3b82f6", targetIndex: 4 },
            { type: "pointer", label: "R=5", position: [8, 2.5, 0], color: "#22c55e", targetIndex: 5 },
          ],
        },
      },
      {
        frameNumber: 5,
        title: "Found It!",
        explanation: "nums[4] = 9, and our target is 9. Match! Return index 4. Binary search complete!",
        code: "nums[mid] == target\nreturn 4 ✓",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 16], animation: "zoom-out" },
          objects: [
            { type: "array", values: [-1, 0, 3, 5, 9, 12], position: [0, 1, 0], highlightIndex: 4, glow: true },
            { type: "result-display", position: [0, -2, 0], value: "4", color: "#22c55e", size: 2 },
            { type: "text-3d", text: "FOUND! ✓", position: [0, 4, 0], color: "#22c55e", size: 1 },
          ],
          particles: { type: "success-burst", position: [5, 1, 0], count: 150, color: "#22c55e" },
        },
      },
      {
        frameNumber: 6,
        title: "Search Path",
        explanation: "We only checked 2 elements! Binary search eliminated half the array each time. Super efficient!",
        code: "// Steps: 2\n// Elements checked: [3, 9]\n// Much better than linear!",
        duration: 4,
        scene3D: {
          camera: { position: [0, 6, 18] },
          objects: [
            { type: "search-visualization",
              steps: [
                { index: 2, value: 3, action: "→ right" },
                { index: 4, value: 9, action: "✓ found" }
              ],
              position: [0, 0, 0]
            },
            { type: "complexity-card", position: [0, -3, 0], data: { time: "O(log n)", space: "O(1)" } },
          ],
        },
      },
      {
        frameNumber: 7,
        title: "Not Found Example",
        explanation: "What if target was 2? We'd search until left > right, then return -1. The target doesn't exist!",
        code: "// target = 2\n// After searching: left > right\n// return -1",
        duration: 4,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "array", values: [-1, 0, 3, 5, 9, 12], position: [0, 0, 0] },
            { type: "crossed-out", position: [0, 0, 0], text: "2 not found" },
            { type: "result-display", position: [0, -2, 0], value: "-1", color: "#ef4444", size: 1.5 },
          ],
        },
      },
      {
        frameNumber: 8,
        title: "Solution Complete!",
        explanation: "Binary search is incredibly efficient! O(log n) time, O(1) space. Perfect for sorted arrays!",
        code: "// Time: O(log n)\n// Space: O(1)\n// Blazingly Fast! ⚡",
        duration: 4,
        scene3D: {
          camera: { position: [0, 6, 18] },
          objects: [
            { type: "array", values: [-1, 0, 3, 5, 9, 12], position: [0, 1, 0], highlightIndex: 4 },
            { type: "complexity-comparison",
              linear: { time: "O(n)", example: "6 checks" },
              binary: { time: "O(log n)", example: "2 checks" },
              position: [0, -2, 0],
              winner: "binary"
            },
            { type: "text-3d", text: "SOLVED! 🎉", position: [0, 4, 0], color: "#22c55e", size: 1 },
          ],
          particles: { type: "fireworks", position: [0, 5, 0], count: 300 },
        },
      },
    ],
  },

  complexity: {
    time: "O(log n)",
    space: "O(1)",
    explanation: "Binary search divides the search space in half at each step, resulting in logarithmic time complexity. We only use a constant amount of extra space for pointers.",
  },
};

export const seedBinarySearch = async () => {
  try {
    const existing = await Problem.findOne({ problemId: "binary-search" });
    if (existing) {
      console.log("✅ Binary Search problem already exists");
      return existing;
    }

    const problem = await Problem.create(binarySearchProblem);
    console.log("✅ Binary Search problem seeded successfully!");
    console.log(`   - ${problem.algorithmTutorial.frames.length} tutorial frames`);
    console.log(`   - ${problem.problemSolution.frames.length} solution frames`);
    console.log(`   - Solutions in ${Object.keys(problem.solutions || {}).length} languages`);
    
    return problem;
  } catch (error) {
    console.error("❌ Error seeding Binary Search problem:", error);
    throw error;
  }
};

export default seedBinarySearch;