import express from "express";
import { AuthMiddleware } from "../middlewares/auth.js";
import {
  createCard,
  DeleteCard,
  EditCard,
  FetchAllCards,
  FetchMetrics,
  Query,
} from "../controllers/cardController.js";

const router = express.Router();

router.use(AuthMiddleware);

router.get("/metrics", FetchMetrics);
router.get("/cards", FetchAllCards);

router.post("/card", createCard);
router.put("/editCard/:id", EditCard);
router.delete("/card/:id", DeleteCard);
router.post("/query", Query);

export default router;
