import { Response } from "express";
import File, { fileSchemaValidation } from "@/models/file.model";
import { z } from "zod";
import multer from "multer";
import { UserRequest } from "@/interfaces/UserRequest";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `file-${Date.now()}.${ext}`);
  },
});
export const upload = multer({ storage });

export const saveFile = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const validatedData = fileSchemaValidation.parse({
      filename: req.file?.filename,
      path: req.file?.path,
      owner: req.user?.id,
    });

    const file = await File.create(validatedData);
    res.status(201).json({ status: "success", data: file });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ status: "fail", message: err.errors });
    } else {
      res.status(400).json({ status: "fail", message: (err as Error).message });
    }
  }
};

export const listFiles = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const files = await File.find({ owner: req.user?.id });
    res.status(200).json({ status: "success", data: files });
  } catch (err) {
    res.status(400).json({ status: "fail", message: (err as Error).message });
  }
};
