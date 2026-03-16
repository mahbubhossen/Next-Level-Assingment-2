import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
      };
    }
  }
}

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "You are not allowed",
          errors: "Authorization token missing",
        });
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Authorization token missing",
          errors: "Token part missing",
        });
      }

      const decoded = jwt.verify(token, config.jwtSecret as string) as {
        id: number;
        role: string;
        [key: string]: any;
      };

      if (!decoded.id) {
        return res.status(401).json({
          success: false,
          message: "Invalid token: id missing",
        });
      }

      req.user = {
        id: Number(decoded.id),
        role: decoded.role,
      };

      // Role based access
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      next();
    } catch (error: any) {
      res.status(403).json({
        success: false,
        message: "Authentication failed",
        errors: error.message,
      });
    }
  };
};

export default auth;
