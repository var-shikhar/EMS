import mongoose from 'mongoose';

const degreeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    durationYears: { type: Number, required: true },
    description: { type: String },
    department: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Department', 
        required: true 
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Degree = mongoose.model('Degree', degreeSchema);
export default Degree;
