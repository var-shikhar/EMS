import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    displayName: { 
        type: String, 
        required: true 
    },
    userPhone: { 
        type: String,
    },
    userEmail: { 
        type: String,
    },
    gender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Gender', 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    userRole: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserRole', 
        required: true 
    },
    isActive: {
        type: Boolean, 
        default: false 
    },
    isBlocked: { 
        type: Boolean, 
        default: false 
    },
    uniqueID: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User 
