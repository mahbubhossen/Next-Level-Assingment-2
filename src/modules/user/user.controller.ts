import { Request, Response } from "express";
import { Roles } from "../auth/auth.constant";
import { userService } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsersFromDB();

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
      errors: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const payload = req.body;

    const userIdNum = Number(userId);
    const currentUserId = Number(req.user?.id);
    const currentUserRole = req.user?.role;

    console.log("BODY:", payload);
    console.log(
      "URL userId:",
      userIdNum,
      "Current user:",
      currentUserId,
      "Role:",
      currentUserRole,
    );

    // Customer can only update self
    if (currentUserRole === Roles.customer && userIdNum !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update other users",
      });
    }

    // Customer cannot change role
    if (
      currentUserRole === Roles.customer &&
      payload.role &&
      payload.role !== currentUserRole
    ) {
      payload.role = currentUserRole;
    }

    const result = await userService.updateUserIntoDB(
      userIdNum as any,
      payload,
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user",
      errors: error.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const result = await userService.deleteUserFromDB(userId as any);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Failed to delete user",
      errors: error.message,
    });
  }
};

export const userController = {
  getAllUsers,
  updateUser,
  deleteUser,
};
