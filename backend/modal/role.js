import mongoose from 'mongoose';

const userRoleSchema = new mongoose.Schema({
    roleName: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });
  
const UserRole = mongoose.model('UserRole', userRoleSchema);
  
export default UserRole