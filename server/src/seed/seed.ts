import mongoose from "mongoose";
import dotenv from "dotenv";
import seedTwoSumProblem from "./seedTwoSum";
import seedReverseLinkedList from "./seedReverseLinkedList";
import seedValidParentheses from "./seedValidParentheses";
import seedBinarySearch from "./seedBinarySearch";
import seedMergeSort from "./seedMergeSort";
import seedMaximumSubarray from "./seedMaximumSubarray";
import seedClimbingStairs from "./seedClimbingStairs";
import seedLongestSubstring from "./seedLongestSubstring";
import seedInvertBinaryTree from "./seedInvertBinaryTree";
import seedProductExceptSelf from "./seedProductExceptSelf";

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/dsa-visualizer";

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...\n");
    console.log("📡 Connecting to MongoDB...");

    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Seed all problems
    console.log("📝 Seeding problems...\n");
    
    // First batch (Easy problems)
    console.log("🟢 EASY PROBLEMS:");
    await seedTwoSumProblem();
    console.log("");
    
    await seedReverseLinkedList();
    console.log("");
    
    await seedValidParentheses();
    console.log("");
    
    await seedBinarySearch();
    console.log("");
    
    await seedClimbingStairs();
    console.log("");
    
    await seedInvertBinaryTree();
    console.log("");
    
    // Second batch (Medium problems)
    console.log("🟡 MEDIUM PROBLEMS:");
    await seedMergeSort();
    console.log("");
    
    await seedMaximumSubarray();
    console.log("");
    
    await seedLongestSubstring();
    console.log("");
    
    await seedProductExceptSelf();
    console.log("");

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📊 SUMMARY:");
    console.log("═══════════════════════════════════════");
    console.log("   Total Problems: 10");
    console.log("");
    console.log("   🟢 EASY (6 problems):");
    console.log("   ├─ Two Sum");
    console.log("   ├─ Reverse Linked List");
    console.log("   ├─ Valid Parentheses");
    console.log("   ├─ Binary Search");
    console.log("   ├─ Climbing Stairs");
    console.log("   └─ Invert Binary Tree");
    console.log("");
    console.log("   🟡 MEDIUM (4 problems):");
    console.log("   ├─ Merge Sort");
    console.log("   ├─ Maximum Subarray");
    console.log("   ├─ Longest Substring Without Repeating");
    console.log("   └─ Product of Array Except Self");
    console.log("");
    console.log("   ✨ Each problem includes:");
    console.log("   • 5 programming languages (Python, C++, Java, JS, Go)");
    console.log("   • Algorithm tutorial with 3D visualizations");
    console.log("   • Step-by-step solution walkthrough");
    console.log("   • Complexity analysis");
    console.log("═══════════════════════════════════════\n");

  } catch (error) {
    console.error("\n❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("✅ Database connection closed");
    process.exit(0);
  }
}

// Run seeding
seedDatabase();