import Products from '../models/Products.js';

export const createProduct = async (req, res) => {
    const product = await Products.create({
        ...req.body,
        createdBy: req.user._id
    });
    res.status(201).json({ message: 'Product created successfully', product });
    };