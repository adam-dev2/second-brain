import express from 'express'
import { createSection, deleteSectionById,  fetchSectionCardsbyId, getSections, singleCardMove, updateSectionbyId } from '../controllers/sectionController.js';
import { AuthMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.use(AuthMiddleware)

router.get('/',getSections);
router.post('/',createSection);
router.get('/:id',fetchSectionCardsbyId);
router.patch('/:id',updateSectionbyId);
router.delete('/:id',deleteSectionById);
router.post('/move-card',singleCardMove);

export default router;