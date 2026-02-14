import mongoose from "mongoose";
import dotenv from "dotenv";
import seedTwoSumProblem from "./seedTwoSum";

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/dsa-visualizer";

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...\n");

    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Seed Two Sum problem
    console.log("📝 Seeding Two Sum problem...");
    await seedTwoSumProblem();

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log("   - Problems seeded: 1");
    console.log("   - Algorithm tutorials: 1 (Hash Map, 5 frames)");
    console.log("   - Problem solutions: 1 (Two Sum, 10 frames)");
    console.log("   - Total visualization frames: 15\n");

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