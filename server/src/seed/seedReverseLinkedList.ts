import Problem from "../models/Problem";

// ========================================
// SEED DATA: REVERSE LINKED LIST PROBLEM
// Complete with Algorithm Tutorial + Problem Solution
// ========================================

export const reverseLinkedListProblem = {
  problemId: "reverse-linked-list",
  title: "Reverse Linked List",
  difficulty: "Easy",
  tags: ["Linked List", "Recursion", "Two Pointers"],
  description: `Given the head of a singly linked list, reverse the list, and return the reversed list.

A linked list can be reversed either iteratively or recursively. Could you implement both?`,
  
  examples: [
    {
      input: "head = [1,2,3,4,5]",
      output: "[5,4,3,2,1]",
      explanation: "The linked list is reversed from 1→2→3→4→5 to 5→4→3→2→1.",
    },
    {
      input: "head = [1,2]",
      output: "[2,1]",
      explanation: "The linked list is reversed from 1→2 to 2→1.",
    },
    {
      input: "head = []",
      output: "[]",
      explanation: "An empty list remains empty.",
    },
  ],

  algorithmsRequired: ["linked-list-reversal"],

  // ========================================
  // CODE SOLUTIONS IN MULTIPLE LANGUAGES
  // ========================================
  solutions: {
    "Python": `class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        """
        Iteratively reverse a linked list using three pointers.
        
        Time Complexity: O(n)
        Space Complexity: O(1)
        """
        prev = None
        current = head
        
        while current:
            # Store next node
            next_node = current.next
            
            # Reverse the link
            current.next = prev
            
            # Move pointers forward
            prev = current
            current = next_node
        
        return prev
    
    # Recursive approach
    def reverseListRecursive(self, head: Optional[ListNode]) -> Optional[ListNode]:
        """
        Recursively reverse a linked list.
        
        Time Complexity: O(n)
        Space Complexity: O(n) - due to recursion stack
        """
        # Base case
        if not head or not head.next:
            return head
        
        # Reverse the rest
        new_head = self.reverseListRecursive(head.next)
        
        # Reverse current node
        head.next.next = head
        head.next = None
        
        return new_head`,

    "C++": `class Solution {
public:
    // Iterative approach
    ListNode* reverseList(ListNode* head) {
        /*
         * Iteratively reverse a linked list using three pointers.
         * 
         * Time Complexity: O(n)
         * Space Complexity: O(1)
         */
        ListNode* prev = nullptr;
        ListNode* current = head;
        
        while (current != nullptr) {
            // Store next node
            ListNode* nextNode = current->next;
            
            // Reverse the link
            current->next = prev;
            
            // Move pointers forward
            prev = current;
            current = nextNode;
        }
        
        return prev;
    }
    
    // Recursive approach
    ListNode* reverseListRecursive(ListNode* head) {
        /*
         * Recursively reverse a linked list.
         * 
         * Time Complexity: O(n)
         * Space Complexity: O(n)
         */
        // Base case
        if (head == nullptr || head->next == nullptr) {
            return head;
        }
        
        // Reverse the rest
        ListNode* newHead = reverseListRecursive(head->next);
        
        // Reverse current node
        head->next->next = head;
        head->next = nullptr;
        
        return newHead;
    }
};`,

    "Java": `class Solution {
    /**
     * Iteratively reverse a linked list using three pointers.
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode current = head;
        
        while (current != null) {
            // Store next node
            ListNode nextNode = current.next;
            
            // Reverse the link
            current.next = prev;
            
            // Move pointers forward
            prev = current;
            current = nextNode;
        }
        
        return prev;
    }
    
    /**
     * Recursively reverse a linked list.
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     */
    public ListNode reverseListRecursive(ListNode head) {
        // Base case
        if (head == null || head.next == null) {
            return head;
        }
        
        // Reverse the rest
        ListNode newHead = reverseListRecursive(head.next);
        
        // Reverse current node
        head.next.next = head;
        head.next = null;
        
        return newHead;
    }
}`,

    "JavaScript": `/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
    /*
     * Iteratively reverse a linked list using three pointers.
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    let prev = null;
    let current = head;
    
    while (current !== null) {
        // Store next node
        const nextNode = current.next;
        
        // Reverse the link
        current.next = prev;
        
        // Move pointers forward
        prev = current;
        current = nextNode;
    }
    
    return prev;
};

/**
 * Recursive approach
 */
var reverseListRecursive = function(head) {
    /*
     * Recursively reverse a linked list.
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     */
    // Base case
    if (head === null || head.next === null) {
        return head;
    }
    
    // Reverse the rest
    const newHead = reverseListRecursive(head.next);
    
    // Reverse current node
    head.next.next = head;
    head.next = null;
    
    return newHead;
};`,

    "Go": `// Iterative approach
func reverseList(head *ListNode) *ListNode {
    /*
     * Iteratively reverse a linked list using three pointers.
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    var prev *ListNode = nil
    current := head
    
    for current != nil {
        // Store next node
        nextNode := current.Next
        
        // Reverse the link
        current.Next = prev
        
        // Move pointers forward
        prev = current
        current = nextNode
    }
    
    return prev
}

// Recursive approach
func reverseListRecursive(head *ListNode) *ListNode {
    /*
     * Recursively reverse a linked list.
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     */
    // Base case
    if head == nil || head.Next == nil {
        return head
    }
    
    // Reverse the rest
    newHead := reverseListRecursive(head.Next)
    
    // Reverse current node
    head.Next.Next = head
    head.Next = nil
    
    return newHead
}`,
  },

  // ========================================
  // ALGORITHM TUTORIAL
  // ========================================
  algorithmTutorial: {
    algorithmId: "linked-list-reversal",
    algorithmName: "Linked List Reversal",
    description: "A technique to reverse the direction of pointers in a linked list using iteration or recursion",
    
    frames: [
      {
        frameNumber: 1,
        title: "What is a Linked List?",
        explanation: "A linked list is a data structure where each node contains data and a pointer to the next node. Unlike arrays, nodes are not stored contiguously in memory.",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 15], lookAt: [0, 0, 0] },
          objects: [
            { type: "linked-list-chain", nodes: [1, 2, 3, 4], position: [0, 0, 0], animation: "appear" },
            { type: "text-3d", text: "LINKED LIST", position: [0, 4, 0], color: "#3b82f6", size: 0.6 },
          ],
          lights: [
            { type: "ambient", intensity: 0.5 },
            { type: "point", position: [10, 10, 10], intensity: 1 },
          ],
        },
      },
      {
        frameNumber: 2,
        title: "The Reversal Challenge",
        explanation: "To reverse a linked list, we need to flip all the arrows (pointers) to point backwards instead of forwards.",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "linked-list-chain", nodes: [1, 2, 3, 4], position: [0, 1, 0], arrows: "forward" },
            { type: "linked-list-chain", nodes: [4, 3, 2, 1], position: [0, -2, 0], arrows: "backward", opacity: 0.5 },
            { type: "arrow-curved", from: [0, 1, 0], to: [0, -2, 0], animated: true },
          ],
        },
      },
      {
        frameNumber: 3,
        title: "Three Pointer Technique",
        explanation: "We use three pointers: 'prev' (starts at null), 'current' (starts at head), and 'next' (to temporarily store the next node).",
        duration: 5,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "linked-list-chain", nodes: [1, 2, 3, 4], position: [0, 0, 0] },
            { type: "pointer", label: "prev", position: [-4, 2, 0], color: "#ef4444", targetNode: null },
            { type: "pointer", label: "current", position: [0, 2, 0], color: "#22c55e", targetNode: 0 },
            { type: "pointer", label: "next", position: [4, 2, 0], color: "#3b82f6", targetNode: 1, opacity: 0.5 },
          ],
        },
      },
      {
        frameNumber: 4,
        title: "The Reversal Process",
        explanation: "At each step: 1) Save next node, 2) Reverse current's pointer, 3) Move prev and current forward. Repeat until current is null!",
        duration: 5,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "linked-list-animated-reversal", nodes: [1, 2, 3, 4], step: 2 },
            { type: "code-highlight", code: "current.next = prev", position: [0, -3, 0] },
          ],
          particles: { type: "pointer-trail", count: 50, color: "#22c55e" },
        },
      },
      {
        frameNumber: 5,
        title: "Complete!",
        explanation: "When current reaches null, prev points to the new head of the reversed list. Time: O(n), Space: O(1) - super efficient!",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "linked-list-chain", nodes: [4, 3, 2, 1], position: [0, 0, 0], arrows: "backward", glow: true },
            { type: "text-3d", text: "REVERSED! ✓", position: [0, 4, 0], color: "#22c55e", size: 0.8, animation: "celebrate" },
            { type: "checkmark-icon", position: [0, -3, 0], size: 2, color: "#22c55e" },
          ],
          particles: { type: "confetti", position: [0, 5, 0], count: 200 },
        },
      },
    ],
  },

  // ========================================
  // PROBLEM SOLUTION
  // ========================================
  problemSolution: {
    testCase: {
      input: { head: [1, 2, 3, 4] },
      expectedOutput: [4, 3, 2, 1],
    },
    
    frames: [
      {
        frameNumber: 1,
        title: "Problem Setup",
        explanation: "We need to reverse the linked list [1→2→3→4] to become [4→3→2→1].",
        code: "// Input: 1 -> 2 -> 3 -> 4\n// Output: 4 -> 3 -> 2 -> 1",
        duration: 3,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "linked-list-chain", nodes: [1, 2, 3, 4], position: [0, 0, 0], animation: "fly-in" },
          ],
        },
      },
      {
        frameNumber: 2,
        title: "Initialize Pointers",
        explanation: "Set prev = null, current = head. These will help us reverse the pointers one by one.",
        code: "prev = None\ncurrent = head",
        duration: 3,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "linked-list-chain", nodes: [1, 2, 3, 4], position: [0, 0, 0] },
            { type: "pointer", label: "prev = null", position: [-6, 2.5, 0], color: "#ef4444" },
            { type: "pointer", label: "current", position: [-3, 2.5, 0], color: "#22c55e", targetNode: 0 },
          ],
        },
      },
      {
        frameNumber: 3,
        title: "Step 1: Node 1",
        explanation: "Save next (node 2), reverse 1's pointer to null, move pointers forward.",
        code: "next_node = current.next  # 2\ncurrent.next = prev      # None\nprev = current\ncurrent = next_node",
        duration: 4,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "linked-list-chain", nodes: [1, 2, 3, 4], position: [0, 0, 0], reversedUntil: 0 },
            { type: "pointer", label: "prev", position: [-3, 2.5, 0], color: "#ef4444", targetNode: 0 },
            { type: "pointer", label: "current", position: [0, 2.5, 0], color: "#22c55e", targetNode: 1 },
            { type: "highlight-arrow", from: 0, to: "null", color: "#22c55e", animated: true },
          ],
        },
      },
      {
        frameNumber: 4,
        title: "Step 2: Node 2",
        explanation: "Save next (node 3), reverse 2's pointer to node 1, move pointers forward.",
        code: "next_node = current.next  # 3\ncurrent.next = prev      # 1\nprev = current\ncurrent = next_node",
        duration: 4,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "linked-list-chain", nodes: [1, 2, 3, 4], position: [0, 0, 0], reversedUntil: 1 },
            { type: "pointer", label: "prev", position: [0, 2.5, 0], color: "#ef4444", targetNode: 1 },
            { type: "pointer", label: "current", position: [3, 2.5, 0], color: "#22c55e", targetNode: 2 },
          ],
        },
      },
      {
        frameNumber: 5,
        title: "Step 3: Node 3",
        explanation: "Save next (node 4), reverse 3's pointer to node 2, move pointers forward.",
        code: "next_node = current.next  # 4\ncurrent.next = prev      # 2\nprev = current\ncurrent = next_node",
        duration: 4,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "linked-list-chain", nodes: [1, 2, 3, 4], position: [0, 0, 0], reversedUntil: 2 },
            { type: "pointer", label: "prev", position: [3, 2.5, 0], color: "#ef4444", targetNode: 2 },
            { type: "pointer", label: "current", position: [6, 2.5, 0], color: "#22c55e", targetNode: 3 },
          ],
        },
      },
      {
        frameNumber: 6,
        title: "Step 4: Node 4",
        explanation: "Save next (null), reverse 4's pointer to node 3, move pointers forward.",
        code: "next_node = current.next  # None\ncurrent.next = prev      # 3\nprev = current\ncurrent = next_node",
        duration: 4,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "linked-list-chain", nodes: [1, 2, 3, 4], position: [0, 0, 0], reversedUntil: 3 },
            { type: "pointer", label: "prev", position: [6, 2.5, 0], color: "#ef4444", targetNode: 3 },
            { type: "pointer", label: "current = null", position: [9, 2.5, 0], color: "#22c55e" },
          ],
        },
      },
      {
        frameNumber: 7,
        title: "Complete!",
        explanation: "Current is null, so we're done! Prev now points to the new head (node 4).",
        code: "return prev  # Node 4 (new head)",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 16], animation: "zoom-out" },
          objects: [
            { type: "linked-list-chain", nodes: [4, 3, 2, 1], position: [0, 0, 0], arrows: "backward", glow: true },
            { type: "pointer", label: "new head", position: [6, 2.5, 0], color: "#FFD700", targetNode: 0 },
            { type: "text-3d", text: "REVERSED! ✓", position: [0, 4, 0], color: "#22c55e", size: 0.8 },
          ],
          particles: { type: "success-burst", position: [0, 0, 0], count: 150, color: "#22c55e" },
        },
      },
      {
        frameNumber: 8,
        title: "Final Result",
        explanation: "The list is now completely reversed: 4→3→2→1. All pointers have been flipped!",
        code: "// Original: 1 -> 2 -> 3 -> 4\n// Reversed: 4 -> 3 -> 2 -> 1 ✓",
        duration: 4,
        scene3D: {
          camera: { position: [0, 6, 18] },
          objects: [
            { type: "linked-list-chain", nodes: [4, 3, 2, 1], position: [0, 1, 0], arrows: "backward", glowing: true },
            { type: "result-display", position: [0, -2, 0], title: "OUTPUT", value: "[4,3,2,1]", color: "#FFD700", size: 1.5 },
            { type: "complexity-card", position: [0, -4, 0], data: { time: "O(n)", space: "O(1)" } },
          ],
          particles: { type: "confetti", position: [0, 5, 0], count: 200 },
        },
      },
    ],
  },

  complexity: {
    time: "O(n)",
    space: "O(1)",
    explanation: "We traverse the list once (O(n) time), and only use a constant amount of extra space for three pointers (O(1) space).",
  },
};

export const seedReverseLinkedList = async () => {
  try {
    const existing = await Problem.findOne({ problemId: "reverse-linked-list" });
    if (existing) {
      console.log("✅ Reverse Linked List problem already exists");
      return existing;
    }

    const problem = await Problem.create(reverseLinkedListProblem);
    console.log("✅ Reverse Linked List problem seeded successfully!");
    console.log(`   - ${problem.algorithmTutorial.frames.length} tutorial frames`);
    console.log(`   - ${problem.problemSolution.frames.length} solution frames`);
    console.log(`   - Solutions in ${Object.keys(problem.solutions || {}).length} languages`);
    
    return problem;
  } catch (error) {
    console.error("❌ Error seeding Reverse Linked List problem:", error);
    throw error;
  }
};

export default seedReverseLinkedList;