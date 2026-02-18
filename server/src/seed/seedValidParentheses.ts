import Problem from "../models/Problem";

// ========================================
// SEED DATA: VALID PARENTHESES PROBLEM
// ========================================

export const validParenthesesProblem = {
  problemId: "valid-parentheses",
  title: "Valid Parentheses",
  difficulty: "Easy",
  tags: ["String", "Stack"],
  description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
  
  examples: [
    {
      input: 's = "()"',
      output: "true",
      explanation: "The string contains a valid pair of parentheses.",
    },
    {
      input: 's = "()[]{}"',
      output: "true",
      explanation: "All brackets are properly matched and closed in order.",
    },
    {
      input: 's = "(]"',
      output: "false",
      explanation: "The opening '(' is closed by ']', which is the wrong type.",
    },
    {
      input: 's = "([)]"',
      output: "false",
      explanation: "The brackets are not closed in the correct order.",
    },
  ],

  algorithmsRequired: ["stack"],

  solutions: {
    "Python": `class Solution:
    def isValid(self, s: str) -> bool:
        """
        Check if parentheses are valid using a stack.
        
        Time Complexity: O(n)
        Space Complexity: O(n)
        """
        # Stack to keep track of opening brackets
        stack = []
        
        # Mapping of closing to opening brackets
        pairs = {
            ')': '(',
            '}': '{',
            ']': '['
        }
        
        for char in s:
            if char in pairs:
                # Closing bracket
                # Check if stack is empty or top doesn't match
                if not stack or stack[-1] != pairs[char]:
                    return False
                stack.pop()
            else:
                # Opening bracket - push to stack
                stack.append(char)
        
        # Valid if stack is empty (all brackets matched)
        return len(stack) == 0`,

    "C++": `class Solution {
public:
    bool isValid(string s) {
        /*
         * Check if parentheses are valid using a stack.
         * 
         * Time Complexity: O(n)
         * Space Complexity: O(n)
         */
        stack<char> st;
        unordered_map<char, char> pairs = {
            {')', '('},
            {'}', '{'},
            {']', '['}
        };
        
        for (char c : s) {
            if (pairs.count(c)) {
                // Closing bracket
                if (st.empty() || st.top() != pairs[c]) {
                    return false;
                }
                st.pop();
            } else {
                // Opening bracket
                st.push(c);
            }
        }
        
        // Valid if stack is empty
        return st.empty();
    }
};`,

    "Java": `class Solution {
    /**
     * Check if parentheses are valid using a stack.
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     */
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        Map<Character, Character> pairs = new HashMap<>();
        pairs.put(')', '(');
        pairs.put('}', '{');
        pairs.put(']', '[');
        
        for (char c : s.toCharArray()) {
            if (pairs.containsKey(c)) {
                // Closing bracket
                if (stack.isEmpty() || stack.peek() != pairs.get(c)) {
                    return false;
                }
                stack.pop();
            } else {
                // Opening bracket
                stack.push(c);
            }
        }
        
        // Valid if stack is empty
        return stack.isEmpty();
    }
}`,

    "JavaScript": `/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    /*
     * Check if parentheses are valid using a stack.
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     */
    const stack = [];
    const pairs = {
        ')': '(',
        '}': '{',
        ']': '['
    };
    
    for (let char of s) {
        if (char in pairs) {
            // Closing bracket
            if (stack.length === 0 || stack[stack.length - 1] !== pairs[char]) {
                return false;
            }
            stack.pop();
        } else {
            // Opening bracket
            stack.push(char);
        }
    }
    
    // Valid if stack is empty
    return stack.length === 0;
};`,

    "Go": `func isValid(s string) bool {
    /*
     * Check if parentheses are valid using a stack.
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     */
    stack := []rune{}
    pairs := map[rune]rune{
        ')': '(',
        '}': '{',
        ']': '[',
    }
    
    for _, char := range s {
        if opening, isClosing := pairs[char]; isClosing {
            // Closing bracket
            if len(stack) == 0 || stack[len(stack)-1] != opening {
                return false
            }
            stack = stack[:len(stack)-1]
        } else {
            // Opening bracket
            stack = append(stack, char)
        }
    }
    
    // Valid if stack is empty
    return len(stack) == 0
}`,
  },

  algorithmTutorial: {
    algorithmId: "stack",
    algorithmName: "Stack Data Structure",
    description: "A Last-In-First-Out (LIFO) data structure perfect for matching pairs and tracking nested elements",
    
    frames: [
      {
        frameNumber: 1,
        title: "What is a Stack?",
        explanation: "A stack is like a stack of plates - you can only add (push) or remove (pop) from the top. Last thing in is the first thing out (LIFO)!",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 15], lookAt: [0, 0, 0] },
          objects: [
            { type: "stack-container", position: [0, 0, 0], size: [4, 6, 4], color: "#3b82f6", opacity: 0.2 },
            { type: "stack-items", items: ["Plate 1", "Plate 2", "Plate 3"], position: [0, 0, 0], animation: "stack-up" },
            { type: "text-3d", text: "STACK (LIFO)", position: [0, 4, 0], color: "#ffffff", size: 0.6 },
          ],
        },
      },
      {
        frameNumber: 2,
        title: "Stack Operations",
        explanation: "Push adds an item to the top. Pop removes the top item. Peek looks at the top without removing it. All operations are O(1) - super fast!",
        duration: 5,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "stack-demo", operations: ["push(A)", "push(B)", "pop()", "peek()"], animated: true },
            { type: "operation-labels", position: [5, 0, 0], labels: ["Push: O(1)", "Pop: O(1)", "Peek: O(1)"] },
          ],
        },
      },
      {
        frameNumber: 3,
        title: "Perfect for Matching!",
        explanation: "Stacks are PERFECT for matching pairs (like parentheses) because they remember the most recent opening bracket, which should match the next closing bracket!",
        duration: 5,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "bracket-demo", string: "( [ { } ] )", position: [0, 2, 0], animated: true },
            { type: "stack-visualization", position: [0, -2, 0], tracking: true },
            { type: "text-3d", text: "Last Opened = First Closed", position: [0, 4, 0], color: "#22c55e", size: 0.4 },
          ],
        },
      },
      {
        frameNumber: 4,
        title: "The Algorithm",
        explanation: "For each character: if it's an opening bracket, push it. If it's a closing bracket, check if it matches the top of the stack, then pop!",
        duration: 5,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "flowchart", steps: ["Opening?→Push", "Closing?→Check&Pop"], position: [0, 0, 0] },
            { type: "code-snippet", code: "if opening: stack.push()", position: [0, -3, 0] },
          ],
        },
      },
      {
        frameNumber: 5,
        title: "Valid = Empty Stack!",
        explanation: "If all brackets match correctly, the stack will be empty at the end. If there's anything left, or if we try to pop from an empty stack, it's invalid!",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "empty-stack", position: [0, 0, 0], glow: true },
            { type: "checkmark-icon", position: [0, 0, 0], size: 3, color: "#22c55e", animation: "pop-in" },
            { type: "text-3d", text: "VALID! ✓", position: [0, 4, 0], color: "#22c55e", size: 0.8 },
          ],
          particles: { type: "confetti", position: [0, 5, 0], count: 200 },
        },
      },
    ],
  },

  problemSolution: {
    testCase: {
      input: { s: "([{}])" },
      expectedOutput: true,
    },
    
    frames: [
      {
        frameNumber: 1,
        title: "Problem Setup",
        explanation: "We need to check if the string '([{}])' has valid, properly nested brackets.",
        code: 's = "([{}])"',
        duration: 3,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "string-display", text: "([{}])", position: [0, 2, 0], animation: "type-in" },
            { type: "stack-container", position: [0, -2, 0], empty: true },
          ],
        },
      },
      {
        frameNumber: 2,
        title: "Character 1: '('",
        explanation: "It's an opening bracket! Push it onto the stack.",
        code: "stack.push('(')",
        duration: 3,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "string-display", text: "([{}])", position: [0, 3, 0], highlightIndex: 0 },
            { type: "stack-visualization", items: ["("], position: [0, -1, 0], topGlow: true },
            { type: "arrow-pointing", from: [0, 3, 0], to: [0, -1, 0], animated: true },
          ],
        },
      },
      {
        frameNumber: 3,
        title: "Character 2: '['",
        explanation: "Another opening bracket! Push it onto the stack.",
        code: "stack.push('[')",
        duration: 3,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "string-display", text: "([{}])", position: [0, 3, 0], highlightIndex: 1 },
            { type: "stack-visualization", items: ["(", "["], position: [0, -1, 0], topGlow: true },
          ],
        },
      },
      {
        frameNumber: 4,
        title: "Character 3: '{'",
        explanation: "Opening bracket! Push it.",
        code: "stack.push('{')",
        duration: 3,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "string-display", text: "([{}])", position: [0, 3, 0], highlightIndex: 2 },
            { type: "stack-visualization", items: ["(", "[", "{"], position: [0, -1, 0], topGlow: true },
          ],
        },
      },
      {
        frameNumber: 5,
        title: "Character 4: '}'",
        explanation: "Closing bracket! Check if it matches the top of stack ('{')? YES! Pop the stack.",
        code: "if stack.top() == '{': stack.pop() ✓",
        duration: 4,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "string-display", text: "([{}])", position: [0, 3, 0], highlightIndex: 3 },
            { type: "stack-visualization", items: ["(", "["], position: [0, -1, 0], poppedItem: "{", match: true },
            { type: "match-indicator", show: true, color: "#22c55e" },
          ],
        },
      },
      {
        frameNumber: 6,
        title: "Character 5: ']'",
        explanation: "Closing bracket! Check if it matches the top of stack ('[')? YES! Pop the stack.",
        code: "if stack.top() == '[': stack.pop() ✓",
        duration: 4,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "string-display", text: "([{}])", position: [0, 3, 0], highlightIndex: 4 },
            { type: "stack-visualization", items: ["("], position: [0, -1, 0], poppedItem: "[", match: true },
            { type: "match-indicator", show: true, color: "#22c55e" },
          ],
        },
      },
      {
        frameNumber: 7,
        title: "Character 6: ')'",
        explanation: "Closing bracket! Check if it matches the top of stack ('(')? YES! Pop the stack.",
        code: "if stack.top() == '(': stack.pop() ✓",
        duration: 4,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "string-display", text: "([{}])", position: [0, 3, 0], highlightIndex: 5 },
            { type: "stack-visualization", items: [], position: [0, -1, 0], poppedItem: "(", match: true },
            { type: "match-indicator", show: true, color: "#22c55e" },
          ],
        },
      },
      {
        frameNumber: 8,
        title: "Stack is Empty!",
        explanation: "We've processed all characters and the stack is empty. This means all brackets were properly matched!",
        code: "return stack.isEmpty()  # True ✓",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 16], animation: "zoom-out" },
          objects: [
            { type: "string-display", text: "([{}])", position: [0, 2, 0], allMatched: true },
            { type: "empty-stack", position: [0, -1, 0], glow: true },
            { type: "result-display", position: [0, -3, 0], value: "true", color: "#22c55e", size: 2 },
            { type: "text-3d", text: "VALID! ✓", position: [0, 4, 0], color: "#22c55e", size: 1 },
          ],
          particles: { type: "success-burst", position: [0, 0, 0], count: 200, color: "#22c55e" },
        },
      },
      {
        frameNumber: 9,
        title: "Invalid Example",
        explanation: "What if we had '([)]'? When we reach ']', the top is '(' not '[' - mismatch! Return false immediately.",
        code: '// "([)]" → False\n// ] does not match (',
        duration: 4,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "string-display", text: "([)]", position: [0, 2, 0], highlightIndex: 2, error: true },
            { type: "stack-visualization", items: ["(", "["], position: [0, -1, 0], mismatch: true },
            { type: "text-3d", text: "MISMATCH! ✗", position: [0, -3, 0], color: "#ef4444", size: 0.6 },
          ],
        },
      },
      {
        frameNumber: 10,
        title: "Solution Complete!",
        explanation: "Stack makes this elegant! Time: O(n), Space: O(n). Perfect for matching nested structures!",
        code: "// Time: O(n)\n// Space: O(n)\n// Simple & Efficient!",
        duration: 4,
        scene3D: {
          camera: { position: [0, 6, 18] },
          objects: [
            { type: "complexity-card", position: [0, 0, 0], data: { time: "O(n)", space: "O(n)" }, color: "#3b82f6" },
            { type: "text-3d", text: "SOLVED! 🎉", position: [0, 3, 0], color: "#22c55e", size: 1 },
          ],
          particles: { type: "fireworks", position: [0, 5, 0], count: 300 },
        },
      },
    ],
  },

  complexity: {
    time: "O(n)",
    space: "O(n)",
    explanation: "We iterate through the string once (O(n)), and in the worst case, the stack holds all opening brackets (O(n) space).",
  },
};

export const seedValidParentheses = async () => {
  try {
    const existing = await Problem.findOne({ problemId: "valid-parentheses" });
    if (existing) {
      console.log("✅ Valid Parentheses problem already exists");
      return existing;
    }

    const problem = await Problem.create(validParenthesesProblem);
    console.log("✅ Valid Parentheses problem seeded successfully!");
    console.log(`   - ${problem.algorithmTutorial.frames.length} tutorial frames`);
    console.log(`   - ${problem.problemSolution.frames.length} solution frames`);
    console.log(`   - Solutions in ${Object.keys(problem.solutions || {}).length} languages`);
    
    return problem;
  } catch (error) {
    console.error("❌ Error seeding Valid Parentheses problem:", error);
    throw error;
  }
};

export default seedValidParentheses;