import express from "express";
import {
    createBook,
    createManyBooks,
    getAllBooks,
    getSingleBook,
    updateBook,
    deleteBook,
    bookCount,
    userCount
} from "../controllers/bookController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Count routes must be before /:id
router.get("/count", bookCount);
router.get("/user-count", userCount);

router.get("/", getAllBooks);
router.get("/:id", getSingleBook);

// Protected Routes
router.post("/", protect, createBook);
router.post("/bulk", protect, createManyBooks);
router.put("/:id", protect, updateBook);
router.delete("/:id", protect, deleteBook);

export default router;
