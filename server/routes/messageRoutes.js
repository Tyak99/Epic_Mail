import express from 'express';
import messageController from '../controllers/messageControllers';

const router = express.Router();

router.post('/', messageController.postMessage);
export default router;
