
import express from 'express';
import { chatHandler } from '../controllers/chat.controller.js';

const router = express.Router();

/**
 * @route POST /api/chat
 * @desc Interact with Gemini Chatbot
 * @access Public
 */
router.post('/', chatHandler);

export default router;
