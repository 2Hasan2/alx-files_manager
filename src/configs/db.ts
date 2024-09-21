import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);
  } catch (err) {
    console.error(`Error: ${err}`);
    process.exit(1);
  }
};

export default connectDB;
