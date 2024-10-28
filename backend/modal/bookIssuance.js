import mongoose from 'mongoose';

const bookIssuanceSchema = new mongoose.Schema({
    bookID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'BookDetail', 
        required: true 
    },
    userID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    issuedDate: { 
        type: Date, 
        required: true  
    },
    dueDate: { 
        type: Date, 
        required: true 
    },
    returnDate: { type: Date },
    totalAmount: { 
        type: Number, 
        default: 0 
    },
    paidAmount: { 
        type: Number,  
        default: 0 
    },
    paymentLog:[{
        amount: { type: Number },
        paidAt: { type: Date }
    }],
    totalBookRent: { 
        type: Number,  
        default: 0 
    },
    fine: { 
        type: Number, 
        default: 0 
    },
    issuedQuantity: {
        type: Number,
        default: 1,
        required: true
    },
    remarks: {
        type: String,
    },
    hasMembership: {
        type: Boolean
    },
    membershipEndDate: {
        type: Date
    },
    lostAmount: {
        type: Number,
    },
    status: { 
        type: String, 
        enum: ['Issued', 'Returned', 'Lost'], 
        required: true 
    },
    paymentStatus: { 
        type: String, 
        enum: ['Paid', 'Partially-Paid'], 
    }
}, { timestamps: true });
  
const BookIssuance = mongoose.model('BookIssuance', bookIssuanceSchema);
  
export default BookIssuance