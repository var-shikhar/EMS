import constant from "../constant/constant.js";
import UserRole from "../modal/role.js";
import User from "../modal/users.js";

const { RouteCode } = constant;

const getRoleList = async (req, res) => {
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

        const foundRoles = await UserRole.find();
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
const getUserList = async (req, res) => {
    const userID = req.user;
    const { roleID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        let foundUsers = roleID !== '' || roleID !== undefined ? await User.find({ userRole: roleID }) : await User.find();
        const userList = foundUsers?.length > 0 ? foundUsers.reduce((acc, cur) => {
            acc.push({ 
                userID: cur._id, 
                userName: cur.firstName + ' ' + cur.lastName,
                uniqueID: cur.uniqueID,
            })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(userList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

export default {
    getRoleList, getUserList
}