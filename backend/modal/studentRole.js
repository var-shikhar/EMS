import mongoose from 'mongoose';

const studentRoleSchema = new mongoose.Schema({
    studentID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    dob: { 
        type: Date, 
        required: true 
    },
    admissionNo: { 
        type: String, 
        required: true 
    },
    admissionDate: { 
        type: Date, 
        required: true 
    },
    currentClass: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'AcademicClass', 
        required: true 
    },
    section: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'AcademicSection', 
        required: true 
    },
    parentID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: false 
    },
    academicHistory: [{
        class: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'AcademicClass', 
            required: true 
        },
        section: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'AcademicSection', 
            required: true 
        },
        academicYear: { type: String }
    }]
}, { timestamps: true });
  
const StudentRole =  mongoose.model('StudentRole', studentRoleSchema);
  
export default StudentRole