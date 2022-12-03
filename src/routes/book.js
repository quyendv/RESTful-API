import express from 'express';
import { bookController } from '../controllers';
import { isAdmin } from '../middlewares/verifyRole';
import verifyToken from '../middlewares/verifyToken';
import uploadCloud from '../middlewares/uploader';

const router = express.Router();

// PUBLIC ROUTERS
router.get('/', bookController.getBooks);

// PRIVATE ROUTES
router.use(verifyToken);
router.use(isAdmin);
router.post('/', uploadCloud.single('image'), bookController.createNewBook); // admin mới được tạo, middleware uploadCloud sẽ trả về req.file/files giống verify_token tạo req.user

export default router;
