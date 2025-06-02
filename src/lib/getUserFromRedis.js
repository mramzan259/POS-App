// lib/getUserFromRedis.js
import redis from "./redis";
import { cookies } from "next/headers";

export async function getUserFromRedis() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) return null;

  const userData = await redis.get(token);
  
  if (!userData) return null;

  return JSON.parse(userData);
}
