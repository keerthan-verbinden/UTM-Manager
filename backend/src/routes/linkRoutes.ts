import { Router } from 'express';
import {
  createLink,
  getLinks,
  getStats,
  getLinkById,
  deleteLink,
} from '../controllers/linkController.ts';
import { authenticateToken } from '../middleware/auth.ts';

const router = Router();

// All link routes are protected by JWT authentication
router.use(authenticateToken);

router.post('/', createLink);
router.get('/', getLinks);
router.get('/stats', getStats);
router.get('/:id', getLinkById);
router.delete('/:id', deleteLink);

export default router;
