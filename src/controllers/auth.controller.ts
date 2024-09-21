import { Request, Response } from "express";
import { MongoError } from "mongodb";
import User, { userSchemaValidation } from "@/models/user.model";
import jwt from "jsonwebtoken";
import { z } from "zod";

const signToken = (id: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = userSchemaValidation.parse(req.body);
    const newUser = await User.create(validatedData);
    const token = signToken(newUser.id);

    res.status(201).json({ status: "success", token });
  } catch (err) {
    console.error("Signup error:", err);

    if (err instanceof z.ZodError) {
      res.status(400).json({
        status: "fail",
        message: "Validation Error",
        errors: err.errors,
      });
    } else if (
      (err as MongoError).name === "MongoError" &&
      (err as MongoError).code === 11000
    ) {
      res.status(400).json({ status: "fail", message: "Email already exists" });
    } else {
      res
        .status(500)
        .json({ status: "fail", message: "Internal Server Error" });
    }
  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const validatedData = userSchemaValidation
      .pick({ email: true, password: true })
      .parse(req.body);

    const { email, password } = validatedData;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ status: "fail", message: "Incorrect email or password" });
    }

    const token = signToken(user.id);
    res.status(200).json({ status: "success", token });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({
        status: "fail",
        message: "Validation Error",
        errors: err.errors,
      });
    } else {
      res
        .status(500)
        .json({ status: "fail", message: "Internal Server Error" });
    }
  }
};
