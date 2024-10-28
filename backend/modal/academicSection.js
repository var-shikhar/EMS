import mongoose from 'mongoose';

const academicSectionSchema = mongoose.Schema({
    classID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'AcademicClass', 
        required: true 
    },
    sectionTeacher: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: false 
    },
    sectionName: { 
        type: String, 
        required: true 
    },
    sectionCode: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

const AcademicSection= mongoose.model('AcademicSection', academicSectionSchema);

export default AcademicSection
  