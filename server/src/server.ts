import dotenv from "dotenv";
dotenv.config();

import express from "express";
import ConnectDB from "./config/db.js";
import { ConnectQdrant } from "./config/QdrantConfig.js";
import cors from "cors";
import passport from "./utils/passport.js";
import oauthRoutes from "./routes/oauthRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import brainRoutes from "./routes/brainRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import cookieParser from "cookie-parser";

const app = express();
ConnectDB();
ConnectQdrant();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(passport.initialize());

app.get("/api/v1/", (req, res) => {
  return res.status(200).json({ message: "Server is Healthy" });
});

app.use(eventRoutes);
app.use("/api/v1/auth", oauthRoutes);
app.use("/api/v1/content", cardRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/brain", brainRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port: ${process.env.PORT}`);
});
