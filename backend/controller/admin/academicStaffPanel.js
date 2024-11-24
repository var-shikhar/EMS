import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import constant from "../../constant/constant.js";
import commonFn from "../../helper/common.js";
import AcademicStaffRole from "../../modal/academicRole.js";
import User from "../../modal/users.js";

dotenv.config();

const { SALT } = process.env;
const { RouteCode } = constant;
const { generateUniqueID } = commonFn;

const getAcademicStaffList = async (req, res) => {
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

        const foundStaffList = await AcademicStaffRole.find().populate({ path: 'staffID', populate: { path: 'userRole', model: 'UserRole' }}).populate('qualifications.degree');
        const staffList = foundStaffList?.length > 0 ? foundStaffList.reduce((acc, cur) => {
            acc.push({ 
                id: cur._id,
                firstName: cur.staffID?.firstName ?? '',
                lastName: cur.staffID?.lastName ?? '',
                displayName: cur.staffID?.displayName ?? '',
                uniqueID: cur.staffID?.uniqueID ?? '',
                gender: cur.staffID?.gender ?? '',
                roleID: cur.staffID?.userRole._id,
                roleName: cur.staffID?.userRole.roleName,
                phone: cur.staffID?.userPhone ?? '',
                email: cur.staffID?.userEmail ?? '',
                qualificationID: cur.qualifications.degree._id ?? '',
                qualificationName: cur.qualifications.degree.code ?? '',
                passingYear: cur.qualifications.yearOfPassing ?? '',
                score: cur.qualifications.score ?? '',
                institutionName: cur.qualifications.institution ?? '',
                employmentDate: cur.employmentDate ?? '',
                employmentSalary: cur.appointedSalary ?? '',
                yearsOfExp: cur.yearsOfExperience ?? '',
                isActive: cur.staffID?.isActive ?? false
            })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(staffList);
    } catch (err) {
        console.error('Error Getting Academic Staff List', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const postNewAcadStaff = async (req, res) => {
    const userID = req.user;
    const { firstNameValue, lastNameValue, displayNameValue, genderValue, passwordValue, roleValue, phoneValue, emailValue, qualificationValue, passingYearValue, scoreValue, institutionNameValue, employmentDateValue, employmentSalaryValue, yearsOfExpValue } = req.body;
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

        const foundEmail = await User.findOne({ userEmail: emailValue });
        if(foundEmail) return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Email already exists, Try another email!'});

        const foundPhone = await User.findOne({ userPhone: phoneValue });
        if(foundPhone) return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Phone No already exists, Try another number!'});

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
        const hashedPassword = await bcrypt.hash(passwordValue.toString(), Number(SALT));

        const newUser = new User({
            firstName: firstNameValue,
            lastName: lastNameValue,
            displayName: displayNameValue,
            gender: genderValue,
            userPhone:  phoneValue,
            userEmail: emailValue,
            userRole: roleValue,
            isActive: true,
            isBlocked: false,
            uniqueID: uniqueID,
            password: hashedPassword,
        });

        await newUser.save();

        const newAcadStaffProfile = new AcademicStaffRole({
            staffID: newUser._id,
            yearsOfExperience: yearsOfExpValue,
            qualifications: {
                degree: qualificationValue,
                institution: institutionNameValue,
                yearOfPassing: passingYearValue,
                score: scoreValue,
            },
        });

        if(employmentDateValue !== '') newAcadStaffProfile.employmentDate = new Date(employmentDateValue);
        if(employmentSalaryValue !== '') newAcadStaffProfile.appointedSalary = employmentSalaryValue;

        await newAcadStaffProfile.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Academic Staff Profile has added successfully!' });
    } catch (err) {
        console.error('Error Creating New Academic Staff:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putAcadStaffDetails = async (req, res) => {
    const adminUserID = req.user;
    const { userID, firstNameValue, lastNameValue, displayNameValue, genderValue, passwordValue, roleValue, departmentValue, phoneValue, emailValue, bioValue, qualificationValue, passingYearValue, scoreValue, institutionNameValue, employmentDateValue, employmentSalaryValue, experienceList, yearsOfExpValue } = req.body;
    try {
        const foundUser = await User.findById(adminUserID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }
        
        const foundAcadStaff = await AcademicStaffRole.findById(userID);
        if(!foundAcadStaff) return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Academic Staff not found! Try again later!'});

        const foundAcadStaffUser = await User.findById(foundAcadStaff.staffID);
        if(!foundAcadStaffUser) return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Academic Staff not found! Try again later!'});
        

        if(foundAcadStaffUser.displayName !== displayNameValue){
            const foundDisplayName = await User.findOne({ displayName: displayNameValue });
            if(foundDisplayName) return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Display name already exists! Try different name!'});
        }

        if(foundAcadStaffUser.userEmail !== emailValue){
            const foundEmail = await User.findOne({ userEmail: emailValue });
            if(foundEmail) return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Email already exists! Try different email!'});
        }

        if(foundAcadStaffUser.userPhone !== phoneValue){
            const foundPhone = await User.findOne({ userPhone: phoneValue });
            if(foundPhone) return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Phone already exists! Try different number!'});
        }

        foundAcadStaffUser.firstName = firstNameValue ?? foundAcadStaffUser.firstName;
        foundAcadStaffUser.lastName = lastNameValue ?? foundAcadStaffUser.lastName;
        foundAcadStaffUser.displayName = displayNameValue ?? foundAcadStaffUser.displayName;
        foundAcadStaffUser.gender = genderValue ?? foundAcadStaffUser.gender;
        foundAcadStaffUser.userRole = roleValue ?? foundAcadStaffUser.userRole;
        foundAcadStaffUser.userPhone = phoneValue ?? foundAcadStaffUser.userPhone;
        foundAcadStaffUser.userEmail = emailValue ?? foundAcadStaffUser.userEmail;

        
        foundAcadStaff.qualifications.degree = qualificationValue ?? foundAcadStaff.qualifications.degree;
        foundAcadStaff.qualifications.yearOfPassing = passingYearValue ?? foundAcadStaff.qualifications.yearOfPassing;
        foundAcadStaff.qualifications.score = scoreValue ?? foundAcadStaff.qualifications.score;
        foundAcadStaff.qualifications.institution = institutionNameValue ?? foundAcadStaff.qualifications.institution;
        foundAcadStaff.employmentDate = new Date(employmentDateValue) ?? foundAcadStaff.employmentDate;
        foundAcadStaff.appointedSalary = employmentSalaryValue ?? foundAcadStaff.appointedSalary;
        foundAcadStaff.yearsOfExperience = yearsOfExpValue ?? foundAcadStaff.yearsOfExperience;

    
        if(passwordValue.trim() !== ''){
            const hashedPassword = await bcrypt.hash(passwordValue.toString(), Number(SALT));
            foundAcadStaffUser.password = hashedPassword;
        } 

        await foundAcadStaff.save();
        await foundAcadStaffUser.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: "Academic Staff's profile has updated successfully!" });
    } catch (err) {
        console.error('Error Updating Academic Staff Profile:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putAcadStaffStatus = async (req, res) => {
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
        
        const foundAcadStaff = await AcademicStaffRole.findById(id);
        if(!foundAcadStaff) return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Academic Staff not found! Try again later!'});

        const foundAcadStaffUser = await User.findById(foundAcadStaff.staffID);
        if(!foundAcadStaffUser) return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Academic Staff not found! Try again later!'});
        
        foundAcadStaffUser.isActive = value ?? false;
        await foundAcadStaffUser.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: `Academic Staff has ${value ? 'Activated' : 'De-Activated'} successfully!` });
    } catch (err) {
        console.error('Error Updating Status of Academic Staff:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const deleteAcadStaff = async (req, res) => {
    const userID = req.user;
    const { staffID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission) return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        
        const foundAcadStaff = await AcademicStaffRole.findById(staffID);
        if(!foundAcadStaff) return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Academic Staff not found! Try again later!'});

        const foundAcadStaffUser = await User.findById(foundAcadStaff.staffID);
        if(!foundAcadStaffUser) return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Academic Staff not found! Try again later!'});
        

        await foundAcadStaff.deleteOne();
        await foundAcadStaffUser.deleteOne();

        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Academic Staff Profile has deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};



export default {
    getAcademicStaffList, postNewAcadStaff, putAcadStaffDetails, putAcadStaffStatus, deleteAcadStaff
}