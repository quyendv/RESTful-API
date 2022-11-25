import express from 'express';
import { insertController } from '../controllers';

const router = express.Router();

router.get('/', insertController.insertData);

export default router;
