import { Schema, model } from 'mongoose';

const reviewSchema = new Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    userImage: { type: String }
}, {
    timestamps: true
});

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'Seller'
    }
});

export default model('Book', bookSchema, 'products');
