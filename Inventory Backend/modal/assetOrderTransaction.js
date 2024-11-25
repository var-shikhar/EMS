import mongoose from 'mongoose';

const assetOrderTransactionSchema = new mongoose.Schema({
    orderID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'AssetOrder', 
        required: true
    },
    transactionDate: { type: Date, default: Date.now },
    transactionAmount: { type: Number, default: 0 },
    remarks: { type: String },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    }
}, { timestamps: true });

const AssetOrderTransaction = mongoose.model('AssetOrderTransaction', assetOrderTransactionSchema);
export default AssetOrderTransaction;