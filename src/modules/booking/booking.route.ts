import { Router } from "express";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constant";
import { bookingController } from "./booking.controller";

const router = Router();

router.post("/", auth(Roles.admin , Roles.customer), bookingController.createBooking);
router.get("/", auth(Roles.admin , Roles.customer), bookingController.getAllBookings);
router.put("/:bookingId", auth(Roles.admin , Roles.customer), bookingController.updateBooking);

export const bookingRouter = router;
