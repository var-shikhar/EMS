import mongoose from 'mongoose';

const academicRoleSchema = new mongoose.Schema({
    staffID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    qualifications: { 
        degree: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Degree', 
            required: true  
        },
        institution: { type: String, required: true },
        yearOfPassing: { type: Number, required: true },
        score: { type: Number, default: 0 }
    },
    employmentDate: { type: Date, required: true },
    appointedSalary: { type: Number },
    yearsOfExperience: { type: Number },
}, { timestamps: true });
  
const AcademicStaffRole =  mongoose.model('AcademicStaffRole', academicRoleSchema);
  
export default AcademicStaffRole