import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "@/configs/db";
import authRoutes from "@/routes/auth.routes";
import fileRoutes from "@/routes/file.routes";
import redisClient from "@/configs/redis";

const app: Express = express();

redisClient;
connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the File Upload API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
