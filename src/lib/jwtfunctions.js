import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" }); // You can customize expiry
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
