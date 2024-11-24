import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import constant from "../../constant/constant.js";
import commonFn from "../../helper/common.js";
import User from "../../modal/users.js";
import UserRole from "../../modal/role.js";

dotenv.config();

const { SALT } = process.env;
const { RouteCode } = constant;
const { generateUniqueID } = commonFn;

const getUserList = async (req, res) => {
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

        const nonAcademicNonDefaultRoles = await UserRole.find({$and: [ { isAcademicRole: { $ne: true } }, { isDefaultRole: { $ne: true } } ]}).select('_id');
        const roleIds = nonAcademicNonDefaultRoles.map(role => role._id);
        const foundUserList = await User.find({userRole: { $in: roleIds }}).populate('userRole');

        const userList = foundUserList?.length > 0 ? foundUserList.reduce((acc, cur) => {
            acc.push({ 
                id: cur._id,
                firstName: cur.firstName ?? '',
                lastName: cur.lastName ?? '',
                displayName: cur.displayName ?? '',
                uniqueID: cur.uniqueID ?? '',
                gender: cur.gender ?? '',
                roleID: cur.userRole._id,
                roleName: cur.userRole.roleName,
                phone: cur.userPhone ?? '',
                email: cur.userEmail ?? '',
                isActive: cur.isActive ?? false
            })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(userList);
    } catch (err) {
        console.error('Error Getting Other Users List', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const postNewUser = async (req, res) => {
    const userID = req.user;
    const { firstNameValue, lastNameValue, displayNameValue, genderValue, passwordValue, roleValue, phoneValue, emailValue } = req.body;
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
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Other User Profile has added successfully!' });
    } catch (err) {
        console.error('Error Creating New Other User:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putUserDetails = async (req, res) => {
    const adminUserID = req.user;
    const { userID, firstNameValue, lastNameValue, displayNameValue, genderValue, passwordValue, roleValue,  phoneValue, emailValue } = req.body;
    try {
        const foundUser = await User.findById(adminUserID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }
        
        const foundOtherUser = await User.findById(userID);
        if(!foundOtherUser) return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Other User not found! Try again later!'});
        

        if(foundOtherUser.displayName !== displayNameValue){
            const foundDisplayName = await User.findOne({ displayName: displayNameValue });
            if(foundDisplayName) return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Display name already exists! Try different name!'});
        }

        if(foundOtherUser.userEmail !== emailValue){
            const foundEmail = await User.findOne({ userEmail: emailValue });
            if(foundEmail) return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Email already exists! Try different email!'});
        }

        if(foundOtherUser.userPhone !== phoneValue){
            const foundPhone = await User.findOne({ userPhone: phoneValue });
            if(foundPhone) return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Phone already exists! Try different number!'});
        }

        foundOtherUser.firstName = firstNameValue ?? foundOtherUser.firstName;
        foundOtherUser.lastName = lastNameValue ?? foundOtherUser.lastName;
        foundOtherUser.displayName = displayNameValue ?? foundOtherUser.displayName;
        foundOtherUser.gender = genderValue ?? foundOtherUser.gender;
        foundOtherUser.userRole = roleValue ?? foundOtherUser.userRole;
        foundOtherUser.userPhone = phoneValue ?? foundOtherUser.userPhone;
        foundOtherUser.userEmail = emailValue ?? foundOtherUser.userEmail;

        
        if(passwordValue.trim() !== ''){
            const hashedPassword = await bcrypt.hash(passwordValue.toString(), Number(SALT));
            foundOtherUser.password = hashedPassword;
        } 

        await foundOtherUser.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: "Other User's profile has updated successfully!" });
    } catch (err) {
        console.error('Error Updating Other User Profile:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putUserStatus = async (req, res) => {
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

        const foundOtherUser = await User.findById(id);
        if(!foundOtherUser) return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Other User not found! Try again later!'});
        
        foundOtherUser.isActive = value ?? false;
        await foundOtherUser.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: `Other User has ${value ? 'Activated' : 'De-Activated'} successfully!` });
    } catch (err) {
        console.error('Error Updating Status of Other User:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const deleteUser = async (req, res) => {
    const userID = req.user;
    const { otherUserID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission) return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        
        const foundOtherUser = await User.findById(otherUserID);
        if(!foundOtherUser) return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Other User not found! Try again later!'});
        

        await foundOtherUser.deleteOne();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Other User Profile has deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};



export default {
    getUserList, postNewUser, putUserDetails, putUserStatus, deleteUser
}