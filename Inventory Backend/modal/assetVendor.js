import mongoose from 'mongoose';

const assetVendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    companyName: { type: String, required: true },
    categoryID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'AssetCategory', 
        required: true
    },
    phone: { type: String, unique: true },
    address: { type: String },   
    isAvailable: { type: Boolean, default: false },
}, { timestamps: true });

const AssetVendor = mongoose.model('AssetVendor', assetVendorSchema);
export default AssetVendor;
