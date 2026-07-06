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
import sectionRoutes from "./routes/sectionRoutes.js"
import cookieParser from "cookie-parser";


const app = express();

ConnectDB();
ConnectQdrant();

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "https://second-brain-jade-gamma.vercel.app",
  "http://localhost:5173",
  "http://localhost:4173",
  "https://secondbrain.madebyadam.xyz",
  "https://secondbrain.thisisadam.xyz",
  "https://secondbrain.adamhq.site"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(passport.initialize());

app.get("/api/v1/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/v1/auth", oauthRoutes);
app.use("/api/v1/content", cardRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/brain", brainRoutes);
app.use("/api/v1/section", sectionRoutes);

export default app;
