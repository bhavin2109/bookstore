import mongoose from "mongoose";

const deliveryPartnerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        currentLocation: {
            lat: { type: Number },
            lng: { type: Number },
        },
        vehicleDetails: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const DeliveryPartner = mongoose.model(
    "DeliveryPartner",
    deliveryPartnerSchema
);

export default DeliveryPartner;
