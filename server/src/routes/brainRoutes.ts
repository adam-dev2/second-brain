import express from 'express';
import { AuthMiddleware } from '../middlewares/auth.js';
import { GetShareBrain, ShareBrain } from '../controllers/shareController.js';

const router = express.Router();

router.get('/share',AuthMiddleware,ShareBrain);
router.get('/:shareLink',GetShareBrain)

export default router;
