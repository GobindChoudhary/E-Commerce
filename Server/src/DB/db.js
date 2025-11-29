import mongoose from "mongoose";

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("MongoDB Connected:", conn.connection.host);
  } catch (error) {
    console.log(error);
  }
}

export default connectDB;
