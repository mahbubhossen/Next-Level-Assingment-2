import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.createBookingIntoDB(req.body);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to create booking",
      errors: error.message,
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    await bookingService.autoReturnBookings();
    const user = req.user as any;

    const result = await bookingService.getAllBookingsFromDB(user);

    return res.status(200).json({
      success: true,
      message:
        user.role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings",
      errors: error.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const user = req.user as any;

    const result = await bookingService.updateBookingIntoDB(
      bookingId as any,
      req.body,
      user,
    );

    return res.status(200).json({
      success: true,
      message:
        req.body.status === "cancelled"
          ? "Booking cancelled successfully"
          : "Booking marked as returned. Vehicle is now available",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to update booking",
      errors: error.message,
    });
  }
};
export const bookingController = {
  createBooking,
  getAllBookings,
  updateBooking,
};
