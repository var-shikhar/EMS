import constant from "../../constant/constant.js";
import Department from "../../modal/department.js";
import UserRole from "../../modal/role.js";
import User from "../../modal/users.js";

const { RouteCode } = constant;

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

        const defaultRoles = await UserRole.find({ $and: [{isDefaultRole: true}, { roleName: { $ne: 'Student' } }] }).select('_id');

        const roleIds = defaultRoles.map(role => role._id);
        const foundUserList = await User.find({userRole: { $in: roleIds }}).populate('userRole');

        const userList = foundUserList?.length > 0 ? foundUserList.reduce((acc, cur) => {
            acc.push({ id: cur._id, name: cur.firstName + cur.lastName, role: cur.userRole?.roleName })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(userList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const getDepartmentList = async (req, res) => {
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

        const foundDepartments = await Department.find().populate('headOfDepartment');
        const departmentList = foundDepartments?.length > 0 ? foundDepartments.reduce((acc, cur) => {
            acc.push({ 
                id: cur._id, 
                name: cur.name, 
                code: cur.code,
                hodName: cur.headOfDepartment?.firstName + cur.headOfDepartment?.lastName ?? '', 
                hodID: cur.headOfDepartment?._id ?? '',
                description: cur.description,
                isActive: cur.isActive
            })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(departmentList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const postDepartment = async (req, res) => {
    const userID = req.user;
    const { departmentID, departmentNameValue, departmentCodeValue, departmentDescriptionValue, departmentHeadValue, departmentIsActiveValue } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundDept = await Department.findOne({ name: departmentNameValue });
        if (foundDept) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Department Name already exists!' });

        const foundDeptCode = await Department.findOne({ code: departmentCodeValue });
        if (foundDeptCode) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Department Code already exists!' });

        const newDepartment = new Department({ 
            name: departmentNameValue,
            code: departmentCodeValue,
            description: departmentDescriptionValue,
            headOfDepartment: departmentHeadValue,
            isActive: departmentIsActiveValue
        });
        await newDepartment.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'New Department has added successfully' });
    } catch (err) {
        console.error('Error Creating New Department:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putDepartmentDetails = async (req, res) => {
    const userID = req.user;
    const { departmentID, departmentNameValue, departmentCodeValue, departmentDescriptionValue, departmentHeadValue, departmentIsActiveValue } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundDepartment = await Department.findById(departmentID);
        if (!foundDepartment) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Department not found, Try again!' });

        if(foundDepartment.name !== departmentNameValue){
            const foundSimilarName = await Department.findOne({ name: departmentNameValue });
            if (foundSimilarName) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Department name already exists, Try another name!' });
        }

        if(foundDepartment.code !== departmentCodeValue){
            const foundSimilarCode = await Department.findOne({ code: departmentCodeValue });
            if (foundSimilarCode) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Department code already exists, Try another code!' });
        }

        foundDepartment.name = departmentNameValue ?? foundDepartment.name;
        foundDepartment.code = departmentCodeValue ?? foundDepartment.code;
        foundDepartment.description = departmentDescriptionValue ?? foundDepartment.description;
        foundDepartment.headOfDepartment = departmentHeadValue ?? foundDepartment.headOfDepartment;
        foundDepartment.isActive = departmentIsActiveValue ?? false;

        await foundDepartment.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Department has updated successfully' });
    } catch (err) {
        console.error('Error Updating Department Details:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const deleteDepartment = async (req, res) => {
    const userID = req.user;
    const { departmentID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });

        const hasPermission = true;
        if(!hasPermission) return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });

        const foundDepartment = await Department.findById(departmentID);
        if (!foundDepartment) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Department not found.' });

        await foundDepartment.deleteOne();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Department has been deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const getShDeptList = async (req, res) => {
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

        const foundDepartments = await Department.find({isActive: true});
        const departmentList = foundDepartments?.length > 0 ? foundDepartments.reduce((acc, cur) => {
            acc.push({ 
                id: cur._id, 
                name: cur.name, 
            })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(departmentList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

export default {
    getDepartmentList, getShDeptList, getUserList, postDepartment, putDepartmentDetails, deleteDepartment
}