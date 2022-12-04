import express from 'express';
import { bookController } from '../controllers';
import { isCreatorOrAdmin } from '../middlewares/verifyRole';
import verifyToken from '../middlewares/verifyToken';
import uploadCloud from '../middlewares/uploader';

const router = express.Router();

// PUBLIC ROUTERS
router.get('/', bookController.getBooks);

// PRIVATE ROUTES
router.use(verifyToken);
router.use(isCreatorOrAdmin);
router.post('/', uploadCloud.single('image'), bookController.createNewBook); // admin mới được tạo, middleware uploadCloud sẽ trả về req.file/files giống verify_token tạo req.user
router.put('/', uploadCloud.single('image'), bookController.updateBook); // Chú ý update của sequelize nó chỉ sửa những thay đổi, nên dù dùng Put sửa và clear hết những cái k nhập nhưng kết hợp với update lại ngang Patch
router.delete('/', bookController.deleteBook);

export default router;
