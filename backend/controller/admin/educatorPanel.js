import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import constant from "../../constant/constant.js";
import commonFn from "../../helper/common.js";
import EducatorRole from "../../modal/educatorRole.js";
import User from "../../modal/users.js";
import UserRole from "../../modal/role.js";

dotenv.config();

const { SALT } = process.env;
const { RouteCode } = constant;
const { generateUniqueID } = commonFn;

const getEducatorList = async (req, res) => {
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

        const foundEducators = await EducatorRole.find()
        .populate({
            path: 'educatorID',
            populate: {
                path: 'userRole',
                model: 'UserRole'
            }
        }).populate('qualifications.degree').populate('department');

        const educatorList = foundEducators?.length > 0 ? foundEducators.reduce((acc, cur) => {
            acc.push({ 
                id: cur._id,
                firstName: cur.educatorID?.firstName ?? '',
                lastName: cur.educatorID?.lastName ?? '',
                displayName: cur.educatorID?.displayName ?? '',
                uniqueID: cur.educatorID?.uniqueID ?? '',
                gender: cur.educatorID?.gender ?? '',
                roleID: cur.educatorID?.userRole._id,
                roleName: cur.educatorID?.userRole.roleName,
                departmentID: cur.department._id ?? '',
                departmentName: cur.department.name ?? '',
                phone: cur.educatorID?.userPhone ?? '',
                email: cur.educatorID?.userEmail ?? '',
                bio: cur.bio ?? '',
                qualificationID: cur.qualifications.degree._id ?? '',
                qualificationName: cur.qualifications.degree.code ?? '',
                passingYear: cur.qualifications.yearOfPassing ?? '',
                score: cur.qualifications.score ?? '',
                institutionName: cur.qualifications.institution ?? '',
                employmentDate: cur.employmentDate ?? '',
                employmentSalary: cur.appointedSalary ?? '',
                yearsOfExp: cur.yearsOfExperience ?? '',
                expOBJ: cur.previousExperience?.map(item => {
                    return {
                        expInstitueName: item.institutionName ?? '',
                        jobRole: item.role ?? '',
                        startDate: item.stDate ?? '',
                        endDate: item.edDate ?? '',
                    }
                }) ?? [], 
                isActive: cur.educatorID?.isActive ?? false
            })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(educatorList);
    } catch (err) {
        console.error('Error Getting Educator List', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const postNewEducator = async (req, res) => {
    const userID = req.user;
    const { firstNameValue, lastNameValue, displayNameValue, genderValue, passwordValue, roleValue, departmentValue, phoneValue, emailValue, bioValue, qualificationValue, passingYearValue, scoreValue, institutionNameValue, employmentDateValue, employmentSalaryValue, experienceList, yearsOfExpValue } = req.body;
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

        const newEducatorProfile = new EducatorRole({
            educatorID: newUser._id,
            bio: bioValue,
            department: departmentValue,
            yearsOfExperience: yearsOfExpValue,
            qualifications: {
                degree: qualificationValue,
                institution: institutionNameValue,
                yearOfPassing: passingYearValue,
                score: scoreValue,
            },
        });

        if(employmentDateValue !== '') newEducatorProfile.employmentDate = new Date(employmentDateValue);
        if(employmentSalaryValue !== '') newEducatorProfile.appointedSalary = employmentSalaryValue;

        if(Array.isArray(experienceList) && experienceList?.length > 0){
            experienceList.forEach(item => newEducatorProfile.previousExperience.push({ institutionName: item.expInstitueName, role: item.jobRole, stDate: new Date(item.startDate), edDate: new Date(item.endDate) }));
        } 

        await newEducatorProfile.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Educator Profile has added successfully!' });
    } catch (err) {
        console.error('Error Creating New Educator:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putEducatorDetails = async (req, res) => {
    const userID = req.user;
    const { educatorID, firstNameValue, lastNameValue, displayNameValue, genderValue, passwordValue, roleValue, departmentValue, phoneValue, emailValue, bioValue, qualificationValue, passingYearValue, scoreValue, institutionNameValue, employmentDateValue, employmentSalaryValue, experienceList, yearsOfExpValue } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }
        
        const foundEducator = await EducatorRole.findById(educatorID);
        if(!foundEducator) return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Educator not found! Try again later!'});

        const foundEducatorUser = await User.findById(foundEducator.educatorID);
        if(!foundEducatorUser) return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Educator not found! Try again later!'});
        

        if(foundEducatorUser.displayName !== displayNameValue){
            const foundDisplayName = await User.findOne({ displayName: displayNameValue });
            if(foundDisplayName) return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Display name already exists! Try different name!'});
        }

        if(foundEducatorUser.userEmail !== emailValue){
            const foundEmail = await User.findOne({ userEmail: emailValue });
            if(foundEmail) return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Email already exists! Try different email!'});
        }

        if(foundEducatorUser.userPhone !== phoneValue){
            const foundPhone = await User.findOne({ userPhone: phoneValue });
            if(foundPhone) return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Phone already exists! Try different number!'});
        }

        foundEducatorUser.firstName = firstNameValue ?? foundEducatorUser.firstName;
        foundEducatorUser.lastName = lastNameValue ?? foundEducatorUser.lastName;
        foundEducatorUser.displayName = displayNameValue ?? foundEducatorUser.displayName;
        foundEducatorUser.gender = genderValue ?? foundEducatorUser.gender;
        foundEducatorUser.userRole = roleValue ?? foundEducatorUser.userRole;
        foundEducatorUser.userPhone = phoneValue ?? foundEducatorUser.userPhone;
        foundEducatorUser.userEmail = emailValue ?? foundEducatorUser.userEmail;

        
        foundEducator.department = departmentValue ?? foundEducator.department;
        foundEducator.bio = bioValue ?? foundEducator.bio;
        foundEducator.qualifications.degree = qualificationValue ?? foundEducator.qualifications.degree;
        foundEducator.qualifications.yearOfPassing = passingYearValue ?? foundEducator.qualifications.yearOfPassing;
        foundEducator.qualifications.score = scoreValue ?? foundEducator.qualifications.score;
        foundEducator.qualifications.institution = institutionNameValue ?? foundEducator.qualifications.institution;
        foundEducator.employmentDate = new Date(employmentDateValue) ?? foundEducator.employmentDate;
        foundEducator.appointedSalary = employmentSalaryValue ?? foundEducator.appointedSalary;
        foundEducator.yearsOfExperience = yearsOfExpValue ?? foundEducator.yearsOfExperience;

    
        if(passwordValue.trim() !== ''){
            const hashedPassword = await bcrypt.hash(passwordValue.toString(), Number(SALT));
            foundEducatorUser.password = hashedPassword;
        } 

        if(Array.isArray(experienceList) && experienceList?.length > 0){
            foundEducator.previousExperience = experienceList.map(item => ({ institutionName: item.expInstitueName, role: item.jobRole, stDate: new Date(item.startDate), edDate: new Date(item.endDate)}) );
        }
        

        await foundEducator.save();
        await foundEducatorUser.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Educator Profile has updated successfully!' });
    } catch (err) {
        console.error('Error Updating Educator Profile:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putEducatorStatus = async (req, res) => {
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
        
        const foundEducator = await EducatorRole.findById(id);
        if(!foundEducator) return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Educator not found! Try again later!'});

        const foundEducatorUser = await User.findById(foundEducator.educatorID);
        if(!foundEducatorUser) return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Educator not found! Try again later!'});
        
        foundEducatorUser.isActive = value ?? false;
        await foundEducatorUser.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: `Educator has ${value ? 'Activated' : 'De-Activated'} successfully!` });
    } catch (err) {
        console.error('Error Updating Status of Educator:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const deleteEducator = async (req, res) => {
    const userID = req.user;
    const { educatorID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission) return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        
        const foundEducator = await EducatorRole.findById(educatorID);
        if(!foundEducator) return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Educator not found! Try again later!'});

        const foundEducatorUser = await User.findById(foundEducator.educatorID);
        if(!foundEducatorUser) return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Educator not found! Try again later!'});
        

        await foundEducator.deleteOne();
        await foundEducatorUser.deleteOne();

        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Educator Profile has deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};



// Get Teachers List
const getTeachersList = async (req, res) => {
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

        const foundRole = await UserRole.findOne({ roleName: 'Teacher' });
        if(!foundRole) return res.status(RouteCode.EXPECTATION_FAILED.statusCode).json({ message: 'Something went wrong, Try again!' });

        const foundTeachers = await User.find({ userRole: foundRole._id, isActive: true });
        const teacherList = foundTeachers?.length > 0 ? foundTeachers.reduce((acc, cur) => {
            acc.push({ 
                id: cur._id,
                name: cur.firstName + ' ' + cur.lastName ?? '',
            })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(teacherList);
    } catch (err) {
        console.error('Error Getting Teacher List', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};


export default {
    getEducatorList, postNewEducator, putEducatorDetails, putEducatorStatus, deleteEducator, getTeachersList
}