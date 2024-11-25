import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    userID: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    otp: { 
        type: String, 
        required: true 
    },
    expiryTime: { 
        type: Date, 
        required: true 
    }
});

const OTP = mongoose.model('OTP', otpSchema);
export default OTP;
