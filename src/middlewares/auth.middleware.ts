import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "@/models/user.model";
import { UserRequest } from "@/interfaces/UserRequest";

interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({ message: "You are not logged in!" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    (req as UserRequest).user = { id: user.id.toString(), ...user.toObject() };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token, please log in again" });
  }
};
