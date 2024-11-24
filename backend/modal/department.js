import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    headOfDepartment: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: false 
    },
    description: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Department = mongoose.model('Department', departmentSchema);
export default Department;
