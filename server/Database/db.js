const mongoose = require("mongoose");

const url = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(url);
    console.log("MongoDB is connected");
  } catch (error) {
    console.error(" MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
