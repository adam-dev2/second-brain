import express from 'express'
import { createSection, deleteSectionById,  deleteSectionWithCards,  fetchSectionCardsbyId, getSections, singleCardMove, updateSectionbyId } from '../controllers/sectionController.js';
import { AuthMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.use(AuthMiddleware)

router.get('/',getSections);
router.post('/',createSection);
router.get('/:id',fetchSectionCardsbyId);
router.patch('/:id',updateSectionbyId);
router.post('/delete-all',deleteSectionWithCards)
router.delete('/:id',deleteSectionById);
router.post('/move-card',singleCardMove);

export default router;