import bcrypt from "bcryptjs";
import { pool } from "../../database/db";

const getAllUsersFromDB = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users ORDER BY id ASC`,
  );

  return result;
};

const updateUserIntoDB = async (
  userId: string,
  payload: Record<string, any>,
) => {
  const { name, email, password, phone, role } = payload;

  // 🔹 Password hash only if password provided
  let hashedPassword: string | null = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 12);
  }

  // 🔹 Build dynamic query to avoid overwriting with NULL
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (name !== undefined) {
    fields.push(`name=$${idx++}`);
    values.push(name);
  }
  if (email !== undefined) {
    fields.push(`email=$${idx++}`);
    values.push(email);
  }
  if (password !== undefined) {
    fields.push(`password=$${idx++}`);
    values.push(hashedPassword);
  }
  if (phone !== undefined) {
    fields.push(`phone=$${idx++}`);
    values.push(phone);
  }
  if (role !== undefined) {
    fields.push(`role=$${idx++}`);
    values.push(role);
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(Number(userId)); // last param for WHERE
  const query = `UPDATE users SET ${fields.join(", ")} WHERE id=$${idx} RETURNING id, name, email, phone, role`;

  const result = await pool.query(query, values);
  return result;
};

const deleteUserFromDB = async (userId: string) => {
  //  check active bookings
  const bookingCheck = await pool.query(
    `SELECT COUNT(*) FROM bookings WHERE customer_id  = $1 AND status = 'active'`,
    [userId],
  );

  if (Number(bookingCheck.rows[0].count) > 0) {
    throw new Error("Cannot delete user: active bookings exist");
  }

  //  no active bookings → delete user
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING *`,
    [userId],
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result;
};

export const userService = {
  getAllUsersFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
};
