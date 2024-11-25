import mongoose from 'mongoose';

const assetTransactionSchema = new mongoose.Schema({
    assetID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Asset', 
        required: true
    },
    transactionDate: { type: Date, default: Date.now },
    transactionQuantity: { type: Number, default: 0 },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    remarks: { type: String },
    status: { 
        type: String,
        enum: ['Lost', 'Damaged', 'Used'],
        default: 'Used'
    },
}, { timestamps: true });

const AssetTransaction = mongoose.model('AssetTransaction', assetTransactionSchema);
export default AssetTransaction;