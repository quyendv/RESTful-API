import express from 'express';
import { bookController } from '../controllers';
import { isAdmin } from '../middlewares/verifyRole';
import verifyToken from '../middlewares/verifyToken';

const router = express.Router();

// PUBLIC ROUTERS
router.get('/', bookController.getBooks);

// PRIVATE ROUTES
router.use(verifyToken);
router.use(isAdmin);
router.post('/', bookController.createNewBook); // admin mới được tạo

export default router;
