import mongoose from 'mongoose';

const userRoleSchema = new mongoose.Schema({
    roleName: { 
        type: String, 
        required: true 
    },
    isAcademicRole: { 
        type: Boolean, 
        required: false 
    },
    isDefaultRole: { 
        type: Boolean, 
        required: false 
    },
}, { timestamps: true });
  
const UserRole = mongoose.model('UserRole', userRoleSchema);
  
export default UserRole