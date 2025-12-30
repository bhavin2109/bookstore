import express from "express";
import {
    createProduct,
    createManyProducts,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    productCount,
    userCount
} from "../controllers/productController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Count routes must be before /:id
router.get("/count", productCount);
router.get("/user-count", userCount);

router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

// Protected Routes
router.post("/", protect, createProduct);
router.post("/bulk", protect, createManyProducts);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
