import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../database/db";

const creteUserIntoDB = async (payload: Record<string, any>) => {
  const { name, email, password, phone, role } = payload;

  const hashPassword = await bcrypt.hash(password, 12);

  const result = await pool.query(
    "INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, email, hashPassword, phone, role],
  );
  delete result.rows[0].password;
  return result;
};

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  if (result.rows.length === 0) return null;
  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  delete user.password;

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwtSecret as string,
    {
      expiresIn: "7d",
    },
  );
  return { token, user };
};

export const authService = {
  creteUserIntoDB,
  loginUser,
};
