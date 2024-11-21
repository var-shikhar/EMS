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
                firstName: cur.studentID.firstName ?? '',
                lastName: cur.studentID.lastName ?? '',
                displayName: cur.studentID.displayName ?? '',
                uniqueCode: cur.studentID.uniqueID ?? '',
                gender: cur.studentID.gender,
                dob: cur.dob,
                admissionNo: cur.admissionNo,
                admissionDate: cur.admissionDate,
                currentClass: cur.currentClass ? cur.currentClass._id : '',
                currentClassName: cur.currentClass ? cur.currentClass.className : '',
                currentSection: cur.section ? cur.section._id : '',
                currentSectionName: cur.section ? cur.section.sectionName : '',
                isActive: cur.studentID.isActive ?? false
            })
            return acc;
        }, []) : [];

        console.log(studentList)
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

export default {
    getStudentList, postNewStudent
}