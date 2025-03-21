import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";
import { WebSocket } from "ws";
dotenv.config();

export const verifyUser = (socket: WebSocket,token: string): boolean => {
  const key = process.env.NEXTAUTH_SECRET!;
  try {
    const decoded = jwt.verify(token, key) as JwtPayload;
    if (decoded && decoded.id) {
      socket.userId = decoded.id;
      socket.userName = decoded.name;
      return true
    }
    return false;
  } catch (error) {
    return false;
  }
};
