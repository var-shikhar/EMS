import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    categoryID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'AssetCategory', 
        required: true
    },
    totalQuantity: { type: Number, default: 0 },
    latestPurchase: {
        date: { type: Date },
        price: { type: Number, default: 0 },
        quantity: { type: Number, default: 0 },
        vendorID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AssetVendor'
        }
    },
    purchaseHistory: [{
        date: { type: Date },
        price: { type: Number, default: 0 },
        quantity: { type: Number, default: 0 },
        vendorID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AssetVendor'
        }
    }],    
    isAvailable: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
}, { timestamps: true });

const Asset = mongoose.model('Asset', assetSchema);
export default Asset;
