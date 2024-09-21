import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const userSchemaValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

interface IUser extends Document {
  email: string;
  password: string;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

export default model<IUser>("User", userSchema);
