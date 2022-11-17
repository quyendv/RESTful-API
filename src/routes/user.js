const router = require('express').Router();
const userController = require('../app/controllers/UserController');

router.get('/', userController.getUsers);

module.exports = router;
