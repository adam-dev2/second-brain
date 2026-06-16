import http from "http";
import jwt from "jsonwebtoken";
import { Server, type Socket } from "socket.io";
import UserModal from "../models/User.js";

let io: Server | null = null;

const allowedOrigins = [
  "https://second-brain-jade-gamma.vercel.app",
  "http://localhost:5173",
  "http://localhost:4173",
  "https://secondbrain.madebyadam.xyz",
];

declare module "socket.io" {
  interface SocketData {
    userId?: string;
    username?: string;
  }
}

function getTokenFromCookies(cookieHeader?: string) {
  if (!cookieHeader) return null;
  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("token="))
    ?.split("=")[1] || null;
}

export const initSocketServer = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        getTokenFromCookies(socket.handshake.headers.cookie as string);

      if (!token) {
        throw new Error("Authentication token missing");
      }

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT secret is not configured");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        id?: string;
      };
      if (!decoded?.id) {
        throw new Error("Invalid token payload");
      }

      const user = await UserModal.findById(decoded.id)
        .select("_id username email avatar");

      if (!user) {
        throw new Error("User not found");
      }

      socket.data.userId = String(user._id);
      socket.data.username = user.username ?? "";
      next();
    } catch (error) {
      console.error("Socket authentication failed:", error);
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;
    if (userId) {
      socket.join(userId);
      console.log(`Socket connected for user ${userId}`);
    }

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${reason}`);
    });
  });

  return io;
};

export const sendSocketEvent = (userId: string, event: string, data: unknown) => {
  if (!io) return;
  io.to(userId).emit(event, data);
};
