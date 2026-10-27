import mongoose from "mongoose";
import dns from "dns";
import envConfig from "./env.js";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectToDb = async () => {
  try {
    await mongoose.connect(envConfig.MONGO_URI);
    console.log("Connect to database ");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  }
};

export default connectToDb;
