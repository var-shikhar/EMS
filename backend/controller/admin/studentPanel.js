import constant from "../../constant/constant.js";
import UserRole from "../../modal/role.js";
import StudentRole from "../../modal/studentRole.js";
import User from "../../modal/users.js";
import commonFn from "../../helper/common.js";

const { RouteCode } = constant;
const { generateUniqueID } = commonFn;


const getStudentList = async (req, res) => {
    const userID = req.user;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundStudents = await StudentRole.find().populate('studentID').populate('currentClass').populate('section');
        const studentList = foundStudents?.length > 0 ? foundStudents.reduce((acc, cur) => {
            acc.push({ 
                id: cur._id,
                firstName: cur.studentID?.firstName ?? '',
                lastName: cur.studentID?.lastName ?? '',
                displayName: cur.studentID?.displayName ?? '',
                uniqueCode: cur.studentID?.uniqueID ?? '',
                gender: cur.studentID?.gender,
                dob: cur.dob,
                admissionNo: cur.admissionNo,
                admissionDate: cur.admissionDate,
                currentClass: cur.currentClass ? cur.currentClass._id : '',
                currentClassName: cur.currentClass ? cur.currentClass.className : '',
                currentSection: cur.section ? cur.section._id : '',
                currentSectionName: cur.section ? cur.section.sectionName : '',
                isActive: cur.studentID?.isActive ?? false
            })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(studentList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const postNewStudent = async (req, res) => {
    const userID = req.user;
    const { firstNameValue, lastNameValue, displayNameValue, genderValue, passwordValue, currentSectionValue, currentClassValue, admissionDateValue, admissionNoValue, dobValue } = req.body;
    
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }
        
        const foundDisplayName = await User.findOne({ displayName: displayNameValue });
        if(foundDisplayName) return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Display-name already exists, Try another name!'});

        const foundRole = await UserRole.findOne({ roleName: 'Student' });
        if (!foundRole) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Something went wrong, Try again later!' });

        const foundAdmissionNo = await StudentRole.findOne({ admissionNo: admissionNoValue });
        if (foundAdmissionNo) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Academic-no already exists!' });


        let uniqueID;
        let attempts = 0;
        const maxAttempts = 10;
        let idExists = true;

        while (idExists && attempts < maxAttempts) {
            uniqueID = generateUniqueID();
            const existingID = await User.findOne({ uniqueID });
            if (!existingID) idExists = false;
            attempts++;
        }

        if (idExists) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Something went wrong, Try again later!' });

        const newUser = new User({
            firstName: firstNameValue,
            lastName: lastNameValue,
            displayName: displayNameValue,
            gender: genderValue,
            password: passwordValue,
            userRole: foundRole._id,
            isActive: true,
            isBlocked: false,
            uniqueID: uniqueID,
        });

        await newUser.save();

        const newStudentProfile = new StudentRole({
            studentID: newUser._id,
            dob: new Date(dobValue),
            admissionNo: admissionNoValue,
            admissionDate: new Date(admissionDateValue),
            currentClass: currentClassValue,
            section: currentSectionValue,
            academicHistory: [{
                class: currentClassValue,
                section: currentSectionValue
            }]
        });

        await newStudentProfile.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Student Profile has added successfully!' });
    } catch (err) {
        console.error('Error Creating New Role:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putStudentDetails = async (req, res) => {
    const userID = req.user;
    const { studentID, firstNameValue, lastNameValue, displayNameValue, genderValue, passwordValue, currentSectionValue, currentClassValue, admissionDateValue, admissionNoValue, dobValue } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }
        
        const foundStudent = await StudentRole.findById(studentID);
        if(!foundStudent) return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Student not found! Try again later!'});

        const foundStudentUser = await User.findById(foundStudent.studentID);
        if(!foundStudentUser) return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Student not found! Try again later!'});
        

        if(foundStudentUser.displayName !== displayNameValue){
            const foundDisplayName = await User.findOne({ displayName: displayNameValue });
            if(foundDisplayName) return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Display name already exists! Try different name!'});
        }

        if(foundStudent.admissionNo !== admissionNoValue){
            const foundAdmissionNo = await StudentRole.findOne({ admissionNo: admissionNoValue });
            if(foundAdmissionNo) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Academic-no already exists!' });
        }

        foundStudentUser.firstName = firstNameValue ?? foundStudentUser.firstName;
        foundStudentUser.lastName = lastNameValue ?? foundStudentUser.lastName;
        foundStudentUser.displayName = displayNameValue ?? foundStudentUser.displayName;
        foundStudentUser.gender = genderValue ?? foundStudentUser.gender;
        
        foundStudent.dob = new Date(dobValue) ?? foundStudent.dob;
        foundStudent.admissionNo = admissionNoValue ?? foundStudent.admissionNo;
        foundStudent.admissionDate = new Date(admissionDateValue) ?? foundStudent.admissionDate;
        foundStudent.currentClass = currentClassValue ?? foundStudent.currentClass;
        foundStudent.section = currentSectionValue ?? foundStudent.section;

        if(passwordValue.trim() !== '') foundStudentUser.password = passwordValue ?? foundStudentUser.password;

        await foundStudent.save();
        await foundStudentUser.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Student Profile has updated successfully!' });
    } catch (err) {
        console.error('Error Creating New Role:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putStudentStatus = async (req, res) => {
    const userID = req.user;
    const { id, value } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }
        
        const foundStudent = await StudentRole.findById(id);
        if(!foundStudent) return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Student not found! Try again later!'});

        const foundStudentUser = await User.findById(foundStudent.studentID);
        if(!foundStudentUser) return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Student not found! Try again later!'});
        
        foundStudentUser.isActive = value ?? false;
        await foundStudentUser.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: `Student has ${value ? 'Activated' : 'De-Activated'} successfully!` });
    } catch (err) {
        console.error('Error Creating New Role:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const deleteStudent = async (req, res) => {
    const userID = req.user;
    const { studentID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission) return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        
        const foundStudent = await StudentRole.findById(studentID);
        if(!foundStudent) return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Student not found! Try again later!'});

        const foundStudentUser = await User.findById(foundStudent.studentID);
        if(!foundStudentUser) return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Student not found! Try again later!'});
        

        await foundStudent.deleteOne();
        await foundStudentUser.deleteOne();

        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Student Profile has been deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

export default {
    getStudentList, postNewStudent, putStudentDetails, putStudentStatus, deleteStudent
}