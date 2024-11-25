import mongoose from 'mongoose';

const assetOrderSchema = new mongoose.Schema({
    orderDate: { type: Date, default: Date.now },
    vendorID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'AssetVendor', 
        required: true
    },
    orderNote: { type: String },
    orderedItems: [{
        assetID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Asset',
            required: true,
        },
        assetPrice: { type: Number, default: 0 },
        assetQuantity: { type: Number, default: 0 },
    }],
    orderAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    finalAmount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Completed'],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Partially Paid', 'Paid'],
        default: 'Pending'
    },
}, { timestamps: true });

const AssetOrder = mongoose.model('AssetOrder', assetOrderSchema);
export default AssetOrder;