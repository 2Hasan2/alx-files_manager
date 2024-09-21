import express from "express";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { upload, saveFile, listFiles } from "@/controllers/file.controller";

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("file"), saveFile);
// List all files (protected route)
router.get("/", authMiddleware, listFiles);

export default router;
