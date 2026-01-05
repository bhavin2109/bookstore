import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        storeName: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        logo: {
            type: String,
            default: "",
        },
        banner: {
            type: String,
            default: "",
        },
        description: {
            type: String,
            default: "",
        },
        themeColor: {
            type: String,
            default: "#10b981", // Emerald-500 default
        },
    },
    { timestamps: true }
);

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;
