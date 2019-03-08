import express from 'express';
import groupController from '../controllers/groupControllers';

const router = express.Router();
router.post('/', groupController.postGroup);

export default router;
