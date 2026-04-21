import express from 'express'
import { bulkCardsMove, createSection, deleteSectionById, fetchDefaultSectionCards, fetchSectionCardsbyId, getSections, singleCardMove, updateSectionbyId } from '../controllers/sectionController.js';
import { AuthMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.use(AuthMiddleware)

router.get('/',getSections);
router.post('/',createSection);
router.get('/:id',fetchSectionCardsbyId);
router.get('/default',fetchDefaultSectionCards);
router.patch('/:id',updateSectionbyId);
router.delete('/:id',deleteSectionById);
router.post('/moveCard',singleCardMove);
router.post('/bulkmove',bulkCardsMove);

export default router;