import Problem from "../models/Problem";

export const invertBinaryTreeProblem = {
  problemId: "invert-binary-tree",
  title: "Invert Binary Tree",
  difficulty: "Easy",
  tags: ["Binary Tree", "Depth-First Search", "Recursion"],
  description: `Given the root of a binary tree, invert the tree, and return its root.

Inverting a binary tree means swapping the left and right children of every node.`,
  
  examples: [
    { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]", explanation: "The tree is inverted - all left and right children are swapped." },
    { input: "root = [2,1,3]", output: "[2,3,1]", explanation: "Swap left child (1) with right child (3)." },
    { input: "root = []", output: "[]", explanation: "Empty tree remains empty." },
  ],

  algorithmsRequired: ["binary-tree-dfs"],

  solutions: {
    "Python": `class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        """
        Recursively invert binary tree by swapping children.
        
        Time Complexity: O(n)
        Space Complexity: O(h) where h is tree height
        """
        # Base case: empty tree
        if not root:
            return None
        
        # Swap left and right children
        root.left, root.right = root.right, root.left
        
        # Recursively invert subtrees
        self.invertTree(root.left)
        self.invertTree(root.right)
        
        return root`,

    "C++": `class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        // Base case
        if (root == nullptr) {
            return nullptr;
        }
        
        // Swap children
        TreeNode* temp = root->left;
        root->left = root->right;
        root->right = temp;
        
        // Recursively invert subtrees
        invertTree(root->left);
        invertTree(root->right);
        
        return root;
    }
};`,

    "Java": `class Solution {
    public TreeNode invertTree(TreeNode root) {
        // Base case
        if (root == null) {
            return null;
        }
        
        // Swap children
        TreeNode temp = root.left;
        root.left = root.right;
        root.right = temp;
        
        // Recursively invert subtrees
        invertTree(root.left);
        invertTree(root.right);
        
        return root;
    }
}`,

    "JavaScript": `var invertTree = function(root) {
    // Base case
    if (root === null) {
        return null;
    }
    
    // Swap children
    [root.left, root.right] = [root.right, root.left];
    
    // Recursively invert subtrees
    invertTree(root.left);
    invertTree(root.right);
    
    return root;
};`,

    "Go": `func invertTree(root *TreeNode) *TreeNode {
    // Base case
    if root == nil {
        return nil
    }
    
    // Swap children
    root.Left, root.Right = root.Right, root.Left
    
    // Recursively invert subtrees
    invertTree(root.Left)
    invertTree(root.Right)
    
    return root
}`,
  },

  algorithmTutorial: {
    algorithmId: "binary-tree-dfs",
    algorithmName: "Binary Tree DFS (Depth-First Search)",
    description: "Traverse a tree by exploring as deep as possible before backtracking, perfect for tree transformations",
    
    frames: [
      {
        frameNumber: 1,
        title: "What is a Binary Tree?",
        explanation: "A binary tree is a hierarchical structure where each node has at most TWO children: a left child and a right child. It's like a family tree!",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 15], lookAt: [0, 0, 0] },
          objects: [
            { type: "binary-tree-structure", 
              nodes: [
                { value: 4, position: [0, 2, 0] },
                { value: 2, position: [-3, 0, 0] },
                { value: 7, position: [3, 0, 0] },
                { value: 1, position: [-4, -2, 0] },
                { value: 3, position: [-2, -2, 0] },
                { value: 6, position: [2, -2, 0] },
                { value: 9, position: [4, -2, 0] }
              ],
              animation: "build-tree"
            },
            { type: "text-3d", text: "BINARY TREE", position: [0, 4, 0], color: "#3b82f6", size: 0.6 },
          ],
          lights: [
            { type: "ambient", intensity: 0.5 },
            { type: "point", position: [10, 10, 10], intensity: 1 },
          ],
        },
      },
      {
        frameNumber: 2,
        title: "Depth-First Search (DFS)",
        explanation: "DFS explores DOWN the tree as deep as possible before backtracking. It's like going all the way to the leaves before moving to the next branch!",
        duration: 5,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "binary-tree-structure", nodes: [4, 2, 7, 1, 3, 6, 9], position: [0, 0, 0] },
            { type: "dfs-path-animation", 
              path: [4, 2, 1, 3, 7, 6, 9],
              animated: true,
              color: "#22c55e"
            },
            { type: "text-3d", text: "Go Deep First!", position: [0, 4, 0], color: "#22c55e", size: 0.5 },
          ],
        },
      },
      {
        frameNumber: 3,
        title: "Three DFS Traversal Orders",
        explanation: "Preorder: Root→Left→Right. Inorder: Left→Root→Right. Postorder: Left→Right→Root. For inverting a tree, preorder works great!",
        duration: 5,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "traversal-comparison",
              tree: [4, 2, 7, 1, 3, 6, 9],
              preorder: [4, 2, 1, 3, 7, 6, 9],
              inorder: [1, 2, 3, 4, 6, 7, 9],
              postorder: [1, 3, 2, 6, 9, 7, 4],
              position: [0, 0, 0]
            },
            { type: "highlight-preorder", color: "#FFD700" },
          ],
        },
      },
      {
        frameNumber: 4,
        title: "Recursion: The Natural Fit",
        explanation: "DFS uses recursion perfectly! Process current node, then recursively process left subtree, then right subtree. Base case: if node is null, return null. Simple!",
        duration: 5,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "recursion-visual",
              function: "dfs(node)",
              steps: [
                "if node is null: return",
                "process(node)",
                "dfs(node.left)",
                "dfs(node.right)"
              ],
              position: [0, 0, 0]
            },
            { type: "call-stack-animation", showing: true, position: [4, 0, 0] },
          ],
        },
      },
      {
        frameNumber: 5,
        title: "Perfect for Tree Inversion!",
        explanation: "To invert: at each node, swap left and right children, then recursively invert both subtrees. DFS visits every node exactly once - O(n) time!",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 15] },
          objects: [
            { type: "inversion-demo",
              before: [4, 2, 7, 1, 3, 6, 9],
              after: [4, 7, 2, 9, 6, 3, 1],
              animated: true,
              position: [0, 0, 0]
            },
            { type: "complexity-card", data: { time: "O(n)", space: "O(h)" }, position: [0, -3, 0] },
            { type: "text-3d", text: "Optimal! ⚡", position: [0, 4, 0], color: "#22c55e", size: 0.6 },
          ],
          particles: { type: "sparkles", count: 100, color: "#3b82f6" },
        },
      },
    ],
  },

  problemSolution: {
    testCase: { input: { root: [4,2,7,1,3,6,9] }, expectedOutput: [4,7,2,9,6,3,1] },
    
    frames: [
      {
        frameNumber: 1,
        title: "Original Tree Structure",
        explanation: "We have a binary tree with root 4. Left subtree has 2(1,3), right subtree has 7(6,9). Let's invert it!",
        code: "root = [4,2,7,1,3,6,9]",
        duration: 3,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "tree-3d",
              nodes: [
                { value: 4, level: 0, position: [0, 2, 0] },
                { value: 2, level: 1, position: [-3, 0, 0], parent: 4, side: "left" },
                { value: 7, level: 1, position: [3, 0, 0], parent: 4, side: "right" },
                { value: 1, level: 2, position: [-4, -2, 0], parent: 2, side: "left" },
                { value: 3, level: 2, position: [-2, -2, 0], parent: 2, side: "right" },
                { value: 6, level: 2, position: [2, -2, 0], parent: 7, side: "left" },
                { value: 9, level: 2, position: [4, -2, 0], parent: 7, side: "right" }
              ],
              edges: true,
              animation: "appear"
            },
          ],
        },
      },
      {
        frameNumber: 2,
        title: "Root Node (4): Swap Children",
        explanation: "Start at root 4. Swap its children: left (2) ↔ right (7). Now left=7, right=2!",
        code: "# At node 4\ntemp = root.left  # 2\nroot.left = root.right  # 7\nroot.right = temp  # 2",
        duration: 4,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "node-highlight", value: 4, position: [0, 2, 0], color: "#FFD700" },
            { type: "swap-animation",
              node1: { value: 2, from: [-3, 0, 0], to: [3, 0, 0] },
              node2: { value: 7, from: [3, 0, 0], to: [-3, 0, 0] },
              animated: true,
              duration: 1.5
            },
            { type: "tree-edges-update", showing: true },
          ],
        },
      },
      {
        frameNumber: 3,
        title: "Recurse Left: Node 7",
        explanation: "Recursively process left subtree (now 7). Swap 7's children: 6 ↔ 9.",
        code: "invertTree(root.left)  # node 7\n# Swap 6 and 9",
        duration: 4,
        scene3D: {
          camera: { position: [-2, 3, 12], animation: "focus-left" },
          objects: [
            { type: "tree-3d",
              nodes: [
                { value: 4, level: 0, position: [0, 2, 0], opacity: 0.3 },
                { value: 7, level: 1, position: [-3, 0, 0], highlighted: true },
                { value: 2, level: 1, position: [3, 0, 0], opacity: 0.3 },
                { value: 6, level: 2, position: [-4, -2, 0] },
                { value: 9, level: 2, position: [-2, -2, 0] }
              ]
            },
            { type: "swap-animation",
              node1: { value: 6, from: [-4, -2, 0], to: [-2, -2, 0] },
              node2: { value: 9, from: [-2, -2, 0], to: [-4, -2, 0] },
              animated: true
            },
          ],
        },
      },
      {
        frameNumber: 4,
        title: "Left Subtree Complete",
        explanation: "Node 7's subtree is inverted! Leaves (6 and 9) have no children, so they're already inverted. Back to root!",
        code: "# Subtree rooted at 7 is inverted\n# Return to process right subtree",
        duration: 3,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "tree-3d",
              nodes: [
                { value: 4, level: 0, position: [0, 2, 0] },
                { value: 7, level: 1, position: [-3, 0, 0], checkmark: true },
                { value: 2, level: 1, position: [3, 0, 0] },
                { value: 9, level: 2, position: [-4, -2, 0] },
                { value: 6, level: 2, position: [-2, -2, 0] }
              ]
            },
          ],
        },
      },
      {
        frameNumber: 5,
        title: "Recurse Right: Node 2",
        explanation: "Recursively process right subtree (now 2). Swap 2's children: 1 ↔ 3.",
        code: "invertTree(root.right)  # node 2\n# Swap 1 and 3",
        duration: 4,
        scene3D: {
          camera: { position: [2, 3, 12], animation: "focus-right" },
          objects: [
            { type: "tree-3d",
              nodes: [
                { value: 4, level: 0, position: [0, 2, 0], opacity: 0.3 },
                { value: 7, level: 1, position: [-3, 0, 0], opacity: 0.3 },
                { value: 2, level: 1, position: [3, 0, 0], highlighted: true },
                { value: 1, level: 2, position: [2, -2, 0] },
                { value: 3, level: 2, position: [4, -2, 0] }
              ]
            },
            { type: "swap-animation",
              node1: { value: 1, from: [2, -2, 0], to: [4, -2, 0] },
              node2: { value: 3, from: [4, -2, 0], to: [2, -2, 0] },
              animated: true
            },
          ],
        },
      },
      {
        frameNumber: 6,
        title: "Right Subtree Complete",
        explanation: "Node 2's subtree is inverted! All nodes processed. Tree is fully inverted!",
        code: "# Subtree rooted at 2 is inverted\n# All done!",
        duration: 3,
        scene3D: {
          camera: { position: [0, 4, 14] },
          objects: [
            { type: "tree-3d",
              nodes: [
                { value: 4, level: 0, position: [0, 2, 0], checkmark: true },
                { value: 7, level: 1, position: [-3, 0, 0], checkmark: true },
                { value: 2, level: 1, position: [3, 0, 0], checkmark: true },
                { value: 9, level: 2, position: [-4, -2, 0] },
                { value: 6, level: 2, position: [-2, -2, 0] },
                { value: 3, level: 2, position: [2, -2, 0] },
                { value: 1, level: 2, position: [4, -2, 0] }
              ]
            },
          ],
        },
      },
      {
        frameNumber: 7,
        title: "Before & After Comparison",
        explanation: "Original: [4,2,7,1,3,6,9]. Inverted: [4,7,2,9,6,3,1]. Every left and right child has been swapped!",
        code: "// Before: [4,2,7,1,3,6,9]\n// After:  [4,7,2,9,6,3,1]",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 18], animation: "wide-view" },
          objects: [
            { type: "side-by-side-trees",
              before: [4, 2, 7, 1, 3, 6, 9],
              after: [4, 7, 2, 9, 6, 3, 1],
              position: [0, 0, 0],
              labels: ["Original", "Inverted"]
            },
            { type: "arrow", from: "before", to: "after", label: "Invert!" },
          ],
        },
      },
      {
        frameNumber: 8,
        title: "The Recursion Tree",
        explanation: "Here's how the recursion worked: process root, recurse left, recurse right. Each node swaps its children before recursing deeper!",
        code: "// Call stack visualization",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 16] },
          objects: [
            { type: "recursion-tree-visual",
              calls: [
                { node: 4, depth: 0 },
                { node: 7, depth: 1, parent: 4 },
                { node: 9, depth: 2, parent: 7 },
                { node: 6, depth: 2, parent: 7 },
                { node: 2, depth: 1, parent: 4 },
                { node: 3, depth: 2, parent: 2 },
                { node: 1, depth: 2, parent: 2 }
              ],
              animated: true,
              position: [0, 0, 0]
            },
          ],
        },
      },
      {
        frameNumber: 9,
        title: "Inverted Tree Result",
        explanation: "Tree successfully inverted! The mirrored structure shows all left/right relationships reversed.",
        code: "return root  # [4,7,2,9,6,3,1]",
        duration: 4,
        scene3D: {
          camera: { position: [0, 5, 16] },
          objects: [
            { type: "tree-3d",
              nodes: [
                { value: 4, level: 0, position: [0, 2, 0] },
                { value: 7, level: 1, position: [-3, 0, 0] },
                { value: 2, level: 1, position: [3, 0, 0] },
                { value: 9, level: 2, position: [-4, -2, 0] },
                { value: 6, level: 2, position: [-2, -2, 0] },
                { value: 3, level: 2, position: [2, -2, 0] },
                { value: 1, level: 2, position: [4, -2, 0] }
              ],
              glowing: true,
              color: "#22c55e"
            },
            { type: "result-display", position: [0, -3, 0], value: "[4,7,2,9,6,3,1]", color: "#22c55e" },
          ],
          particles: { type: "success-burst", position: [0, 0, 0], count: 150, color: "#22c55e" },
        },
      },
      {
        frameNumber: 10,
        title: "Solution Complete!",
        explanation: "DFS recursion inverted the entire tree! O(n) time to visit each node, O(h) space for recursion stack. Perfect!",
        code: "// Time: O(n)\n// Space: O(h) where h = height\n// Elegant! ⚡",
        duration: 4,
        scene3D: {
          camera: { position: [0, 6, 18] },
          objects: [
            { type: "tree-3d",
              nodes: [4, 7, 2, 9, 6, 3, 1],
              position: [0, 1, 0],
              glowing: true
            },
            { type: "complexity-card", position: [0, -2, 0], data: { time: "O(n)", space: "O(h)" } },
            { type: "text-3d", text: "SOLVED! 🎉", position: [0, 4, 0], color: "#22c55e", size: 1 },
          ],
          particles: { type: "fireworks", position: [0, 5, 0], count: 300 },
        },
      },
    ],
  },

  complexity: { time: "O(n)", space: "O(h)", explanation: "Visit each node once. Recursion stack depth equals tree height h (O(log n) for balanced, O(n) for skewed)." },
};

export const seedInvertBinaryTree = async () => {
  try {
    const existing = await Problem.findOne({ problemId: "invert-binary-tree" });
    if (existing) {
      console.log("✅ Invert Binary Tree problem already exists");
      return existing;
    }
    const problem = await Problem.create(invertBinaryTreeProblem);
    console.log("✅ Invert Binary Tree problem seeded successfully!");
    console.log(`   - ${problem.algorithmTutorial.frames.length} tutorial frames`);
    console.log(`   - ${problem.problemSolution.frames.length} solution frames`);
    console.log(`   - Solutions in ${Object.keys(problem.solutions || {}).length} languages`);
    return problem;
  } catch (error) {
    console.error("❌ Error seeding Invert Binary Tree problem:", error);
    throw error;
  }
};

export default seedInvertBinaryTree;