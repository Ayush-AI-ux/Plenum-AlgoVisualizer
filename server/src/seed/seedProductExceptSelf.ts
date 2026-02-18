// import Problem from "../models/Problem";

// export const productExceptSelfProblem = {
//   problemId: "product-of-array-except-self",
//   title: "Product of Array Except Self",
//   difficulty: "Medium",
//   tags: ["Array", "Prefix Sum"],
//   description: `Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].

// You must write an algorithm that runs in O(n) time and without using the division operation.`,
  
//   examples: [
//     { input: "nums = [1,2,3,4]", output: "[24,12,8,6]", explanation: "Product except self: 24=2×3×4, 12=1×3×4, 8=1×2×4, 6=1×2×3" },
//     { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]", explanation: "Any position with 0 makes most products 0." },
//   ],

//   algorithmsRequired: ["prefix-suffix-product"],

//   solutions: {
//     "Python": `class Solution:
//     def productExceptSelf(self, nums: List[int]) -> List[int]:
//         """
//         Use prefix and suffix products without division.
        
//         Time Complexity: O(n)
//         Space Complexity: O(1) - output array doesn't count
//         """
//         n = len(nums)
//         result = [1] * n
        
//         # Build prefix products (left to right)
//         prefix = 1
//         for i in range(n):
//             result[i] = prefix
//             prefix *= nums[i]
        
//         # Build suffix products and multiply (right to left)
//         suffix = 1
//         for i in range(n - 1, -1, -1):
//             result[i] *= suffix
//             suffix *= nums[i]
        
//         return result`,

//     "C++": `class Solution {
// public:
//     vector<int> productExceptSelf(vector<int>& nums) {
//         int n = nums.size();
//         vector<int> result(n, 1);
        
//         // Prefix products
//         int prefix = 1;
//         for (int i = 0; i < n; i++) {
//             result[i] = prefix;
//             prefix *= nums[i];
//         }
        
//         // Suffix products
//         int suffix = 1;
//         for (int i = n - 1; i >= 0; i--) {
//             result[i] *= suffix;
//             suffix *= nums[i];
//         }
        
//         return result;
//     }
// };`,

//     "Java": `class Solution {
//     public int[] productExceptSelf(int[] nums) {
//         int n = nums.length;
//         int[] result = new int[n];
        
//         // Prefix products
//         int prefix = 1;
//         for (int i = 0; i < n; i++) {
//             result[i] = prefix;
//             prefix *= nums[i];
//         }
        
//         // Suffix products
//         int suffix = 1;
//         for (int i = n - 1; i >= 0; i--) {
//             result[i] *= suffix;
//             suffix *= nums[i];
//         }
        
//         return result;
//     }
// }`,

//     "JavaScript": `var productExceptSelf = function(nums) {
//     const n = nums.length;
//     const result = new Array(n).fill(1);
    
//     // Prefix products
//     let prefix = 1;
//     for (let i = 0; i < n; i++) {
//         result[i] = prefix;
//         prefix *= nums[i];
//     }
    
//     // Suffix products
//     let suffix = 1;
//     for (let i = n - 1; i >= 0; i--) {
//         result[i] *= suffix;
//         suffix *= nums[i];
//     }
    
//     return result;
// };`,

//     "Go": `func productExceptSelf(nums []int) []int {
//     n := len(nums)
//     result := make([]int, n)
    
//     // Prefix products
//     prefix := 1
//     for i := 0; i < n; i++ {
//         result[i] = prefix
//         prefix *= nums[i]
//     }
    
//     // Suffix products
//     suffix := 1
//     for i := n - 1; i >= 0; i-- {
//         result[i] *= suffix
//         suffix *= nums[i]
//     }
    
//     return result
// }`,
//   },

//   algorithmTutorial: {
//     algorithmId: "prefix-suffix-product",
//     algorithmName: "Prefix & Suffix Product",
//     description: "Compute cumulative products from left and right to solve product problems without division",
    
//     frames: [
//       {
//         frameNumber: 1,
//         title: "The Product Problem",
//         explanation: "We need the product of all elements EXCEPT the current one. The obvious solution is: total_product / current_element. But wait - NO DIVISION allowed!",
//         duration: 4,
//         scene3D: {
//           camera: { position: [0, 5, 15], lookAt: [0, 0, 0] },
//           objects: [
//             { type: "array", values: [1, 2, 3, 4], position: [0, 0, 0], animation: "fly-in" },
//             { type: "division-crossed-out", position: [0, 3, 0], symbol: "÷", crossed: true },
//             { type: "text-3d", text: "No Division!", position: [0, 4, 0], color: "#ef4444", size: 0.6 },
//           ],
//         },
//       },
//       {
//         frameNumber: 2,
//         title: "The Key Insight",
//         explanation: "For any position i: result[i] = (product of all LEFT of i) × (product of all RIGHT of i). We need products from BOTH directions!",
//         duration: 5,
//         scene3D: {
//           camera: { position: [0, 5, 15] },
//           objects: [
//             { type: "array", values: [1, 2, 3, 4], position: [0, 0, 0] },
//             { type: "split-visualization",
//               index: 2,
//               left: { product: 2, elements: [1, 2], color: "#ef4444" },
//               right: { product: 4, elements: [4], color: "#22c55e" },
//               result: 8,
//               position: [0, 0, 0]
//             },
//             { type: "formula", text: "result[i] = left × right", position: [0, -3, 0], color: "#3b82f6" },
//           ],
//         },
//       },
//       {
//         frameNumber: 3,
//         title: "Prefix Products (Left to Right)",
//         explanation: "First pass: build a running product going LEFT to RIGHT. For each position, store the product of ALL elements BEFORE it!",
//         duration: 5,
//         scene3D: {
//           camera: { position: [0, 5, 15] },
//           objects: [
//             { type: "array", values: [1, 2, 3, 4], position: [0, 2, 0] },
//             { type: "prefix-animation",
//               steps: [
//                 { index: 0, prefix: 1, result: 1 },
//                 { index: 1, prefix: 1, result: 1 },
//                 { index: 2, prefix: 2, result: 2 },
//                 { index: 3, prefix: 6, result: 6 }
//               ],
//               animated: true,
//               position: [0, 0, 0]
//             },
//             { type: "arrow", direction: "right", label: "→", position: [0, 1, 0], color: "#ef4444" },
//           ],
//         },
//       },
//       {
//         frameNumber: 4,
//         title: "Suffix Products (Right to Left)",
//         explanation: "Second pass: going RIGHT to LEFT, multiply by the running product of ALL elements AFTER each position. Now we have both sides!",
//         duration: 5,
//         scene3D: {
//           camera: { position: [0, 5, 15] },
//           objects: [
//             { type: "array", values: [1, 1, 2, 6], position: [0, 2, 0], label: "After prefix" },
//             { type: "suffix-animation",
//               steps: [
//                 { index: 3, suffix: 1, multiply: true },
//                 { index: 2, suffix: 4, multiply: true },
//                 { index: 1, suffix: 12, multiply: true },
//                 { index: 0, suffix: 24, multiply: true }
//               ],
//               animated: true,
//               position: [0, 0, 0]
//             },
//             { type: "arrow", direction: "left", label: "←", position: [0, 1, 0], color: "#22c55e" },
//           ],
//         },
//       },
//       {
//         frameNumber: 5,
//         title: "O(n) Time, O(1) Space!",
//         explanation: "Two passes through the array = O(n) time. Only use two variables (prefix & suffix), output array doesn't count = O(1) extra space! Optimal solution!",
//         duration: 4,
//         scene3D: {
//           camera: { position: [0, 5, 15] },
//           objects: [
//             { type: "complexity-card",
//               data: {
//                 time: "O(n) - two passes",
//                 space: "O(1) - constant extra",
//                 note: "Output array doesn't count!"
//               },
//               position: [0, 0, 0],
//               color: "#22c55e"
//             },
//             { type: "text-3d", text: "Optimal! ⚡", position: [0, 3, 0], color: "#22c55e", size: 0.8 },
//           ],
//           particles: { type: "sparkles", count: 100, color: "#22c55e" },
//         },
//       },
//     ],
//   },

//   problemSolution: {
//     testCase: { input: { nums: [1,2,3,4] }, expectedOutput: [24,12,8,6] },
    
//     frames: [
//       {
//         frameNumber: 1,
//         title: "Problem Setup",
//         explanation: "Given [1,2,3,4], return an array where each element is the product of all OTHER elements. No division allowed!",
//         code: "nums = [1,2,3,4]\n# Want: [24,12,8,6]",
//         duration: 3,
//         scene3D: {
//           camera: { position: [0, 4, 14] },
//           objects: [
//             { type: "array", values: [1, 2, 3, 4], position: [0, 1, 0], animation: "fly-in" },
//             { type: "text-3d", text: "Product Except Self", position: [0, 3, 0], color: "#ffa64d", size: 0.5 },
//             { type: "expected-output", values: [24, 12, 8, 6], position: [0, -2, 0], opacity: 0.3, label: "Goal" },
//           ],
//         },
//       },
//       {
//         frameNumber: 2,
//         title: "Initialize Result Array",
//         explanation: "Create result array filled with 1s. We'll build it up with prefix then suffix products.",
//         code: "result = [1, 1, 1, 1]",
//         duration: 3,
//         scene3D: {
//           camera: { position: [0, 4, 14] },
//           objects: [
//             { type: "array", values: [1, 2, 3, 4], position: [0, 2, 0], label: "Input" },
//             { type: "array", values: [1, 1, 1, 1], position: [0, -1, 0], label: "Result (initial)", color: "#3b82f6" },
//           ],
//         },
//       },
//       {
//         frameNumber: 3,
//         title: "Prefix Pass: Index 0",
//         explanation: "No elements before index 0, so product is 1. result[0] = 1. Then update prefix: prefix = prefix × nums[0] = 1 × 1 = 1.",
//         code: "# i=0, prefix=1\nresult[0] = 1\nprefix = 1 * 1 = 1",
//         duration: 3,
//         scene3D: {
//           camera: { position: [0, 4, 14] },
//           objects: [
//             { type: "array", values: [1, 2, 3, 4], position: [0, 2, 0], highlightIndex: 0 },
//             { type: "array", values: [1, 1, 1, 1], position: [0, -1, 0], highlightIndex: 0 },
//             { type: "variable-display", name: "prefix", value: 1, position: [-4, 0.5, 0], color: "#ef4444" },
//             { type: "arrow-down", from: [0, 2, 0], to: [0, -1, 0] },
//           ],
//         },
//       },
//       {
//         frameNumber: 4,
//         title: "Prefix Pass: Index 1",
//         explanation: "Product before index 1 is 1. result[1] = 1. Update prefix: prefix = 1 × 2 = 2.",
//         code: "# i=1, prefix=1\nresult[1] = 1\nprefix = 1 * 2 = 2",
//         duration: 3,
//         scene3D: {
//           camera: { position: [0, 4, 14] },
//           objects: [
//             { type: "array", values: [1, 2, 3, 4], position: [0, 2, 0], highlightIndex: 1 },
//             { type: "array", values: [1, 1, 1, 1], position: [0, -1, 0], highlightIndex: 1 },
//             { type: "variable-display", name: "prefix", value: 2, position: [-4, 0.5, 0], color: "#ef4444", glow: true },
//           ],
//         },
//       },
//       {
//         frameNumber: 5,
//         title: "Prefix Pass: Index 2",
//         explanation: "Product before index 2 is 1×2=2. result[2] = 2. Update prefix: prefix = 2 × 3 = 6.",
//         code: "# i=2, prefix=2\nresult[2] = 2\nprefix = 2 * 3 = 6",
//         duration: 3,
//         scene3D: {
//           camera: { position: [0, 4, 14] },
//           objects: [
//             { type: "array", values: [1, 2, 3, 4], position: [0, 2, 0], highlightIndex: 2 },
//             { type: "array", values: [1, 1, 2, 1], position: [0, -1, 0], highlightIndex: 2, updated: true },
//             { type: "variable-display", name: "prefix", value: 6, position: [-4, 0.5, 0], color: "#ef4444", glow: true },
//           ],
//         },
//       },
//       {
//         frameNumber: 6,
//         title: "Prefix Pass: Index 3",
//         explanation: "Product before index 3 is 1×2×3=6. result[3] = 6. Prefix pass complete! result = [1,1,2,6]",
//         code: "# i=3, prefix=6\nresult[3] = 6\n# Prefix pass done!",
//         duration: 4,
//         scene3D: {
//           camera: { position: [0, 4, 14] },
//           objects: [
//             { type: "array", values: [1, 2, 3, 4], position: [0, 2, 0], highlightIndex: 3 },
//             { type: "array", values: [1, 1, 2, 6], position: [0, -1, 0], highlightIndex: 3, updated: true },
//             { type: "text-3d", text: "Prefix Done ✓", position: [0, -2.5, 0], color: "#22c55e", size: 0.4 },
//           ],
//         },
//       },
//       {
//         frameNumber: 7,
//         title: "Suffix Pass: Index 3",
//         explanation: "Start from right! No elements after index 3, so suffix = 1. result[3] *= 1 = 6. Update suffix: suffix = 1 × 4 = 4.",
//         code: "# i=3, suffix=1\nresult[3] *= 1  # 6\nsuffix = 1 * 4 = 4",
//         duration: 4,
//         scene3D: {
//           camera: { position: [0, 4, 14] },
//           objects: [
//             { type: "array", values: [1, 2, 3, 4], position: [0, 2, 0], highlightIndex: 3 },
//             { type: "array", values: [1, 1, 2, 6], position: [0, -1, 0], highlightIndex: 3 },
//             { type: "variable-display", name: "suffix", value: 4, position: [4, 0.5, 0], color: "#22c55e" },
//             { type: "arrow", direction: "left", label: "←", position: [0, 0, 0] },
//           ],
//         },
//       },
//       {
//         frameNumber: 8,
//         title: "Suffix Pass: Index 2",
//         explanation: "Product after index 2 is 4. result[2] = 2 × 4 = 8. Update suffix: suffix = 4 × 3 = 12.",
//         code: "# i=2, suffix=4\nresult[2] *= 4  # 2*4=8\nsuffix = 4 * 3 = 12",
//         duration: 4,
//         scene3D: {
//           camera: { position: [0, 4, 14] },
//           objects: [
//             { type: "array", values: [1, 2, 3, 4], position: [0, 2, 0], highlightIndex: 2 },
//             { type: "array", values: [1, 1, 8, 6], position: [0, -1, 0], highlightIndex: 2, updated: true, glow: true },
//             { type: "variable-display", name: "suffix", value: 12, position: [4, 0.5, 0], color: "#22c55e", glow: true },
//             { type: "multiplication-visual", show: "2 × 4 = 8", position: [0, 0, 0] },
//           ],
//         },
//       },
//       {
//         frameNumber: 9,
//         title: "Suffix Pass: Index 1",
//         explanation: "Product after index 1 is 3×4=12. result[1] = 1 × 12 = 12. Update suffix: suffix = 12 × 2 = 24.",
//         code: "# i=1, suffix=12\nresult[1] *= 12  # 1*12=12\nsuffix = 12 * 2 = 24",
//         duration: 4,
//         scene3D: {
//           camera: { position: [0, 4, 14] },
//           objects: [
//             { type: "array", values: [1, 2, 3, 4], position: [0, 2, 0], highlightIndex: 1 },
//             { type: "array", values: [1, 12, 8, 6], position: [0, -1, 0], highlightIndex: 1, updated: true, glow: true },
//             { type: "variable-display", name: "suffix", value: 24, position: [4, 0.5, 0], color: "#22c55e", glow: true },
//           ],
//         },
//       },
//       {
//         frameNumber: 10,
//         title: "Suffix Pass: Index 0 - Complete!",
//         explanation: "Product after index 0 is 2×3×4=24. result[0] = 1 × 24 = 24. Done! result = [24,12,8,6]",
//         code: "# i=0, suffix=24\nresult[0] *= 24  # 1*24=24\nreturn [24,12,8,6] ✓",
//         duration: 4,
//         scene3D: {
//           camera: { position: [0, 5, 16], animation: "zoom-out" },
//           objects: [
//             { type: "array", values: [1, 2, 3, 4], position: [0, 2, 0] },
//             { type: "array", values: [24, 12, 8, 6], position: [0, -1, 0], glowing: true, color: "#22c55e" },
//             { type: "result-display", position: [0, -3, 0], value: "[24,12,8,6]", color: "#FFD700", size: 1.5 },
//           ],
//           particles: { type: "success-burst", position: [0, -1, 0], count: 200, color: "#22c55e" },
//         },
//       },
//       {
//         frameNumber: 11,
//         title: "Verify the Result",
//         explanation: "Check: 24=2×3×4 ✓, 12=1×3×4 ✓, 8=1×2×4 ✓, 6=1×2×3 ✓. Every element is the product of all others!",
//         code: "// Verification:\n// 24 = 2*3*4 ✓\n// 12 = 1*3*4 ✓\n// 8 = 1*2*4 ✓\n// 6 = 1*2*3 ✓",
//         duration: 4,
//         scene3D: {
//           camera: { position: [0, 5, 16] },
//           objects: [
//             { type: "verification-table",
//               rows: [
//                 { index: 0, value: 24, calculation: "2×3×4", check: true },
//                 { index: 1, value: 12, calculation: "1×3×4", check: true },
//                 { index: 2, value: 8, calculation: "1×2×4", check: true },
//                 { index: 3, value: 6, calculation: "1×2×3", check: true }
//               ],
//               position: [0, 0, 0]
//             },
//           ],
//         },
//       },
//       {
//         frameNumber: 12,
//         title: "Solution Complete!",
//         explanation: "Two-pass prefix-suffix solution! O(n) time with just two loops, O(1) extra space. Elegant and optimal!",
//         code: "// Time: O(n) - two passes\n// Space: O(1) - constant extra\n// No division needed! ⚡",
//         duration: 4,
//         scene3D: {
//           camera: { position: [0, 6, 18] },
//           objects: [
//             { type: "array", values: [24, 12, 8, 6], position: [0, 1, 0], glowing: true },
//             { type: "complexity-card", position: [0, -2, 0], data: { time: "O(n)", space: "O(1)" }, color: "#3b82f6" },
//             { type: "text-3d", text: "SOLVED! 🎉", position: [0, 4, 0], color: "#22c55e", size: 1 },
//           ],
//           particles: { type: "fireworks", position: [0, 5, 0], count: 300, colors: ["#22c55e", "#3b82f6", "#FFD700"] },
//         },
//       },
//     ],
//   },

//   complexity: { time: "O(n)", space: "O(1)", explanation: "Two passes through array. Output array doesn't count as extra space per problem constraints." },
// };

// export const seedProductExceptSelf = async () => {
//   try {
//     const existing = await Problem.findOne({ problemId: "product-of-array-except-self" });
//     if (existing) {
//       console.log("✅ Product of Array Except Self problem already exists");
//       return existing;
//     }
//     const problem = await Problem.create(productExceptSelfProblem);
//     console.log("✅ Product of Array Except Self problem seeded successfully!");
//     console.log(`   - ${problem.algorithmTutorial.frames.length} tutorial frames`);
//     console.log(`   - ${problem.problemSolution.frames.length} solution frames`);
//     console.log(`   - Solutions in ${Object.keys(problem.solutions || {}).length} languages`);
//     return problem;
//   } catch (error) {
//     console.error("❌ Error seeding Product of Array Except Self problem:", error);
//     throw error;
//   }
// };

// export default seedProductExceptSelf;


import Problem from "../models/Problem";

export const productExceptSelfProblem = {
  problemId: "product-of-array-except-self",
  title: "Product of Array Except Self",
  difficulty: "Medium",
  tags: ["Array", "Prefix Sum"],
  description: `Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].

You must write an algorithm that runs in O(n) time and without using the division operation.`,
  
  examples: [
    { input: "nums = [1,2,3,4]", output: "[24,12,8,6]", explanation: "Product except self: 24=2×3×4, 12=1×3×4, 8=1×2×4, 6=1×2×3" },
    { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]", explanation: "Any position with 0 makes most products 0." },
  ],

  algorithmsRequired: ["prefix-suffix-product"],

  solutions: {
    "Python": `class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        """
        Use prefix and suffix products without division.
        
        Time Complexity: O(n)
        Space Complexity: O(1) - output array doesn't count
        """
        n = len(nums)
        result = [1] * n
        
        # Build prefix products (left to right)
        prefix = 1
        for i in range(n):
            result[i] = prefix
            prefix *= nums[i]
        
        # Build suffix products and multiply (right to left)
        suffix = 1
        for i in range(n - 1, -1, -1):
            result[i] *= suffix
            suffix *= nums[i]
        
        return result`,

    "C++": `class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> result(n, 1);
        
        // Prefix products
        int prefix = 1;
        for (int i = 0; i < n; i++) {
            result[i] = prefix;
            prefix *= nums[i];
        }
        
        // Suffix products
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            result[i] *= suffix;
            suffix *= nums[i];
        }
        
        return result;
    }
};`,

    "Java": `class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        
        // Prefix products
        int prefix = 1;
        for (int i = 0; i < n; i++) {
            result[i] = prefix;
            prefix *= nums[i];
        }
        
        // Suffix products
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            result[i] *= suffix;
            suffix *= nums[i];
        }
        
        return result;
    }
}`,

    "JavaScript": `var productExceptSelf = function(nums) {
    const n = nums.length;
    const result = new Array(n).fill(1);
    
    // Prefix products
    let prefix = 1;
    for (let i = 0; i < n; i++) {
        result[i] = prefix;
        prefix *= nums[i];
    }
    
    // Suffix products
    let suffix = 1;
    for (let i = n - 1; i >= 0; i--) {
        result[i] *= suffix;
        suffix *= nums[i];
    }
    
    return result;
};`,

    "Go": `func productExceptSelf(nums []int) []int {
    n := len(nums)
    result := make([]int, n)
    
    // Prefix products
    prefix := 1
    for i := 0; i < n; i++ {
        result[i] = prefix
        prefix *= nums[i]
    }
    
    // Suffix products
    suffix := 1
    for i := n - 1; i >= 0; i-- {
        result[i] *= suffix
        suffix *= nums[i]
    }
    
    return result
}`,
  },

  algorithmTutorial: {
    algorithmId: "prefix-suffix-product",
    algorithmName: "Prefix & Suffix Product",
    description: "Compute cumulative products from left and right to solve product problems without division",
    
    frames: [
      {
        frameNumber: 1,
        title: "The Product Problem",
        explanation: "We need the product of all elements EXCEPT the current one. The obvious solution is: total_product / current_element. But wait - NO DIVISION allowed!",
        duration: 4,
        scene3D: {
          camera: { position: [0, 6, 18], lookAt: [0, 0, 0] },
          objects: [
            { 
              type: "array", 
              values: [1, 2, 3, 4], 
              position: [0, 2, 0],
              boxColor: "#3b82f6"
            },
            { 
              type: "text-3d", 
              text: "÷ NOT ALLOWED!", 
              position: [0, -1, 0], 
              color: "#ef4444", 
              size: 0.7 
            },
            { 
              type: "text-3d", 
              text: "Product Except Self", 
              position: [0, 5, 0], 
              color: "#60a5fa", 
              size: 0.5 
            },
          ],
        },
      },
      {
        frameNumber: 2,
        title: "The Key Insight",
        explanation: "For any position i: result[i] = (product of all LEFT of i) × (product of all RIGHT of i). We need products from BOTH directions!",
        duration: 5,
        scene3D: {
          camera: { position: [0, 6, 18] },
          objects: [
            { 
              type: "array", 
              values: [1, 2, 3, 4], 
              position: [0, 3, 0],
              highlightIndex: 2,
              highlightColor: "#FFD700"
            },
            {
              type: "text-3d",
              text: "Left: 1×2 = 2",
              position: [-5, 0, 0],
              color: "#ef4444",
              size: 0.5
            },
            {
              type: "text-3d",
              text: "Right: 4 = 4",
              position: [5, 0, 0],
              color: "#22c55e",
              size: 0.5
            },
            {
              type: "text-3d",
              text: "Result: 2 × 4 = 8",
              position: [0, -2, 0],
              color: "#FFD700",
              size: 0.6
            },
          ],
        },
      },
      {
        frameNumber: 3,
        title: "Prefix Products (Left to Right)",
        explanation: "First pass: build a running product going LEFT to RIGHT. For each position, store the product of ALL elements BEFORE it!",
        duration: 5,
        scene3D: {
          camera: { position: [0, 6, 18] },
          objects: [
            { 
              type: "array", 
              values: [1, 2, 3, 4], 
              position: [0, 4, 0],
              boxColor: "#94a3b8"
            },
            { 
              type: "array", 
              values: [1, 1, 2, 6], 
              position: [0, 0, 0],
              boxColor: "#ef4444",
              highlightIndex: -1
            },
            {
              type: "text-3d",
              text: "Prefix Pass →",
              position: [0, 2, 0],
              color: "#ef4444",
              size: 0.5
            },
            {
              type: "variable-display",
              name: "prefix",
              value: "1→1→2→6",
              position: [-6, 0, 0],
              color: "#ef4444",
              glow: true
            },
          ],
        },
      },
      {
        frameNumber: 4,
        title: "Suffix Products (Right to Left)",
        explanation: "Second pass: going RIGHT to LEFT, multiply by the running product of ALL elements AFTER each position. Now we have both sides!",
        duration: 5,
        scene3D: {
          camera: { position: [0, 6, 18] },
          objects: [
            { 
              type: "array", 
              values: [1, 2, 3, 4], 
              position: [0, 4, 0],
              boxColor: "#94a3b8"
            },
            { 
              type: "array", 
              values: [24, 12, 8, 6], 
              position: [0, 0, 0],
              boxColor: "#22c55e",
              highlightIndex: -1
            },
            {
              type: "text-3d",
              text: "← Suffix Pass",
              position: [0, 2, 0],
              color: "#22c55e",
              size: 0.5
            },
            {
              type: "variable-display",
              name: "suffix",
              value: "24→12→4→1",
              position: [6, 0, 0],
              color: "#22c55e",
              glow: true
            },
          ],
        },
      },
      {
        frameNumber: 5,
        title: "O(n) Time, O(1) Space!",
        explanation: "Two passes through the array = O(n) time. Only use two variables (prefix & suffix), output array doesn't count = O(1) extra space! Optimal solution!",
        duration: 4,
        scene3D: {
          camera: { position: [0, 6, 18] },
          objects: [
            { 
              type: "array", 
              values: [24, 12, 8, 6], 
              position: [0, 2, 0],
              boxColor: "#22c55e"
            },
            { 
              type: "complexity-card",
              data: {
                time: "O(n)",
                space: "O(1)",
                note: "Optimal! ⚡"
              },
              position: [0, -2, 0],
              color: "#22c55e"
            },
            { 
              type: "text-3d", 
              text: "PERFECT SOLUTION! 🎯", 
              position: [0, 5, 0], 
              color: "#FFD700", 
              size: 0.6 
            },
          ],
        },
      },
    ],
  },

  problemSolution: {
    testCase: { input: { nums: [1,2,3,4] }, expectedOutput: [24,12,8,6] },
    
    frames: [
      {
        frameNumber: 1,
        title: "Problem Setup",
        explanation: "Given [1,2,3,4], return an array where each element is the product of all OTHER elements. No division allowed!",
        code: "nums = [1,2,3,4]\n# Want: [24,12,8,6]",
        duration: 3,
        scene3D: {
          camera: { position: [0, 5, 16] },
          objects: [
            { 
              type: "array", 
              values: [1, 2, 3, 4], 
              position: [0, 2, 0],
              boxColor: "#3b82f6"
            },
            { 
              type: "text-3d", 
              text: "Input Array", 
              position: [0, 4, 0], 
              color: "#60a5fa", 
              size: 0.4 
            },
            { 
              type: "array", 
              values: [24, 12, 8, 6], 
              position: [0, -2, 0],
              boxColor: "#94a3b8"
            },
            { 
              type: "text-3d", 
              text: "Goal Output", 
              position: [0, -4, 0], 
              color: "#94a3b8", 
              size: 0.4 
            },
          ],
        },
      },
      {
        frameNumber: 2,
        title: "Initialize Result Array",
        explanation: "Create result array filled with 1s. We'll build it up with prefix then suffix products.",
        code: "n = 4\nresult = [1, 1, 1, 1]\nprefix = 1",
        duration: 3,
        scene3D: {
          camera: { position: [0, 5, 16] },
          objects: [
            { 
              type: "array", 
              values: [1, 2, 3, 4], 
              position: [0, 3, 0],
              boxColor: "#3b82f6"
            },
            { 
              type: "text-3d", 
              text: "Input", 
              position: [-7, 3, 0], 
              color: "#60a5fa", 
              size: 0.35 
            },
            { 
              type: "array", 
              values: [1, 1, 1, 1], 
              position: [0, -1, 0],
              boxColor: "#94a3b8"
            },
            { 
              type: "text-3d", 
              text: "Result", 
              position: [-7, -1, 0], 
              color: "#94a3b8", 
              size: 0.35 
            },
            {
              type: "variable-display",
              name: "prefix",
              value: 1,
              position: [-7, -4, 0],
              color: "#ef4444"
            },
          ],
        },
      },
      {
        frameNumber: 3,
        title: "Prefix Pass: Index 0",
        explanation: "No elements before index 0, so result[0] = prefix = 1. Then update: prefix = prefix × nums[0] = 1 × 1 = 1.",
        code: "# i=0, prefix=1\nresult[0] = prefix  # 1\nprefix = prefix * nums[0]  # 1*1=1",
        duration: 3,
        scene3D: {
          camera: { position: [0, 5, 16] },
          objects: [
            { 
              type: "array", 
              values: [1, 2, 3, 4], 
              position: [0, 3, 0],
              highlightIndex: 0,
              highlightColor: "#ef4444",
              boxColor: "#3b82f6"
            },
            { 
              type: "array", 
              values: [1, 1, 1, 1], 
              position: [0, -1, 0],
              highlightIndex: 0,
              highlightColor: "#ef4444",
              boxColor: "#94a3b8"
            },
            {
              type: "variable-display",
              name: "prefix",
              value: 1,
              position: [-7, -4, 0],
              color: "#ef4444",
              glow: true
            },
            {
              type: "pointer",
              position: [-4.5, 5, 0],
              label: "i=0",
              color: "#ef4444"
            },
          ],
        },
      },
      {
        frameNumber: 4,
        title: "Prefix Pass: Index 1",
        explanation: "Product before index 1 is 1. result[1] = 1. Update: prefix = 1 × 2 = 2.",
        code: "# i=1, prefix=1\nresult[1] = prefix  # 1\nprefix = prefix * nums[1]  # 1*2=2",
        duration: 3,
        scene3D: {
          camera: { position: [0, 5, 16] },
          objects: [
            { 
              type: "array", 
              values: [1, 2, 3, 4], 
              position: [0, 3, 0],
              highlightIndex: 1,
              highlightColor: "#ef4444",
              boxColor: "#3b82f6"
            },
            { 
              type: "array", 
              values: [1, 1, 1, 1], 
              position: [0, -1, 0],
              highlightIndex: 1,
              highlightColor: "#ef4444",
              boxColor: "#94a3b8"
            },
            {
              type: "variable-display",
              name: "prefix",
              value: 2,
              position: [-7, -4, 0],
              color: "#ef4444",
              glow: true
            },
            {
              type: "pointer",
              position: [-1.5, 5, 0],
              label: "i=1",
              color: "#ef4444"
            },
          ],
        },
      },
      {
        frameNumber: 5,
        title: "Prefix Pass: Index 2",
        explanation: "Product before index 2 is 1×2=2. result[2] = 2. Update: prefix = 2 × 3 = 6.",
        code: "# i=2, prefix=2\nresult[2] = prefix  # 2\nprefix = prefix * nums[2]  # 2*3=6",
        duration: 3,
        scene3D: {
          camera: { position: [0, 5, 16] },
          objects: [
            { 
              type: "array", 
              values: [1, 2, 3, 4], 
              position: [0, 3, 0],
              highlightIndex: 2,
              highlightColor: "#ef4444",
              boxColor: "#3b82f6"
            },
            { 
              type: "array", 
              values: [1, 1, 2, 1], 
              position: [0, -1, 0],
              highlightIndex: 2,
              highlightColor: "#ef4444",
              boxColor: "#94a3b8"
            },
            {
              type: "variable-display",
              name: "prefix",
              value: 6,
              position: [-7, -4, 0],
              color: "#ef4444",
              glow: true
            },
            {
              type: "pointer",
              position: [1.5, 5, 0],
              label: "i=2",
              color: "#ef4444"
            },
          ],
        },
      },
      {
        frameNumber: 6,
        title: "Prefix Pass: Index 3 - Complete!",
        explanation: "Product before index 3 is 1×2×3=6. result[3] = 6. Prefix pass done! result = [1,1,2,6]",
        code: "# i=3, prefix=6\nresult[3] = prefix  # 6\n# Prefix pass complete! ✓",
        duration: 3,
        scene3D: {
          camera: { position: [0, 5, 16] },
          objects: [
            { 
              type: "array", 
              values: [1, 2, 3, 4], 
              position: [0, 3, 0],
              highlightIndex: 3,
              highlightColor: "#ef4444",
              boxColor: "#3b82f6"
            },
            { 
              type: "array", 
              values: [1, 1, 2, 6], 
              position: [0, -1, 0],
              highlightIndex: 3,
              highlightColor: "#ef4444",
              boxColor: "#94a3b8"
            },
            {
              type: "variable-display",
              name: "prefix",
              value: 6,
              position: [-7, -4, 0],
              color: "#ef4444",
              glow: true
            },
            {
              type: "pointer",
              position: [4.5, 5, 0],
              label: "i=3",
              color: "#ef4444"
            },
            { 
              type: "text-3d", 
              text: "Prefix Complete ✓", 
              position: [0, -4, 0], 
              color: "#22c55e", 
              size: 0.4 
            },
          ],
        },
      },
      {
        frameNumber: 7,
        title: "Suffix Pass Begins",
        explanation: "Now we go RIGHT to LEFT! Start with suffix = 1. We'll multiply each result[i] by the suffix value.",
        code: "suffix = 1\n# Now iterate from right to left",
        duration: 3,
        scene3D: {
          camera: { position: [0, 5, 16] },
          objects: [
            { 
              type: "array", 
              values: [1, 2, 3, 4], 
              position: [0, 3, 0],
              boxColor: "#3b82f6"
            },
            { 
              type: "array", 
              values: [1, 1, 2, 6], 
              position: [0, -1, 0],
              boxColor: "#94a3b8"
            },
            {
              type: "variable-display",
              name: "suffix",
              value: 1,
              position: [7, -4, 0],
              color: "#22c55e",
              glow: true
            },
            { 
              type: "text-3d", 
              text: "← Suffix Pass", 
              position: [0, 1, 0], 
              color: "#22c55e", 
              size: 0.4 
            },
          ],
        },
      },
      {
        frameNumber: 8,
        title: "Suffix Pass: Index 3",
        explanation: "No elements after index 3. result[3] *= suffix = 6 × 1 = 6. Update: suffix = 1 × 4 = 4.",
        code: "# i=3, suffix=1\nresult[3] *= suffix  # 6*1=6\nsuffix = suffix * nums[3]  # 1*4=4",
        duration: 3,
        scene3D: {
          camera: { position: [0, 5, 16] },
          objects: [
            { 
              type: "array", 
              values: [1, 2, 3, 4], 
              position: [0, 3, 0],
              highlightIndex: 3,
              highlightColor: "#22c55e",
              boxColor: "#3b82f6"
            },
            { 
              type: "array", 
              values: [1, 1, 2, 6], 
              position: [0, -1, 0],
              highlightIndex: 3,
              highlightColor: "#22c55e",
              boxColor: "#94a3b8"
            },
            {
              type: "variable-display",
              name: "suffix",
              value: 4,
              position: [7, -4, 0],
              color: "#22c55e",
              glow: true
            },
            {
              type: "pointer",
              position: [4.5, 5, 0],
              label: "i=3",
              color: "#22c55e"
            },
          ],
        },
      },
      {
        frameNumber: 9,
        title: "Suffix Pass: Index 2",
        explanation: "Product after index 2 is 4. result[2] = 2 × 4 = 8. Update: suffix = 4 × 3 = 12.",
        code: "# i=2, suffix=4\nresult[2] *= suffix  # 2*4=8 ✓\nsuffix = suffix * nums[2]  # 4*3=12",
        duration: 3,
        scene3D: {
          camera: { position: [0, 5, 16] },
          objects: [
            { 
              type: "array", 
              values: [1, 2, 3, 4], 
              position: [0, 3, 0],
              highlightIndex: 2,
              highlightColor: "#22c55e",
              boxColor: "#3b82f6"
            },
            { 
              type: "array", 
              values: [1, 1, 8, 6], 
              position: [0, -1, 0],
              highlightIndex: 2,
              highlightColor: "#22c55e",
              boxColor: "#FFD700"
            },
            {
              type: "variable-display",
              name: "suffix",
              value: 12,
              position: [7, -4, 0],
              color: "#22c55e",
              glow: true
            },
            {
              type: "pointer",
              position: [1.5, 5, 0],
              label: "i=2",
              color: "#22c55e"
            },
            { 
              type: "text-3d", 
              text: "2 × 4 = 8", 
              position: [0, -4, 0], 
              color: "#FFD700", 
              size: 0.35 
            },
          ],
        },
      },
      {
        frameNumber: 10,
        title: "Suffix Pass: Index 1",
        explanation: "Product after index 1 is 3×4=12. result[1] = 1 × 12 = 12. Update: suffix = 12 × 2 = 24.",
        code: "# i=1, suffix=12\nresult[1] *= suffix  # 1*12=12 ✓\nsuffix = suffix * nums[1]  # 12*2=24",
        duration: 3,
        scene3D: {
          camera: { position: [0, 5, 16] },
          objects: [
            { 
              type: "array", 
              values: [1, 2, 3, 4], 
              position: [0, 3, 0],
              highlightIndex: 1,
              highlightColor: "#22c55e",
              boxColor: "#3b82f6"
            },
            { 
              type: "array", 
              values: [1, 12, 8, 6], 
              position: [0, -1, 0],
              highlightIndex: 1,
              highlightColor: "#22c55e",
              boxColor: "#FFD700"
            },
            {
              type: "variable-display",
              name: "suffix",
              value: 24,
              position: [7, -4, 0],
              color: "#22c55e",
              glow: true
            },
            {
              type: "pointer",
              position: [-1.5, 5, 0],
              label: "i=1",
              color: "#22c55e"
            },
            { 
              type: "text-3d", 
              text: "1 × 12 = 12", 
              position: [0, -4, 0], 
              color: "#FFD700", 
              size: 0.35 
            },
          ],
        },
      },
      {
        frameNumber: 11,
        title: "Suffix Pass: Index 0 - Complete!",
        explanation: "Product after index 0 is 2×3×4=24. result[0] = 1 × 24 = 24. Done! Final result = [24,12,8,6] ✓",
        code: "# i=0, suffix=24\nresult[0] *= suffix  # 1*24=24 ✓\nreturn [24,12,8,6]",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 16] },
          objects: [
            { 
              type: "array", 
              values: [1, 2, 3, 4], 
              position: [0, 3, 0],
              highlightIndex: 0,
              highlightColor: "#22c55e",
              boxColor: "#3b82f6"
            },
            { 
              type: "array", 
              values: [24, 12, 8, 6], 
              position: [0, -1, 0],
              boxColor: "#22c55e"
            },
            {
              type: "variable-display",
              name: "suffix",
              value: 24,
              position: [7, -4, 0],
              color: "#22c55e",
              glow: true
            },
            {
              type: "pointer",
              position: [-4.5, 5, 0],
              label: "i=0",
              color: "#22c55e"
            },
            { 
              type: "text-3d", 
              text: "COMPLETE! ✓", 
              position: [0, -4, 0], 
              color: "#FFD700", 
              size: 0.5 
            },
          ],
        },
      },
      {
        frameNumber: 12,
        title: "Verify the Result",
        explanation: "Let's verify: 24=2×3×4 ✓, 12=1×3×4 ✓, 8=1×2×4 ✓, 6=1×2×3 ✓. Every element is the product of all others!",
        code: "// Verification:\n// [24, 12, 8, 6]\n// 24 = 2*3*4 ✓\n// 12 = 1*3*4 ✓\n// 8 = 1*2*4 ✓\n// 6 = 1*2*3 ✓",
        duration: 4,
        scene3D: {
          camera: { position: [0, 6, 18] },
          objects: [
            { 
              type: "array", 
              values: [24, 12, 8, 6], 
              position: [0, 2, 0],
              boxColor: "#22c55e"
            },
            {
              type: "text-3d",
              text: "24 = 2×3×4 ✓",
              position: [-6, -1, 0],
              color: "#22c55e",
              size: 0.35
            },
            {
              type: "text-3d",
              text: "12 = 1×3×4 ✓",
              position: [-2, -1, 0],
              color: "#22c55e",
              size: 0.35
            },
            {
              type: "text-3d",
              text: "8 = 1×2×4 ✓",
              position: [2, -1, 0],
              color: "#22c55e",
              size: 0.35
            },
            {
              type: "text-3d",
              text: "6 = 1×2×3 ✓",
              position: [6, -1, 0],
              color: "#22c55e",
              size: 0.35
            },
            { 
              type: "text-3d", 
              text: "ALL CORRECT! 🎉", 
              position: [0, 5, 0], 
              color: "#FFD700", 
              size: 0.6 
            },
          ],
        },
      },
      {
        frameNumber: 13,
        title: "Solution Complete!",
        explanation: "Two-pass prefix-suffix solution! O(n) time with just two loops, O(1) extra space. Elegant, optimal, and division-free!",
        code: "// Complexity:\n// Time: O(n) - two passes\n// Space: O(1) - constant extra\n// No division! ⚡",
        duration: 4,
        scene3D: {
          camera: { position: [0, 6, 18] },
          objects: [
            { 
              type: "array", 
              values: [24, 12, 8, 6], 
              position: [0, 3, 0],
              boxColor: "#22c55e"
            },
            { 
              type: "complexity-card", 
              position: [0, -1, 0], 
              data: { 
                time: "O(n)", 
                space: "O(1)",
                note: "Perfect!"
              }, 
              color: "#3b82f6" 
            },
            { 
              type: "text-3d", 
              text: "OPTIMAL SOLUTION! 🏆", 
              position: [0, 6, 0], 
              color: "#FFD700", 
              size: 0.7 
            },
          ],
        },
      },
    ],
  },

  complexity: { 
    time: "O(n)", 
    space: "O(1)", 
    explanation: "Two passes through array. Output array doesn't count as extra space per problem constraints." 
  },
};

export const seedProductExceptSelf = async () => {
  try {
    const existing = await Problem.findOne({ problemId: "product-of-array-except-self" });
    if (existing) {
      console.log("✅ Product of Array Except Self problem already exists");
      return existing;
    }
    const problem = await Problem.create(productExceptSelfProblem);
    console.log("✅ Product of Array Except Self problem seeded successfully!");
    console.log(`   - ${problem.algorithmTutorial.frames.length} tutorial frames`);
    console.log(`   - ${problem.problemSolution.frames.length} solution frames`);
    console.log(`   - Solutions in ${Object.keys(problem.solutions || {}).length} languages`);
    return problem;
  } catch (error) {
    console.error("❌ Error seeding Product of Array Except Self problem:", error);
    throw error;
  }
};

export default seedProductExceptSelf;