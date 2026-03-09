// import Problem from "../models/Problem";

// // ========================================
// // SEED DATA: MERGE SORT PROBLEM
// // ========================================

// export const mergeSortProblem = {
//   problemId: "merge-sort",
//   title: "Merge Sort",
//   difficulty: "Medium",
//   tags: ["Array", "Divide and Conquer", "Sorting", "Recursion"],
//   description: `Given an array of integers nums, sort the array in ascending order using the merge sort algorithm.

// Merge sort is a divide-and-conquer algorithm that:
// 1. Divides the array into two halves
// 2. Recursively sorts each half
// 3. Merges the two sorted halves back together

// Return the sorted array.`,
  
//   examples: [
//     {
//       input: "nums = [5,2,3,1]",
//       output: "[1,2,3,5]",
//       explanation: "After sorting the array in ascending order, it becomes [1,2,3,5].",
//     },
//     {
//       input: "nums = [5,1,1,2,0,0]",
//       output: "[0,0,1,1,2,5]",
//       explanation: "The sorted array is [0,0,1,1,2,5].",
//     },
//   ],

//   algorithmsRequired: ["merge-sort"],

//   solutions: {
//     "Python": `class Solution:
//     def sortArray(self, nums: List[int]) -> List[int]:
//         """
//         Sort array using merge sort algorithm.
        
//         Time Complexity: O(n log n)
//         Space Complexity: O(n)
//         """
//         if len(nums) <= 1:
//             return nums
        
//         # Divide
//         mid = len(nums) // 2
//         left = self.sortArray(nums[:mid])
//         right = self.sortArray(nums[mid:])
        
//         # Conquer (merge)
//         return self.merge(left, right)
    
//     def merge(self, left: List[int], right: List[int]) -> List[int]:
//         """Merge two sorted arrays into one sorted array."""
//         result = []
//         i = j = 0
        
//         # Compare elements and merge
//         while i < len(left) and j < len(right):
//             if left[i] <= right[j]:
//                 result.append(left[i])
//                 i += 1
//             else:
//                 result.append(right[j])
//                 j += 1
        
//         # Add remaining elements
//         result.extend(left[i:])
//         result.extend(right[j:])
        
//         return result`,

//     "C++": `class Solution {
// public:
//     vector<int> sortArray(vector<int>& nums) {
//         /*
//          * Sort array using merge sort algorithm.
//          * 
//          * Time Complexity: O(n log n)
//          * Space Complexity: O(n)
//          */
//         if (nums.size() <= 1) {
//             return nums;
//         }
        
//         // Divide
//         int mid = nums.size() / 2;
//         vector<int> left(nums.begin(), nums.begin() + mid);
//         vector<int> right(nums.begin() + mid, nums.end());
        
//         left = sortArray(left);
//         right = sortArray(right);
        
//         // Conquer (merge)
//         return merge(left, right);
//     }
    
// private:
//     vector<int> merge(vector<int>& left, vector<int>& right) {
//         vector<int> result;
//         int i = 0, j = 0;
        
//         // Compare elements and merge
//         while (i < left.size() && j < right.size()) {
//             if (left[i] <= right[j]) {
//                 result.push_back(left[i++]);
//             } else {
//                 result.push_back(right[j++]);
//             }
//         }
        
//         // Add remaining elements
//         while (i < left.size()) {
//             result.push_back(left[i++]);
//         }
//         while (j < right.size()) {
//             result.push_back(right[j++]);
//         }
        
//         return result;
//     }
// };`,

//     "Java": `class Solution {
//     /**
//      * Sort array using merge sort algorithm.
//      * 
//      * Time Complexity: O(n log n)
//      * Space Complexity: O(n)
//      */
//     public int[] sortArray(int[] nums) {
//         if (nums.length <= 1) {
//             return nums;
//         }
        
//         // Divide
//         int mid = nums.length / 2;
//         int[] left = Arrays.copyOfRange(nums, 0, mid);
//         int[] right = Arrays.copyOfRange(nums, mid, nums.length);
        
//         left = sortArray(left);
//         right = sortArray(right);
        
//         // Conquer (merge)
//         return merge(left, right);
//     }
    
//     private int[] merge(int[] left, int[] right) {
//         int[] result = new int[left.length + right.length];
//         int i = 0, j = 0, k = 0;
        
//         // Compare elements and merge
//         while (i < left.length && j < right.length) {
//             if (left[i] <= right[j]) {
//                 result[k++] = left[i++];
//             } else {
//                 result[k++] = right[j++];
//             }
//         }
        
//         // Add remaining elements
//         while (i < left.length) {
//             result[k++] = left[i++];
//         }
//         while (j < right.length) {
//             result[k++] = right[j++];
//         }
        
//         return result;
//     }
// }`,

//     "JavaScript": `/**
//  * @param {number[]} nums
//  * @return {number[]}
//  */
// var sortArray = function(nums) {
//     /*
//      * Sort array using merge sort algorithm.
//      * 
//      * Time Complexity: O(n log n)
//      * Space Complexity: O(n)
//      */
//     if (nums.length <= 1) {
//         return nums;
//     }
    
//     // Divide
//     const mid = Math.floor(nums.length / 2);
//     const left = sortArray(nums.slice(0, mid));
//     const right = sortArray(nums.slice(mid));
    
//     // Conquer (merge)
//     return merge(left, right);
// };

// function merge(left, right) {
//     const result = [];
//     let i = 0, j = 0;
    
//     // Compare elements and merge
//     while (i < left.length && j < right.length) {
//         if (left[i] <= right[j]) {
//             result.push(left[i++]);
//         } else {
//             result.push(right[j++]);
//         }
//     }
    
//     // Add remaining elements
//     return result.concat(left.slice(i)).concat(right.slice(j));
// }`,

//     "Go": `func sortArray(nums []int) []int {
//     /*
//      * Sort array using merge sort algorithm.
//      * 
//      * Time Complexity: O(n log n)
//      * Space Complexity: O(n)
//      */
//     if len(nums) <= 1 {
//         return nums
//     }
    
//     // Divide
//     mid := len(nums) / 2
//     left := sortArray(nums[:mid])
//     right := sortArray(nums[mid:])
    
//     // Conquer (merge)
//     return merge(left, right)
// }

// func merge(left, right []int) []int {
//     result := make([]int, 0, len(left) + len(right))
//     i, j := 0, 0
    
//     // Compare elements and merge
//     for i < len(left) && j < len(right) {
//         if left[i] <= right[j] {
//             result = append(result, left[i])
//             i++
//         } else {
//             result = append(result, right[j])
//             j++
//         }
//     }
    
//     // Add remaining elements
//     result = append(result, left[i:]...)
//     result = append(result, right[j:]...)
    
//     return result
// }`,
//   },

//   algorithmTutorial: {
//     algorithmId: "merge-sort",
//     algorithmName: "Merge Sort",
//     description: "A divide-and-conquer sorting algorithm that recursively splits arrays and merges them in sorted order",
    
//     frames: [
//       {
//         frameNumber: 1,
//         title: "Divide and Conquer!",
//         explanation: "Merge sort uses a powerful strategy: break the problem into smaller pieces, solve each piece, then combine the solutions. Brilliant!",
//         duration: 4,
//         scene3D: {
//           camera: { position: [0, 5, 15], lookAt: [0, 0, 0] },
//           objects: [
//             { type: "array-splitting", values: [38, 27, 43, 3, 9, 82, 10], position: [0, 2, 0], animation: "split" },
//             { type: "text-3d", text: "MERGE SORT", position: [0, 5, 0], color: "#a855f7", size: 0.6 },
//           ],
//         },
//       },
//       {
//         frameNumber: 2,
//         title: "The Two Phases",
//         explanation: "Phase 1 (DIVIDE): Split the array in half, recursively, until you have arrays of size 1. Phase 2 (MERGE): Combine sorted sub-arrays back together!",
//         duration: 5,
//         scene3D: {
//           camera: { position: [0, 5, 15] },
//           objects: [
//             { type: "two-phase-visualization",
//               divide: { depth: 3, color: "#ef4444" },
//               merge: { depth: 3, color: "#22c55e" },
//               position: [0, 0, 0]
//             },
//             { type: "labels",
//               divide: "Divide (Recursive)",
//               merge: "Merge (Combine)",
//               position: [-5, 3, 0]
//             },
//           ],
//         },
//       },
//       {
//         frameNumber: 3,
//         title: "Why Single Elements?",
//         explanation: "An array with 1 element is already sorted! This is our base case. We split until we reach this, then start merging upward.",
//         duration: 4,
//         scene3D: {
//           camera: { position: [0, 5, 15] },
//           objects: [
//             { type: "single-elements", values: [38, 27, 43, 3], position: [0, 0, 0], separated: true },
//             { type: "checkmarks", count: 4, position: [0, 2, 0], color: "#22c55e" },
//             { type: "text-3d", text: "All Sorted! ✓", position: [0, 4, 0], color: "#22c55e", size: 0.5 },
//           ],
//         },
//       },
//       {
//         frameNumber: 4,
//         title: "The Merge Magic",
//         explanation: "Merging two sorted arrays is elegant! Use two pointers, compare elements, always pick the smaller one. Result: one sorted array!",
//         duration: 5,
//         scene3D: {
//           camera: { position: [0, 5, 15] },
//           objects: [
//             { type: "merge-demonstration",
//               left: [3, 27],
//               right: [38, 43],
//               result: [3, 27, 38, 43],
//               animated: true,
//               position: [0, 0, 0]
//             },
//             { type: "comparison-arrows", showing: true, color: "#3b82f6" },
//           ],
//         },
//       },
//       {
//         frameNumber: 5,
//         title: "Guaranteed O(n log n)!",
//         explanation: "Merge sort ALWAYS runs in O(n log n) time - best, average, AND worst case! Plus it's stable (preserves order of equal elements).",
//         duration: 4,
//         scene3D: {
//           camera: { position: [0, 5, 15] },
//           objects: [
//             { type: "complexity-visualization",
//               levels: 3,
//               work: "O(n) per level",
//               position: [0, 0, 0]
//             },
//             { type: "text-3d", text: "O(n log n) Always! ⚡", position: [0, 4, 0], color: "#22c55e", size: 0.6 },
//           ],
//           particles: { type: "sparkles", count: 100, color: "#a855f7" },
//         },
//       },
//     ],
//   },

//   problemSolution: {
//     testCase: {
//       input: { nums: [38, 27, 43, 3] },
//       expectedOutput: [3, 27, 38, 43],
//     },
    
//     frames: [
//       {
//         frameNumber: 1,
//         title: "Problem Setup",
//         explanation: "We need to sort [38, 27, 43, 3] using merge sort. Let's divide and conquer!",
//         code: "nums = [38, 27, 43, 3]",
//         duration: 3,
//         scene3D: {
//           camera: { position: [0, 4, 14] },
//           objects: [
//             { type: "array", values: [38, 27, 43, 3], position: [0, 0, 0], animation: "fly-in" },
//             { type: "text-3d", text: "Unsorted Array", position: [0, 3, 0], color: "#ef4444", size: 0.5 },
//           ],
//         },
//       },
//       {
//         frameNumber: 2,
//         title: "First Split",
//         explanation: "Divide the array in half: [38, 27] and [43, 3]. We'll recursively sort each half.",
//         code: "mid = 2\nleft = [38, 27]\nright = [43, 3]",
//         duration: 3,
//         scene3D: {
//           camera: { position: [0, 4, 14] },
//           objects: [
//             { type: "array", values: [38, 27], position: [-3, 1, 0], label: "Left" },
//             { type: "array", values: [43, 3], position: [3, 1, 0], label: "Right" },
//             { type: "split-arrow", from: [0, 3, 0], to: [[-3, 1, 0], [3, 1, 0]], animated: true },
//           ],
//         },
//       },
//       {
//         frameNumber: 3,
//         title: "Split Left Half",
//         explanation: "Split [38, 27] into [38] and [27]. Single elements are already sorted!",
//         code: "left = [38, 27]\n→ [38] and [27]",
//         duration: 3,
//         scene3D: {
//           camera: { position: [0, 4, 14] },
//           objects: [
//             { type: "array", values: [38], position: [-4, -1, 0], sorted: true },
//             { type: "array", values: [27], position: [-2, -1, 0], sorted: true },
//             { type: "checkmarks", positions: [[-4, 0.5, 0], [-2, 0.5, 0]], color: "#22c55e" },
//           ],
//         },
//       },
//       {
//         frameNumber: 4,
//         title: "Merge Left Half",
//         explanation: "Merge [38] and [27]. Compare: 27 < 38, so result is [27, 38]. Left half sorted!",
//         code: "merge([38], [27])\n→ [27, 38]",
//         duration: 4,
//         scene3D: {
//           camera: { position: [0, 4, 14] },
//           objects: [
//             { type: "merge-animation",
//               left: [38],
//               right: [27],
//               result: [27, 38],
//               position: [-3, -1, 0],
//               animated: true
//             },
//             { type: "text-3d", text: "Left Sorted ✓", position: [-3, 2, 0], color: "#22c55e", size: 0.4 },
//           ],
//         },
//       },
//       {
//         frameNumber: 5,
//         title: "Split Right Half",
//         explanation: "Split [43, 3] into [43] and [3]. Both are single elements, already sorted!",
//         code: "right = [43, 3]\n→ [43] and [3]",
//         duration: 3,
//         scene3D: {
//           camera: { position: [0, 4, 14] },
//           objects: [
//             { type: "array", values: [43], position: [2, -1, 0], sorted: true },
//             { type: "array", values: [3], position: [4, -1, 0], sorted: true },
//             { type: "checkmarks", positions: [[2, 0.5, 0], [4, 0.5, 0]], color: "#22c55e" },
//           ],
//         },
//       },
//       {
//         frameNumber: 6,
//         title: "Merge Right Half",
//         explanation: "Merge [43] and [3]. Compare: 3 < 43, so result is [3, 43]. Right half sorted!",
//         code: "merge([43], [3])\n→ [3, 43]",
//         duration: 4,
//         scene3D: {
//           camera: { position: [0, 4, 14] },
//           objects: [
//             { type: "merge-animation",
//               left: [43],
//               right: [3],
//               result: [3, 43],
//               position: [3, -1, 0],
//               animated: true
//             },
//             { type: "text-3d", text: "Right Sorted ✓", position: [3, 2, 0], color: "#22c55e", size: 0.4 },
//           ],
//         },
//       },
//       {
//         frameNumber: 7,
//         title: "Final Merge Step 1",
//         explanation: "Now merge [27, 38] and [3, 43]. Compare first elements: 3 < 27, add 3 to result.",
//         code: "merge([27,38], [3,43])\nresult = [3]",
//         duration: 4,
//         scene3D: {
//           camera: { position: [0, 5, 16] },
//           objects: [
//             { type: "array", values: [27, 38], position: [-3, 2, 0], highlightIndex: 0 },
//             { type: "array", values: [3, 43], position: [3, 2, 0], highlightIndex: 0, selected: true },
//             { type: "array", values: [3], position: [0, -1, 0], glow: true },
//             { type: "comparison", left: 27, right: 3, result: ">", position: [0, 3.5, 0] },
//           ],
//         },
//       },
//       {
//         frameNumber: 8,
//         title: "Final Merge Step 2",
//         explanation: "Compare 27 and 43: 27 < 43, add 27 to result. Result = [3, 27]",
//         code: "result = [3, 27]",
//         duration: 3,
//         scene3D: {
//           camera: { position: [0, 5, 16] },
//           objects: [
//             { type: "array", values: [27, 38], position: [-3, 2, 0], highlightIndex: 0, selected: true },
//             { type: "array", values: [43], position: [3, 2, 0], highlightIndex: 0 },
//             { type: "array", values: [3, 27], position: [0, -1, 0], glow: true },
//           ],
//         },
//       },
//       {
//         frameNumber: 9,
//         title: "Final Merge Step 3",
//         explanation: "Compare 38 and 43: 38 < 43, add 38. Then add remaining 43. Complete!",
//         code: "result = [3, 27, 38, 43]",
//         duration: 4,
//         scene3D: {
//           camera: { position: [0, 5, 16], animation: "zoom-out" },
//           objects: [
//             { type: "array", values: [3, 27, 38, 43], position: [0, 0, 0], sorted: true, glow: true },
//             { type: "text-3d", text: "SORTED! ✓", position: [0, 3, 0], color: "#22c55e", size: 1 },
//           ],
//           particles: { type: "success-burst", position: [0, 0, 0], count: 200, color: "#22c55e" },
//         },
//       },
//       {
//         frameNumber: 10,
//         title: "Complete Recursion Tree",
//         explanation: "Here's the full merge sort process visualized as a tree. Divide down, merge up. Beautiful!",
//         code: "//     [38,27,43,3]\n//      /        \\\n//  [38,27]    [43,3]\n//   /   \\      /   \\\n// [38] [27]  [43] [3]\n//   \\   /      \\   /\n//  [27,38]    [3,43]\n//      \\        /\n//    [3,27,38,43]",
//         duration: 5,
//         scene3D: {
//           camera: { position: [0, 6, 18] },
//           objects: [
//             { type: "merge-sort-tree",
//               original: [38, 27, 43, 3],
//               animated: true,
//               position: [0, 0, 0],
//               showAllSteps: true
//             },
//           ],
//         },
//       },
//       {
//         frameNumber: 11,
//         title: "Solution Complete!",
//         explanation: "Merge sort guaranteed O(n log n) time, O(n) space. Stable, predictable, and elegant!",
//         code: "// Time: O(n log n)\n// Space: O(n)\n// Always reliable! 🎯",
//         duration: 4,
//         scene3D: {
//           camera: { position: [0, 6, 18] },
//           objects: [
//             { type: "array", values: [3, 27, 38, 43], position: [0, 1, 0], sorted: true, glowing: true },
//             { type: "complexity-card", position: [0, -2, 0], data: { time: "O(n log n)", space: "O(n)" }, color: "#a855f7" },
//             { type: "text-3d", text: "SOLVED! 🎉", position: [0, 4, 0], color: "#22c55e", size: 1 },
//           ],
//           particles: { type: "fireworks", position: [0, 5, 0], count: 300, colors: ["#a855f7", "#22c55e", "#3b82f6"] },
//         },
//       },
//     ],
//   },

//   complexity: {
//     time: "O(n log n)",
//     space: "O(n)",
//     explanation: "Merge sort divides the array log(n) times, and each merge operation takes O(n) time to combine. The recursion requires O(n) extra space for temporary arrays.",
//   },
// };

// export const seedMergeSort = async () => {
//   try {
//     const existing = await Problem.findOne({ problemId: "merge-sort" });
//     if (existing) {
//       console.log("✅ Merge Sort problem already exists");
//       return existing;
//     }

//     const problem = await Problem.create(mergeSortProblem);
//     console.log("✅ Merge Sort problem seeded successfully!");
//     console.log(`   - ${problem.algorithmTutorial.frames.length} tutorial frames`);
//     console.log(`   - ${problem.problemSolution.frames.length} solution frames`);
//     console.log(`   - Solutions in ${Object.keys(problem.solutions || {}).length} languages`);
    
//     return problem;
//   } catch (error) {
//     console.error("❌ Error seeding Merge Sort problem:", error);
//     throw error;
//   }
// };

// export default seedMergeSort;

import Problem from "../models/Problem";

// ========================================
// SEED DATA: MERGE SORT PROBLEM (IMPROVED)
// ========================================

export const mergeSortProblem = {
  problemId: "merge-sort",
  title: "Merge Sort",
  difficulty: "Medium",
  tags: ["Array", "Divide and Conquer", "Sorting", "Recursion"],
  description: `Given an array of integers nums, sort the array in ascending order using the merge sort algorithm.

Merge sort is a divide-and-conquer algorithm that:
1. Divides the array into two halves
2. Recursively sorts each half
3. Merges the two sorted halves back together

Return the sorted array.`,
  
  examples: [
    {
      input: "nums = [5,2,3,1]",
      output: "[1,2,3,5]",
      explanation: "After sorting the array in ascending order, it becomes [1,2,3,5].",
    },
    {
      input: "nums = [5,1,1,2,0,0]",
      output: "[0,0,1,1,2,5]",
      explanation: "The sorted array is [0,0,1,1,2,5].",
    },
  ],

  algorithmsRequired: ["merge-sort"],

  solutions: {
    "Python": `class Solution:
    def sortArray(self, nums: List[int]) -> List[int]:
        """
        Sort array using merge sort algorithm.
        
        Time Complexity: O(n log n)
        Space Complexity: O(n)
        """
        if len(nums) <= 1:
            return nums
        
        # Divide
        mid = len(nums) // 2
        left = self.sortArray(nums[:mid])
        right = self.sortArray(nums[mid:])
        
        # Conquer (merge)
        return self.merge(left, right)
    
    def merge(self, left: List[int], right: List[int]) -> List[int]:
        """Merge two sorted arrays into one sorted array."""
        result = []
        i = j = 0
        
        # Compare elements and merge
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
        
        # Add remaining elements
        result.extend(left[i:])
        result.extend(right[j:])
        
        return result`,

    "C++": `class Solution {
public:
    vector<int> sortArray(vector<int>& nums) {
        /*
         * Sort array using merge sort algorithm.
         * 
         * Time Complexity: O(n log n)
         * Space Complexity: O(n)
         */
        if (nums.size() <= 1) {
            return nums;
        }
        
        // Divide
        int mid = nums.size() / 2;
        vector<int> left(nums.begin(), nums.begin() + mid);
        vector<int> right(nums.begin() + mid, nums.end());
        
        left = sortArray(left);
        right = sortArray(right);
        
        // Conquer (merge)
        return merge(left, right);
    }
    
private:
    vector<int> merge(vector<int>& left, vector<int>& right) {
        vector<int> result;
        int i = 0, j = 0;
        
        // Compare elements and merge
        while (i < left.size() && j < right.size()) {
            if (left[i] <= right[j]) {
                result.push_back(left[i++]);
            } else {
                result.push_back(right[j++]);
            }
        }
        
        // Add remaining elements
        while (i < left.size()) {
            result.push_back(left[i++]);
        }
        while (j < right.size()) {
            result.push_back(right[j++]);
        }
        
        return result;
    }
};`,

    "Java": `class Solution {
    /**
     * Sort array using merge sort algorithm.
     * 
     * Time Complexity: O(n log n)
     * Space Complexity: O(n)
     */
    public int[] sortArray(int[] nums) {
        if (nums.length <= 1) {
            return nums;
        }
        
        // Divide
        int mid = nums.length / 2;
        int[] left = Arrays.copyOfRange(nums, 0, mid);
        int[] right = Arrays.copyOfRange(nums, mid, nums.length);
        
        left = sortArray(left);
        right = sortArray(right);
        
        // Conquer (merge)
        return merge(left, right);
    }
    
    private int[] merge(int[] left, int[] right) {
        int[] result = new int[left.length + right.length];
        int i = 0, j = 0, k = 0;
        
        // Compare elements and merge
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                result[k++] = left[i++];
            } else {
                result[k++] = right[j++];
            }
        }
        
        // Add remaining elements
        while (i < left.length) {
            result[k++] = left[i++];
        }
        while (j < right.length) {
            result[k++] = right[j++];
        }
        
        return result;
    }
}`,

    "JavaScript": `/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortArray = function(nums) {
    /*
     * Sort array using merge sort algorithm.
     * 
     * Time Complexity: O(n log n)
     * Space Complexity: O(n)
     */
    if (nums.length <= 1) {
        return nums;
    }
    
    // Divide
    const mid = Math.floor(nums.length / 2);
    const left = sortArray(nums.slice(0, mid));
    const right = sortArray(nums.slice(mid));
    
    // Conquer (merge)
    return merge(left, right);
};

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    
    // Compare elements and merge
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }
    
    // Add remaining elements
    return result.concat(left.slice(i)).concat(right.slice(j));
}`,

    "Go": `func sortArray(nums []int) []int {
    /*
     * Sort array using merge sort algorithm.
     * 
     * Time Complexity: O(n log n)
     * Space Complexity: O(n)
     */
    if len(nums) <= 1 {
        return nums
    }
    
    // Divide
    mid := len(nums) / 2
    left := sortArray(nums[:mid])
    right := sortArray(nums[mid:])
    
    // Conquer (merge)
    return merge(left, right)
}

func merge(left, right []int) []int {
    result := make([]int, 0, len(left) + len(right))
    i, j := 0, 0
    
    // Compare elements and merge
    for i < len(left) && j < len(right) {
        if left[i] <= right[j] {
            result = append(result, left[i])
            i++
        } else {
            result = append(result, right[j])
            j++
        }
    }
    
    // Add remaining elements
    result = append(result, left[i:]...)
    result = append(result, right[j:]...)
    
    return result
}`,
  },

  algorithmTutorial: {
    algorithmId: "merge-sort",
    algorithmName: "Merge Sort",
    description: "A divide-and-conquer sorting algorithm that recursively splits arrays and merges them in sorted order",
    
    frames: [
      {
        frameNumber: 1,
        title: "Divide and Conquer!",
        explanation: "Merge sort uses a powerful strategy: break the problem into smaller pieces, solve each piece, then combine the solutions. Brilliant!",
        duration: 4,
        scene3D: {
          camera: { position: [0, 6, 18], lookAt: [0, 0, 0] },
          objects: [
            { type: "array", values: [38, 27, 43, 3, 9, 82, 10], position: [0, 0, 0] },
            { type: "text-3d", text: "MERGE SORT", position: [0, 4, 0], color: "#a855f7", size: 0.6 },
            { type: "text-3d", text: "Divide & Conquer Strategy", position: [0, -3, 0], color: "#60a5fa", size: 0.4 },
          ],
        },
      },
      {
        frameNumber: 2,
        title: "The Two Phases",
        explanation: "Phase 1 (DIVIDE): Split the array in half, recursively, until you have arrays of size 1. Phase 2 (MERGE): Combine sorted sub-arrays back together!",
        duration: 5,
        scene3D: {
          camera: { position: [0, 6, 18] },
          objects: [
            { type: "two-phase-visualization",
              divide: { depth: 3, color: "#ef4444" },
              merge: { depth: 3, color: "#22c55e" },
              position: [0, -1, 0]
            },
            { type: "labels",
              divide: "Divide (Recursive)",
              merge: "Merge (Combine)",
              position: [0, 5, 0]
            },
          ],
        },
      },
      {
        frameNumber: 3,
        title: "Why Single Elements?",
        explanation: "An array with 1 element is already sorted! This is our base case. We split until we reach this, then start merging upward.",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 16] },
          objects: [
            { type: "single-elements", values: [38, 27, 43, 3], position: [0, 0, 0], separated: true },
            { type: "text-3d", text: "All Sorted! ✓", position: [0, 4, 0], color: "#22c55e", size: 0.5 },
            { type: "text-3d", text: "Base Case Reached", position: [0, -3, 0], color: "#60a5fa", size: 0.4 },
          ],
        },
      },
      {
        frameNumber: 4,
        title: "The Merge Magic",
        explanation: "Merging two sorted arrays is elegant! Use two pointers, compare elements, always pick the smaller one. Result: one sorted array!",
        duration: 5,
        scene3D: {
          camera: { position: [0, 6, 18] },
          objects: [
            { type: "merge-demonstration",
              left: [3, 27],
              right: [38, 43],
              result: [3, 27, 38, 43],
              animated: true,
              position: [0, 0, 0]
            },
            { type: "comparison-arrows", showing: true, color: "#3b82f6" },
          ],
        },
      },
      {
        frameNumber: 5,
        title: "Guaranteed O(n log n)!",
        explanation: "Merge sort ALWAYS runs in O(n log n) time - best, average, AND worst case! Plus it's stable (preserves order of equal elements).",
        duration: 4,
        scene3D: {
          camera: { position: [0, 6, 18] },
          objects: [
            { type: "complexity-visualization",
              levels: 3,
              work: "O(n)",
              position: [0, 0, 0]
            },
            { type: "text-3d", text: "O(n log n) Always! ⚡", position: [0, 5, 0], color: "#22c55e", size: 0.6 },
          ],
        },
      },
    ],
  },

  problemSolution: {
    testCase: {
      input: { nums: [38, 27, 43, 3] },
      expectedOutput: [3, 27, 38, 43],
    },
    
    frames: [
      {
        frameNumber: 1,
        title: "Problem Setup",
        explanation: "We need to sort [38, 27, 43, 3] using merge sort. Let's divide and conquer!",
        code: "nums = [38, 27, 43, 3]",
        duration: 3,
        scene3D: {
          camera: { position: [0, 5, 16] },
          objects: [
            { type: "array", values: [38, 27, 43, 3], position: [0, 1, 0], animation: "fly-in" },
            { type: "text-3d", text: "Unsorted Array", position: [0, 4, 0], color: "#ef4444", size: 0.5 },
            { type: "text-3d", text: "Goal: Sort Ascending", position: [0, -2, 0], color: "#94a3b8", size: 0.4 },
          ],
        },
      },
      {
        frameNumber: 2,
        title: "First Split",
        explanation: "Divide the array in half: [38, 27] and [43, 3]. We'll recursively sort each half.",
        code: "mid = 2\nleft = [38, 27]\nright = [43, 3]",
        duration: 3,
        scene3D: {
          camera: { position: [0, 5, 16] },
          objects: [
            { type: "array", values: [38, 27], position: [-4, 2, 0], boxColor: "#3b82f6" },
            { type: "array", values: [43, 3], position: [4, 2, 0], boxColor: "#a855f7" },
            { type: "text-3d", text: "Left", position: [-4, 4, 0], color: "#3b82f6", size: 0.35 },
            { type: "text-3d", text: "Right", position: [4, 4, 0], color: "#a855f7", size: 0.35 },
            { type: "split-arrow", from: [0, 5, 0], to: [[-4, 2, 0], [4, 2, 0]], animated: true },
          ],
        },
      },
      {
        frameNumber: 3,
        title: "Split Left Half",
        explanation: "Split [38, 27] into [38] and [27]. Single elements are already sorted!",
        code: "left = [38, 27]\n→ [38] and [27]",
        duration: 3,
        scene3D: {
          camera: { position: [0, 5, 16] },
          objects: [
            { type: "array", values: [38], position: [-5, 0, 0], boxColor: "#22c55e" },
            { type: "array", values: [27], position: [-3, 0, 0], boxColor: "#22c55e" },
            { type: "checkmarks", positions: [[-5, 1.8, 0], [-3, 1.8, 0]], color: "#22c55e" },
            { type: "text-3d", text: "Base Case ✓", position: [-4, 3, 0], color: "#22c55e", size: 0.4 },
          ],
        },
      },
      {
        frameNumber: 4,
        title: "Merge Left Half",
        explanation: "Merge [38] and [27]. Compare: 27 < 38, so result is [27, 38]. Left half sorted!",
        code: "merge([38], [27])\n→ [27, 38]",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 16] },
          objects: [
            { type: "merge-animation",
              left: [38],
              right: [27],
              result: [27, 38],
              position: [-4, 0, 0],
              animated: true
            },
            { type: "text-3d", text: "Left Half Sorted ✓", position: [-4, 4, 0], color: "#22c55e", size: 0.4 },
          ],
        },
      },
      {
        frameNumber: 5,
        title: "Split Right Half",
        explanation: "Split [43, 3] into [43] and [3]. Both are single elements, already sorted!",
        code: "right = [43, 3]\n→ [43] and [3]",
        duration: 3,
        scene3D: {
          camera: { position: [0, 5, 16] },
          objects: [
            { type: "array", values: [43], position: [3, 0, 0], boxColor: "#22c55e" },
            { type: "array", values: [3], position: [5, 0, 0], boxColor: "#22c55e" },
            { type: "checkmarks", positions: [[3, 1.8, 0], [5, 1.8, 0]], color: "#22c55e" },
            { type: "text-3d", text: "Base Case ✓", position: [4, 3, 0], color: "#22c55e", size: 0.4 },
          ],
        },
      },
      {
        frameNumber: 6,
        title: "Merge Right Half",
        explanation: "Merge [43] and [3]. Compare: 3 < 43, so result is [3, 43]. Right half sorted!",
        code: "merge([43], [3])\n→ [3, 43]",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 16] },
          objects: [
            { type: "merge-animation",
              left: [43],
              right: [3],
              result: [3, 43],
              position: [4, 0, 0],
              animated: true
            },
            { type: "text-3d", text: "Right Half Sorted ✓", position: [4, 4, 0], color: "#22c55e", size: 0.4 },
          ],
        },
      },
      {
        frameNumber: 7,
        title: "Final Merge Step 1",
        explanation: "Now merge [27, 38] and [3, 43]. Compare first elements: 3 < 27, add 3 to result.",
        code: "merge([27,38], [3,43])\nCompare: 3 < 27\nresult = [3]",
        duration: 4,
        scene3D: {
          camera: { position: [0, 6, 18] },
          objects: [
            { type: "array", values: [27, 38], position: [-4, 3, 0], highlightIndex: 0, boxColor: "#3b82f6" },
            { type: "array", values: [3, 43], position: [4, 3, 0], highlightIndex: 0, highlightColor: "#FFD700", boxColor: "#a855f7" },
            { type: "array", values: [3], position: [0, -1, 0], boxColor: "#22c55e" },
            { type: "comparison", left: 27, right: 3, result: ">", position: [0, 5, 0] },
            { type: "text-3d", text: "Pick Smaller ↓", position: [0, 0.5, 0], color: "#FFD700", size: 0.35 },
          ],
        },
      },
      {
        frameNumber: 8,
        title: "Final Merge Step 2",
        explanation: "Compare 27 and 43: 27 < 43, add 27 to result. Result = [3, 27]",
        code: "Compare: 27 < 43\nresult = [3, 27]",
        duration: 3,
        scene3D: {
          camera: { position: [0, 6, 18] },
          objects: [
            { type: "array", values: [27, 38], position: [-4, 3, 0], highlightIndex: 0, highlightColor: "#FFD700", boxColor: "#3b82f6" },
            { type: "array", values: [43], position: [4, 3, 0], highlightIndex: 0, boxColor: "#a855f7" },
            { type: "array", values: [3, 27], position: [0, -1, 0], boxColor: "#22c55e" },
            { type: "comparison", left: 27, right: 43, result: "<", position: [0, 5, 0] },
          ],
        },
      },
      {
        frameNumber: 9,
        title: "Final Merge Complete",
        explanation: "Compare 38 and 43: 38 < 43, add 38. Then add remaining 43. Final sorted array: [3, 27, 38, 43]!",
        code: "result = [3, 27, 38, 43]\n✓ SORTED!",
        duration: 4,
        scene3D: {
          camera: { position: [0, 6, 18] },
          objects: [
            { type: "array", values: [3, 27, 38, 43], position: [0, 0, 0], boxColor: "#22c55e" },
            { type: "text-3d", text: "SORTED! ✓", position: [0, 4, 0], color: "#22c55e", size: 0.7 },
            { type: "text-3d", text: "Merge Sort Complete", position: [0, -3, 0], color: "#60a5fa", size: 0.4 },
          ],
          particles: { type: "success-burst", position: [0, 0, 0], count: 200, color: "#22c55e" },
        },
      },
      {
        frameNumber: 10,
        title: "Complete Recursion Tree",
        explanation: "Here's the full merge sort process visualized as a tree. Divide down, merge up. Beautiful!",
        code: "//     [38,27,43,3]\n//      /        \\\n//  [38,27]    [43,3]\n//   /   \\      /   \\\n// [38] [27]  [43] [3]\n//   \\   /      \\   /\n//  [27,38]    [3,43]\n//      \\        /\n//    [3,27,38,43]",
        duration: 5,
        scene3D: {
          camera: { position: [0, 7, 20] },
          objects: [
            { type: "merge-sort-tree",
              original: [38, 27, 43, 3],
              animated: true,
              position: [0, 0, 0],
              showAllSteps: true
            },
            { type: "text-3d", text: "Recursion Tree", position: [0, 6, 0], color: "#a855f7", size: 0.5 },
          ],
        },
      },
      {
        frameNumber: 11,
        title: "Solution Complete!",
        explanation: "Merge sort guaranteed O(n log n) time, O(n) space. Stable, predictable, and elegant!",
        code: "// Time: O(n log n)\n// Space: O(n)\n// Always reliable! 🎯",
        duration: 4,
        scene3D: {
          camera: { position: [0, 6, 18] },
          objects: [
            { type: "array", values: [3, 27, 38, 43], position: [0, 2, 0], boxColor: "#22c55e" },
            { type: "complexity-card", position: [0, -2, 0], data: { time: "O(n log n)", space: "O(n)" }, color: "#a855f7" },
            { type: "text-3d", text: "PERFECT! 🎉", position: [0, 5, 0], color: "#FFD700", size: 0.7 },
          ],
          particles: { type: "fireworks", position: [0, 5, 0], count: 300, colors: ["#a855f7", "#22c55e", "#3b82f6"] },
        },
      },
    ],
  },

  complexity: {
    time: "O(n log n)",
    space: "O(n)",
    explanation: "Merge sort divides the array log(n) times, and each merge operation takes O(n) time to combine. The recursion requires O(n) extra space for temporary arrays.",
  },
};

export const seedMergeSort = async () => {
  try {
    const existing = await Problem.findOne({ problemId: "merge-sort" });
    if (existing) {
      console.log("✅ Merge Sort problem already exists");
      return existing;
    }

    const problem = await Problem.create(mergeSortProblem);
    console.log("✅ Merge Sort problem seeded successfully!");
    console.log(`   - ${problem.algorithmTutorial.frames.length} tutorial frames`);
    console.log(`   - ${problem.problemSolution.frames.length} solution frames`);
    console.log(`   - Solutions in ${Object.keys(problem.solutions || {}).length} languages`);
    
    return problem;
  } catch (error) {
    console.error("❌ Error seeding Merge Sort problem:", error);
    throw error;
  }
};

export default seedMergeSort;