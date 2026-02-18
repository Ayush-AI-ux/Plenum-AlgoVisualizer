import Problem from "../models/Problem";

export const longestSubstringProblem = {
  problemId: "longest-substring-without-repeating-characters",
  title: "Longest Substring Without Repeating Characters",
  difficulty: "Medium",
  tags: ["String", "Hash Table", "Sliding Window"],
  description: `Given a string s, find the length of the longest substring without repeating characters.`,
  
  examples: [
    { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with the length of 3.' },
    { input: 's = "bbbbb"', output: "1", explanation: 'The answer is "b", with the length of 1.' },
    { input: 's = "pwwkew"', output: "3", explanation: 'The answer is "wke", with the length of 3.' },
  ],

  algorithmsRequired: ["sliding-window"],

  solutions: {
    "Python": `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        """
        Sliding window with hash map to track character positions.
        
        Time Complexity: O(n)
        Space Complexity: O(min(m,n)) where m is charset size
        """
        char_index = {}
        max_length = 0
        left = 0
        
        for right in range(len(s)):
            # If character seen before and in current window
            if s[right] in char_index and char_index[s[right]] >= left:
                left = char_index[s[right]] + 1
            
            # Update character's latest position
            char_index[s[right]] = right
            
            # Update max length
            max_length = max(max_length, right - left + 1)
        
        return max_length`,

    "C++": `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> charIndex;
        int maxLength = 0;
        int left = 0;
        
        for (int right = 0; right < s.length(); right++) {
            if (charIndex.count(s[right]) && charIndex[s[right]] >= left) {
                left = charIndex[s[right]] + 1;
            }
            
            charIndex[s[right]] = right;
            maxLength = max(maxLength, right - left + 1);
        }
        
        return maxLength;
    }
};`,

    "Java": `class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> charIndex = new HashMap<>();
        int maxLength = 0;
        int left = 0;
        
        for (int right = 0; right < s.length(); right++) {
            if (charIndex.containsKey(s.charAt(right)) && 
                charIndex.get(s.charAt(right)) >= left) {
                left = charIndex.get(s.charAt(right)) + 1;
            }
            
            charIndex.put(s.charAt(right), right);
            maxLength = Math.max(maxLength, right - left + 1);
        }
        
        return maxLength;
    }
}`,

    "JavaScript": `var lengthOfLongestSubstring = function(s) {
    const charIndex = new Map();
    let maxLength = 0;
    let left = 0;
    
    for (let right = 0; right < s.length; right++) {
        if (charIndex.has(s[right]) && charIndex.get(s[right]) >= left) {
            left = charIndex.get(s[right]) + 1;
        }
        
        charIndex.set(s[right], right);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
};`,

    "Go": `func lengthOfLongestSubstring(s string) int {
    charIndex := make(map[byte]int)
    maxLength := 0
    left := 0
    
    for right := 0; right < len(s); right++ {
        if idx, found := charIndex[s[right]]; found && idx >= left {
            left = idx + 1
        }
        
        charIndex[s[right]] = right
        if right - left + 1 > maxLength {
            maxLength = right - left + 1
        }
    }
    
    return maxLength
}`,
  },

  algorithmTutorial: {
    algorithmId: "sliding-window",
    algorithmName: "Sliding Window",
    description: "Maintain a dynamic window that expands and contracts to find optimal subarrays or substrings",
    
    frames: [
      {
        frameNumber: 1,
        title: "What is Sliding Window?",
        explanation: "Imagine a window that slides across a string or array. The window can expand (grow larger) or contract (shrink). This technique is perfect for finding optimal subarrays or substrings!",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 15], lookAt: [0, 0, 0] },
          objects: [
            { type: "string-array", text: "abcabcbb", position: [0, 0, 0], animation: "appear" },
            { type: "window-rectangle", start: 0, end: 2, position: [0, 0, 0], color: "#3b82f6", opacity: 0.3 },
            { type: "text-3d", text: "SLIDING WINDOW", position: [0, 4, 0], color: "#3b82f6", size: 0.6 },
          ],
          lights: [
            { type: "ambient", intensity: 0.5 },
            { type: "point", position: [10, 10, 10], intensity: 1 },
          ],
        },
      },
      {
        frameNumber: 2,
        title: "Two Pointers: Left & Right",
        explanation: "We use TWO pointers: 'right' pointer expands the window by moving forward, 'left' pointer shrinks the window when needed. The area between them is our current window!",
        duration: 5,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "string-array", text: "abcabcbb", position: [0, 0, 0] },
            { type: "pointer", label: "left", position: [-4, 2, 0], color: "#ef4444", targetIndex: 0 },
            { type: "pointer", label: "right", position: [0, 2, 0], color: "#22c55e", targetIndex: 2 },
            { type: "window-highlight", start: 0, end: 2, color: "#3b82f6", opacity: 0.3 },
            { type: "text-3d", text: "Window: 'abc'", position: [0, -2, 0], color: "#60a5fa", size: 0.4 },
          ],
        },
      },
      {
        frameNumber: 3,
        title: "Hash Map Tracks Characters",
        explanation: "We use a hash map to store each character and its most recent index. This helps us detect duplicates instantly and know where to move the left pointer!",
        duration: 5,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "string-array", text: "abc", position: [0, 1, 0] },
            { type: "hashmap-visualization", 
              entries: [
                { key: "a", value: 0 },
                { key: "b", value: 1 },
                { key: "c", value: 2 }
              ],
              position: [0, -2, 0]
            },
            { type: "text-3d", text: "Track Last Seen Index", position: [0, 4, 0], color: "#a855f7", size: 0.5 },
          ],
          particles: { type: "sparkles", position: [0, -2, 0], count: 50, color: "#a855f7" },
        },
      },
      {
        frameNumber: 4,
        title: "Expand & Contract Strategy",
        explanation: "ALWAYS expand right pointer. When we find a duplicate character, contract the left pointer to just after the previous occurrence. Keep tracking the maximum window size!",
        duration: 5,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "flowchart",
              steps: [
                "Move right pointer →",
                "Character in window?",
                "Yes: Move left past duplicate",
                "No: Expand window",
                "Update max length"
              ],
              position: [0, 0, 0]
            },
          ],
        },
      },
      {
        frameNumber: 5,
        title: "O(n) Linear Time!",
        explanation: "Each character is visited at most TWICE: once by right pointer, once by left pointer. This gives us O(n) time complexity - super efficient!",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "complexity-visualization",
              analysis: {
                time: "O(n)",
                space: "O(min(m,n))",
                explanation: "n = string length, m = charset size"
              },
              position: [0, 0, 0]
            },
            { type: "text-3d", text: "Linear Time! ⚡", position: [0, 3, 0], color: "#22c55e", size: 0.6 },
          ],
          particles: { type: "sparkles", count: 100, color: "#22c55e" },
        },
      },
    ],
  },

  problemSolution: {
    testCase: { input: { s: "abcabcbb" }, expectedOutput: 3 },
    
    frames: [
      {
        frameNumber: 1,
        title: "Problem Setup",
        explanation: 'Find the longest substring without repeating characters in "abcabcbb".',
        code: 's = "abcabcbb"',
        duration: 3,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "string-display", text: "abcabcbb", position: [0, 0, 0], animation: "type-in" },
            { type: "text-3d", text: "Find Longest Unique Substring", position: [0, 3, 0], color: "#ffa64d", size: 0.5 },
          ],
        },
      },
      {
        frameNumber: 2,
        title: "Initialize",
        explanation: "Create empty hash map and set left=0, right will move forward. maxLength starts at 0.",
        code: "char_index = {}\nleft = 0, max_length = 0",
        duration: 3,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "string-display", text: "abcabcbb", position: [0, 1, 0] },
            { type: "hashmap-container", position: [0, -2, 0], contents: [], label: "char_index: { }" },
            { type: "variable-display", name: "maxLength", value: 0, position: [4, -2, 0] },
          ],
        },
      },
      {
        frameNumber: 3,
        title: "Index 0: 'a'",
        explanation: "First character 'a'. Not in map, add it. Window = 'a', length = 1. Update max to 1.",
        code: "char_index['a'] = 0\nmax_length = 1",
        duration: 3,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "string-display", text: "abcabcbb", position: [0, 1, 0], highlightRange: [0, 0] },
            { type: "pointer", label: "L", position: [-7, 2.5, 0], color: "#ef4444", targetIndex: 0 },
            { type: "pointer", label: "R", position: [-7, 3, 0], color: "#22c55e", targetIndex: 0 },
            { type: "hashmap-container", position: [0, -2, 0], contents: [{ key: "a", value: 0 }] },
            { type: "variable-display", name: "maxLength", value: 1, position: [4, -2, 0], glow: true },
          ],
        },
      },
      {
        frameNumber: 4,
        title: "Index 1: 'b'",
        explanation: "Character 'b'. Not in map, add it. Window = 'ab', length = 2. Update max to 2.",
        code: "char_index['b'] = 1\nmax_length = 2",
        duration: 3,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "string-display", text: "abcabcbb", position: [0, 1, 0], highlightRange: [0, 1] },
            { type: "pointer", label: "L", position: [-7, 2.5, 0], color: "#ef4444", targetIndex: 0 },
            { type: "pointer", label: "R", position: [-5, 3, 0], color: "#22c55e", targetIndex: 1 },
            { type: "hashmap-container", position: [0, -2, 0], contents: [{ key: "a", value: 0 }, { key: "b", value: 1 }] },
            { type: "variable-display", name: "maxLength", value: 2, position: [4, -2, 0], glow: true },
          ],
        },
      },
      {
        frameNumber: 5,
        title: "Index 2: 'c'",
        explanation: "Character 'c'. Not in map, add it. Window = 'abc', length = 3. Update max to 3. This is our best so far!",
        code: "char_index['c'] = 2\nmax_length = 3",
        duration: 4,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "string-display", text: "abcabcbb", position: [0, 1, 0], highlightRange: [0, 2], glowColor: "#FFD700" },
            { type: "pointer", label: "L", position: [-7, 2.5, 0], color: "#ef4444", targetIndex: 0 },
            { type: "pointer", label: "R", position: [-3, 3, 0], color: "#22c55e", targetIndex: 2 },
            { type: "hashmap-container", position: [0, -2, 0], contents: [{ key: "a", value: 0 }, { key: "b", value: 1 }, { key: "c", value: 2 }] },
            { type: "variable-display", name: "maxLength", value: 3, position: [4, -2, 0], glow: true, color: "#FFD700" },
            { type: "text-3d", text: "Best: 'abc' ✓", position: [0, 3.5, 0], color: "#22c55e", size: 0.4 },
          ],
        },
      },
      {
        frameNumber: 6,
        title: "Index 3: 'a' - Duplicate!",
        explanation: "Character 'a' again! It's at index 0 in our map. Move left to index 0+1=1. Update 'a' to index 3. Window = 'bca', length = 3.",
        code: "# 'a' seen at 0, in window\nleft = 0 + 1 = 1\nchar_index['a'] = 3",
        duration: 4,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "string-display", text: "abcabcbb", position: [0, 1, 0], highlightRange: [1, 3] },
            { type: "pointer", label: "L", position: [-5, 2.5, 0], color: "#ef4444", targetIndex: 1, animation: "move-from", from: 0 },
            { type: "pointer", label: "R", position: [-1, 3, 0], color: "#22c55e", targetIndex: 3 },
            { type: "hashmap-container", position: [0, -2, 0], contents: [{ key: "a", value: 3, updated: true }, { key: "b", value: 1 }, { key: "c", value: 2 }] },
            { type: "text-3d", text: "Duplicate! Shrink window", position: [0, 3.5, 0], color: "#f59e0b", size: 0.4 },
          ],
        },
      },
      {
        frameNumber: 7,
        title: "Index 4: 'b' - Duplicate!",
        explanation: "Character 'b' again! It's at index 1. Move left to 1+1=2. Update 'b' to index 4. Window = 'cab', length = 3.",
        code: "# 'b' seen at 1, in window\nleft = 1 + 1 = 2\nchar_index['b'] = 4",
        duration: 4,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "string-display", text: "abcabcbb", position: [0, 1, 0], highlightRange: [2, 4] },
            { type: "pointer", label: "L", position: [-3, 2.5, 0], color: "#ef4444", targetIndex: 2, animation: "move-from", from: 1 },
            { type: "pointer", label: "R", position: [1, 3, 0], color: "#22c55e", targetIndex: 4 },
            { type: "hashmap-container", position: [0, -2, 0], contents: [{ key: "a", value: 3 }, { key: "b", value: 4, updated: true }, { key: "c", value: 2 }] },
          ],
        },
      },
      {
        frameNumber: 8,
        title: "Index 5: 'c' - Duplicate!",
        explanation: "Character 'c' again! It's at index 2. Move left to 2+1=3. Update 'c' to index 5. Window = 'abc', length = 3.",
        code: "# 'c' seen at 2, in window\nleft = 2 + 1 = 3\nchar_index['c'] = 5",
        duration: 4,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "string-display", text: "abcabcbb", position: [0, 1, 0], highlightRange: [3, 5] },
            { type: "pointer", label: "L", position: [-1, 2.5, 0], color: "#ef4444", targetIndex: 3, animation: "move-from", from: 2 },
            { type: "pointer", label: "R", position: [3, 3, 0], color: "#22c55e", targetIndex: 5 },
            { type: "hashmap-container", position: [0, -2, 0], contents: [{ key: "a", value: 3 }, { key: "b", value: 4 }, { key: "c", value: 5, updated: true }] },
          ],
        },
      },
      {
        frameNumber: 9,
        title: "Remaining: 'bb'",
        explanation: "Indices 6,7 are both 'b'. We keep shrinking. Final window can't beat our max of 3. Answer: 3!",
        code: "# Continue process...\n# max_length remains 3",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 16], animation: "zoom-out" },
          objects: [
            { type: "string-display", text: "abcabcbb", position: [0, 1, 0] },
            { type: "highlight-best-substring", text: "abc", position: [0, -1, 0], color: "#22c55e", glow: true },
            { type: "result-display", position: [0, -3, 0], value: "3", color: "#22c55e", size: 2 },
          ],
          particles: { type: "success-burst", position: [0, 0, 0], count: 150, color: "#22c55e" },
        },
      },
      {
        frameNumber: 10,
        title: "Solution Complete!",
        explanation: "Sliding window with hash map found the answer in one pass! O(n) time, O(min(m,n)) space. Efficient and elegant!",
        code: "// Time: O(n)\n// Space: O(min(m,n))\n// Perfect! ⚡",
        duration: 4,
        scene3D: {
          camera: { position: [0, 6, 18] },
          objects: [
            { type: "string-display", text: "abcabcbb", position: [0, 2, 0] },
            { type: "best-substring-visual", text: "abc", position: [0, 0, 0], glowing: true },
            { type: "complexity-card", position: [0, -2, 0], data: { time: "O(n)", space: "O(min(m,n))" } },
            { type: "text-3d", text: "SOLVED! 🎉", position: [0, 4, 0], color: "#22c55e", size: 1 },
          ],
          particles: { type: "fireworks", position: [0, 5, 0], count: 300 },
        },
      },
    ],
  },

  complexity: { time: "O(n)", space: "O(min(m,n))", explanation: "Single pass through string with hash map storing at most min(n, m) characters where n is string length and m is charset size." },
};

export const seedLongestSubstring = async () => {
  try {
    const existing = await Problem.findOne({ problemId: "longest-substring-without-repeating-characters" });
    if (existing) {
      console.log("✅ Longest Substring problem already exists");
      return existing;
    }
    const problem = await Problem.create(longestSubstringProblem);
    console.log("✅ Longest Substring problem seeded successfully!");
    console.log(`   - ${problem.algorithmTutorial.frames.length} tutorial frames`);
    console.log(`   - ${problem.problemSolution.frames.length} solution frames`);
    console.log(`   - Solutions in ${Object.keys(problem.solutions || {}).length} languages`);
    return problem;
  } catch (error) {
    console.error("❌ Error seeding Longest Substring problem:", error);
    throw error;
  }
};

export default seedLongestSubstring;