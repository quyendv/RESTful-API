const router = require('express').Router();
const userController = require('../controllers/UserController');

router.get('/', userController.getUsers);

module.exports = router;
