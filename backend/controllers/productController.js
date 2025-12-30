import Products from '../models/Products.js';
import Users from '../models/User.js';
import mongoose from 'mongoose';

export const createProduct = async (req, res) => {
    try {
        // Enforce strict fields from the request body
        const { title, author, description, price, genre, image } = req.body;

        const product = await Products.create({
            title,
            author,
            description,
            price,
            genre,
            image,
            createdBy: req.user._id
        });
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

export const createManyProducts = async (req, res) => {
    try {
        const products = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Input must be a non-empty array of products' });
        }

        // 1. Validate Structure & Filter Invalids (Client-side validation fallback)
        const validStructureProducts = products.filter(p =>
            p.title && p.author && p.price !== undefined && p.description && p.genre && p.image
        );
        const invalidStructureCount = products.length - validStructureProducts.length;

        if (validStructureProducts.length === 0) {
            return res.status(400).json({
                message: 'No valid products found in input. All entries missing required fields.',
                importedCount: 0,
                skippedCount: 0,
                failedCount: invalidStructureCount
            });
        }

        // 2. Identify and Filter Duplicates (Application Level)
        const queryConditions = validStructureProducts.map(p => ({
            title: p.title,
            author: p.author
        }));

        let newProducts = validStructureProducts;

        // Perform DB Duplicate Check
        if (queryConditions.length > 0) {
            const existingProducts = await Products.find({ $or: queryConditions });

            const existingSet = new Set(
                existingProducts.map(p => `${p.title.trim().toLowerCase()}|${p.author.trim().toLowerCase()}`)
            );

            newProducts = validStructureProducts.filter(p => {
                const key = `${p.title.trim().toLowerCase()}|${p.author.trim().toLowerCase()}`;
                return !existingSet.has(key);
            });
        }

        const duplicateCount = validStructureProducts.length - newProducts.length;

        if (newProducts.length === 0) {
            return res.status(200).json({
                message: `Import finished. Skipped ${duplicateCount} duplicates.${invalidStructureCount ? ` Discarded ${invalidStructureCount} invalid entries.` : ''}`,
                importedCount: 0,
                skippedCount: duplicateCount,
                failedCount: invalidStructureCount,
                products: []
            });
        }

        // 3. Prepare for Insertion
        const productsWithUser = newProducts.map(product => ({
            ...product,
            createdBy: req.user._id
        }));

        // 4. Insert with ordered: false to allow partial success on database-level errors
        let insertedDocs = [];
        try {
            // ordered: false ensures that if one doc fails (e.g. DB constraint), others still proceed
            insertedDocs = await Products.insertMany(productsWithUser, { ordered: false });
        } catch (e) {
            // Mongoose 'insertMany' error with ordered: false contains successful docs in insertedDocs
            if (e.insertedDocs) {
                insertedDocs = e.insertedDocs;
            }
            // If it's a critical system error, rethrow, otherwise we assume partial success
            if (!e.insertedDocs && !e.writeErrors) {
                throw e;
            }
        }

        const totalImported = insertedDocs.length;

        res.status(201).json({
            message: `Successfully imported ${totalImported} books. Skipped ${duplicateCount} duplicates.${invalidStructureCount ? ` Failed/Invalid: ${invalidStructureCount}` : ''}`,
            importedCount: totalImported,
            skippedCount: duplicateCount,
            failedCount: invalidStructureCount,
            products: insertedDocs
        });

    } catch (error) {
        res.status(500).json({ message: 'Critical error during import', error: error.message });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Products.find().sort({ createdAt: -1 });

        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Product not found (Invalid ID)' });
        }

        const product = await Products.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product); // Send product directly or wrapped, frontend expects object
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Products.findByIdAndUpdate(id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Products.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};

export const productCount = async (req, res) => {
    try {
        const count = await Products.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const userCount = async (req, res) => {
    try {
        const count = await Users.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};  