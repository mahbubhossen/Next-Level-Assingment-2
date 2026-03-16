import { Request, Response } from "express";
import { authService } from "./auth.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.creteUserIntoDB(req.body);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to create user",
      errors: error.message,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authService.loginUser(email, password);
    res.status(200).json({
      success: true,
      message: "login successful ",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "login failed",
      errors: error.message,
    });
  }
};

export const authController = {
  createUser,
  loginUser,
};
