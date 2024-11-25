import mongoose from 'mongoose';

const assetCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    isArchived: { type: Boolean, default: false }
}, { timestamps: true });

const AssetCategory = mongoose.model('AssetCategory', assetCategorySchema);
export default AssetCategory;