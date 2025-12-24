import Products from '../models/Products.js';

export const createProduct = async (req, res) => {
    const product = await Products.create({
        ...req.body,
        createdBy: req.user._id
    });
    res.status(201).json({ message: 'Product created successfully', product });
    };

    export const getAllProducts = async (req, res) => {
   try {
    const products = await Products.find().populate('createdAt', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ products });
   } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
   }
    };

    export const getSingleProduct = async (req, res) => {
   try {
    const { id } = req.params;
    const product = await Products.findById(id).populate('createdAt', 'name email');
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ product });
   } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
   }
    };