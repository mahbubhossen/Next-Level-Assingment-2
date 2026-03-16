import express, { Request, Response } from "express";
import config from "./config";
import { initDB } from "./database/db";
import { authRouter } from "./modules/auth/auth.route";
import { bookingRouter } from "./modules/booking/booking.route";
import { userRouter } from "./modules/user/user.route";
import { vehicleRouter } from "./modules/vehicle/vehicle.route";
const port = config.port;

const app = express();
app.use(express.json());

initDB();

// auth router
app.use("/api/v1/auth", authRouter);

// user router
app.use("/api/v1/users", userRouter);

// vehicles router
app.use("/api/v1/vehicles", vehicleRouter);

// bookings router
app.use("/api/v1/bookings", bookingRouter);

// test route
app.get("/", (req: Request, res: Response) => {
  res.send("Server running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
