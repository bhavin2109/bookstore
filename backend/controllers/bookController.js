import Book from '../models/Book.js';
import Users from '../models/User.js';
import mongoose from 'mongoose';

export const createBook = async (req, res) => {
    try {
        // Enforce strict fields from the request body
        const { title, author, description, price, genre, image } = req.body;

        const book = await Book.create({
            title,
            author,
            description,
            price,
            genre,
            image,
            createdBy: req.user._id
        });
        res.status(201).json({ message: 'Book created successfully', book });
    } catch (error) {
        res.status(500).json({ message: 'Error creating book', error: error.message });
    }
};

export const createManyBooks = async (req, res) => {
    try {
        const books = req.body;

        if (!Array.isArray(books) || books.length === 0) {
            return res.status(400).json({ message: 'Input must be a non-empty array of books' });
        }

        // 1. Validate Structure & Filter Invalids (Client-side validation fallback)
        const validStructureBooks = books.filter(p =>
            p.title && p.author && p.price !== undefined && p.description && p.genre && p.image
        );
        const invalidStructureCount = books.length - validStructureBooks.length;

        if (validStructureBooks.length === 0) {
            return res.status(400).json({
                message: 'No valid books found in input. All entries missing required fields.',
                importedCount: 0,
                skippedCount: 0,
                failedCount: invalidStructureCount
            });
        }

        // 2. Identify and Filter Duplicates (Application Level)
        const queryConditions = validStructureBooks.map(p => ({
            title: p.title,
            author: p.author
        }));

        let newBooks = validStructureBooks;

        // Perform DB Duplicate Check
        if (queryConditions.length > 0) {
            const existingBooks = await Book.find({ $or: queryConditions });

            const existingSet = new Set(
                existingBooks.map(p => `${p.title.trim().toLowerCase()}|${p.author.trim().toLowerCase()}`)
            );

            newBooks = validStructureBooks.filter(p => {
                const key = `${p.title.trim().toLowerCase()}|${p.author.trim().toLowerCase()}`;
                return !existingSet.has(key);
            });
        }

        const duplicateCount = validStructureBooks.length - newBooks.length;

        if (newBooks.length === 0) {
            return res.status(200).json({
                message: `Import finished. Skipped ${duplicateCount} duplicates.${invalidStructureCount ? ` Discarded ${invalidStructureCount} invalid entries.` : ''}`,
                importedCount: 0,
                skippedCount: duplicateCount,
                failedCount: invalidStructureCount,
                books: []
            });
        }

        // 3. Prepare for Insertion
        const booksWithUser = newBooks.map(book => ({
            ...book,
            createdBy: req.user._id
        }));

        // 4. Insert with ordered: false to allow partial success on database-level errors
        let insertedDocs = [];
        try {
            // ordered: false ensures that if one doc fails (e.g. DB constraint), others still proceed
            insertedDocs = await Book.insertMany(booksWithUser, { ordered: false });
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
            books: insertedDocs
        });

    } catch (error) {
        res.status(500).json({ message: 'Critical error during import', error: error.message });
    }
};

export const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });

        res.status(200).json({ books });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const getSingleBook = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Book not found (Invalid ID)' });
        }

        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book); // Send book directly or wrapped, frontend expects object
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByIdAndUpdate(id, req.body, { new: true });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error updating book', error: error.message });
    }
};

export const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByIdAndDelete(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error: error.message });
    }
};

export const bookCount = async (req, res) => {
    try {
        const count = await Book.countDocuments();
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