import express from "express";
import {
    createBook,
    createManyBooks,
    getAllBooks,
    getSingleBook,
    updateBook,
    deleteBook,
    bookCount,
    userCount,
    createBookReview,
    deleteBookReview,
    getAllReviews
} from "../controllers/bookController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Count routes must be before /:id
router.get("/count", bookCount);
router.get("/user-count", userCount);

// Admin review route - must be before /:id
router.get("/reviews/all", protect, adminOnly, getAllReviews);

router.get("/", getAllBooks);
router.get("/:id", getSingleBook);

// Protected Routes
router.post("/", protect, createBook);
router.post("/bulk", protect, createManyBooks);
router.put("/:id", protect, updateBook);
router.delete("/:id", protect, deleteBook);

// Review Routes
router.post("/:id/reviews", protect, createBookReview);
router.delete("/:id/reviews/:reviewId", protect, adminOnly, deleteBookReview);

export default router;
