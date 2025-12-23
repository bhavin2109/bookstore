import express from "express";
import Product from "../models/Products.js";

const router = express.Router();

const createProduct = async (req, res) => {
  try {
    const { title, image, price, description, genre } = req.body;

    const newProduct = new Product({
      title,
      image,
      price,
      description,
      genre
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct
    });

  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
      error: error.message
    });
  }
};

router.post("/create-product", createProduct);

export default router;
