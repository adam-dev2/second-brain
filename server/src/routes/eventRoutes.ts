import express from "express";
import { AuthMiddleware } from "../middlewares/auth.js";
import { addClient, removeClient } from "../utils/sseManager.js";

const router = express.Router();

router.get("/events", AuthMiddleware, (req, res) => {
  const userId = req.User?.id;
  if (!userId) return res.status(401).end();

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  addClient(userId, res);

  const keepAlive = setInterval(() => res.write(":keepalive\n\n"), 15000);

  req.on("close", () => {
    clearInterval(keepAlive);
    removeClient(userId);
  });
});

export default router;
