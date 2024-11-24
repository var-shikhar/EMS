import UserRole from "../../modal/role.js";
import constant from "../../constant/constant.js";
import User from "../../modal/users.js";

const { RouteCode } = constant;

const getUserRoleList = async (req, res) => {
    const userID = req.user;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundRoles = await UserRole.find();
        const roleList = foundRoles?.length > 0 ? foundRoles.reduce((acc, cur) => {
            acc.push({ id: cur._id, name: cur.roleName, isDefault: cur.isDefaultRole, isAcademicRole: cur.isAcademicRole })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(roleList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const postRole = async (req, res) => {
    const userID = req.user;
    const { roleName, isAcademicRole } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundRole = await UserRole.findOne({ roleName: roleName });
        if (foundRole) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Role name already exists!' });

        const newRole = new UserRole({ 
            roleName: roleName, 
            isAcademicRole: isAcademicRole,
            isDefaultRole: false,
        });
        await newRole.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'New Role has added successfully' });
    } catch (err) {
        console.error('Error Creating New Role:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putRoleDetails = async (req, res) => {
    const userID = req.user;
    const { roleID, roleName, isAcademicRole } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundRole = await UserRole.findById(roleID);
        if (!foundRole) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Role not found, Try again!' });

        if(foundRole.roleName !== roleName){
            const foundSimilarName = await UserRole.findOne({ roleName: roleName });
            if (foundSimilarName) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Role name already exists, Try another name!' });
        }

        foundRole.roleName = roleName ?? foundRole.roleName;
        foundRole.isAcademicRole = isAcademicRole ?? false;

        await foundRole.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Role has updated successfully' });
    } catch (err) {
        console.error('Error Updating Role Details:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const deleteRole = async (req, res) => {
    const userID = req.user;
    const { roleID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });

        const hasPermission = true;
        if(!hasPermission) return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });

        const foundRole = await UserRole.findById(roleID);
        if (!foundRole) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Role not found.' });

        await foundRole.deleteOne();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Role has been deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};


// Custom Controller
const getRoleListForEducatorPanel = async (req, res) => {
    const userID = req.user;
    const { listType } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        let foundRoles = [];
        if(listType === 'Academic'){
            foundRoles = await UserRole.find({ isAcademicRole: true });
        } else if(listType === 'Other'){
            foundRoles = await UserRole.find({ $or: [{isAcademicRole: false}, {isDefaultRole: false}]});
        } else {
            foundRoles = await UserRole.find({$and: [ { isDefaultRole: true }, { roleName: { $ne: 'Student' } }]});
        }

        const roleList = foundRoles?.length > 0 ? foundRoles.reduce((acc, cur) => {
            acc.push({ id: cur._id, name: cur.roleName })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(roleList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
export default {
    getUserRoleList, postRole, putRoleDetails, deleteRole,
    getRoleListForEducatorPanel
}