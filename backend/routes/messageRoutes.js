import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
    accessChat,
    fetchChats,
    sendMessage,
    allMessages,
} from "../controllers/messageController.js";

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/message").post(protect, sendMessage);
router.route("/message/:chatId").get(protect, allMessages);

export default router;
