import express from 'express';
import { AuthMiddleware } from '../middlewares/auth.js';
import { createCard, DeleteCard, EditCard, FetchAllCards, FetchMetrics, Query } from '../controllers/cardController.js';

const router = express.Router();

router.get('/metrics',AuthMiddleware,FetchMetrics);
router.get('/cards',AuthMiddleware,FetchAllCards);

router.post('/card',AuthMiddleware,createCard);
router.put('/editCard/:id',AuthMiddleware,EditCard);
router.delete('/card/:id',AuthMiddleware,DeleteCard);
router.post('/query',AuthMiddleware,Query);

export default router;