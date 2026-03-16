import { pool } from "../../database/db";

const createBookingIntoDB = async (payload: Record<string, any>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicleResult = await pool.query(
    `SELECT vehicle_name, daily_rent_price FROM vehicles WHERE id = $1`,
    [vehicle_id],
  );

  const vehicle = vehicleResult.rows[0];

  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);

  const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

  const total_price = diffDays * vehicle.daily_rent_price;

  const bookingResult = await pool.query(
    `INSERT INTO bookings
    (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES ($1,$2,$3,$4,$5,'active')
    RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price],
  );

  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id],
  );

  return {
    ...bookingResult.rows[0],
    vehicle,
  };
};

const getAllBookingsFromDB = async (user: any) => {
  //  see all bookings
  if (user.role === "admin") {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.customer_id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,
        json_build_object(
          'name', u.name,
          'email', u.email
        ) as customer,
        json_build_object(
          'vehicle_name', v.vehicle_name,
          'registration_number', v.registration_number
        ) as vehicle
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.id ASC
    `);

    return result.rows;
  }

  //  see only own bookings
  const result = await pool.query(
    `
    SELECT 
      b.id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      json_build_object(
        'vehicle_name', v.vehicle_name,
        'registration_number', v.registration_number,
        'type', v.type
      ) as vehicle
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.id ASC
  `,
    [user.id],
  );

  return result.rows;
};

const updateBookingIntoDB = async (
  bookingId: string,
  payload: Record<string, any>,
  user: any,
) => {
  const { status } = payload;

  // Customer can only cancel own booking
  if (user.role === "customer") {
    if (status !== "cancelled") {
      throw new Error("Customers can only cancel bookings");
    }

    const booking = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [
      bookingId,
    ]);

    if (booking.rows.length === 0) {
      throw new Error("Booking not found");
    }

    if (booking.rows[0].customer_id !== user.id) {
      throw new Error("You are not allowed to cancel this booking");
    }
  }

  //  Admin can mark as returned
  if (user.role === "admin" && status !== "returned") {
    throw new Error("Admin can only mark booking as returned");
  }

  const result = await pool.query(
    `UPDATE bookings
     SET status = $1
     WHERE id = $2
     RETURNING *`,
    [status, bookingId],
  );

  if (status === "returned" || status === "cancelled") {
    const vehicleId = result.rows[0].vehicle_id;

    const vehicleResult = await pool.query(
      `UPDATE vehicles
       SET availability_status = 'available'
       WHERE id = $1
       RETURNING availability_status`,
      [vehicleId],
    );

    return {
      ...result.rows[0],
      vehicle: vehicleResult.rows[0],
    };
  }

  return result.rows[0];
};

const autoReturnBookings = async () => {
  const expiredBookings = await pool.query(
    `SELECT id, vehicle_id
     FROM bookings
     WHERE rent_end_date < CURRENT_DATE
     AND status = 'active'`,
  );

  for (const booking of expiredBookings.rows) {
    await pool.query(
      `UPDATE bookings
       SET status = 'returned'
       WHERE id = $1`,
      [booking.id],
    );

    await pool.query(
      `UPDATE vehicles
       SET availability_status = 'available'
       WHERE id = $1`,
      [booking.vehicle_id],
    );
  }
};

export const bookingService = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  updateBookingIntoDB,
  autoReturnBookings,
};
