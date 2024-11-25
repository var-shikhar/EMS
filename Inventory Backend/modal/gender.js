import mongoose from 'mongoose';

const genderSchema = new mongoose.Schema({
    genderName: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

const Gender = mongoose.model('Gender', genderSchema);

export default Gender    