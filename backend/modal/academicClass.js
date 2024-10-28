import mongoose from 'mongoose';

const academicClassSchema = mongoose.Schema({
    className: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

const AcademicClass = mongoose.model('AcademicClass', academicClassSchema);
  
export default AcademicClass