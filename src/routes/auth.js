const router = require('express').Router();
const authController = require('../controllers/auth');
// import { authController } from '../controllers';

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshTokenController);

module.exports = router;