import mongoose from 'mongoose';

const academicRoleSchema = new mongoose.Schema({
    educatorID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    bio: { type: String },
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
    department: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Department', 
        required: true 
    },
    isHOD: { type: Boolean, default: false },
    previousExperience: [{
        institutionName: { type: String },
        role: { type: String },
        stDate: { type: Date },
        edDate: { type: Date },
    }],
}, { timestamps: true });
  
const EducatorRole =  mongoose.model('EducatorRole', academicRoleSchema);
  
export default EducatorRole