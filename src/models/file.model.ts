import { Schema, model, Document } from "mongoose";
import { z } from "zod";

export const fileSchemaValidation = z.object({
  filename: z.string(),
  path: z.string(),
  permission: z.enum(["private", "public"]).optional(),
  owner: z.string(),
});

interface IFile extends Document {
  filename: string;
  path: string;
  permission: "private" | "public";
  owner: Schema.Types.String;
}

const fileSchema = new Schema<IFile>({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  permission: { type: String, default: "private" },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default model<IFile>("File", fileSchema);
