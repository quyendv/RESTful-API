const router = require('express').Router();

const userController = require('../controllers/user');
const verifyToken = require('../middlewares/verifyToken').default; // chú ý nếu file verifyToken export default (ES6) thì ở đây nên dùng import (ES6), nếu dùng require (ES5) thì phải .default mới được
const { isAdmin, isModeratorOrAdmin } = require('../middlewares/verifyRole');

// PUBLIC ROUTES

// PRIVATE ROUTES
router.use(verifyToken); // Tất cả những routes bên dưới use(middleware) này đều được check, thay vì xen vào làm middlewares của tường route bên dưới. Hoặc truyền lần lượt hoặc mảng middlewares cũng được

// router.use(isAdmin);
// router.use(isModeratorOrAdmin);
router.get('/', userController.getCurrent);

module.exports = router;
