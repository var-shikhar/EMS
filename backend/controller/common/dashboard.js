import constant from "../../constant/constant.js";
import AcademicStaffRole from "../../modal/academicRole.js";
import EducatorRole from "../../modal/educatorRole.js";
import UserRole from "../../modal/role.js";
import StudentRole from "../../modal/studentRole.js";
import User from "../../modal/users.js";

const { RouteCode } = constant;

const getUserPanelDashboard = async (req, res) => {
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

        const totalStudentsCount = await StudentRole.countDocuments();
        const totalEducatorsCount = await EducatorRole.countDocuments();
        const totalAcademicStaffCount = await AcademicStaffRole.countDocuments();
        
        const nonAcademicNonDefaultRoles = await UserRole.find({$and: [ { isAcademicRole: { $ne: true } }, { isDefaultRole: { $ne: true } } ]}).select('_id');
        const roleIds = nonAcademicNonDefaultRoles.map(role => role._id);
        const totalOtherUserCount = await User.countDocuments({userRole: { $in: roleIds }});

        const lastTenUsers = await User.find().populate('userRole').sort({ createdAt: -1 }).limit(10);

        const foundOBJ = {
            totalStudents: totalStudentsCount,
            totalEducator: totalEducatorsCount,
            totalAcadStaff: totalAcademicStaffCount,
            totalOtherUsers: totalOtherUserCount,
            latestUserList: lastTenUsers?.reduce((acc, currItem) => {
                acc.push({
                    userID: currItem._id,
                    userName: `${currItem.firstName} ${currItem.lastName}`,
                    uniqueCode: currItem.uniqueID,
                    userRole: currItem.userRole?.roleName || 'N/A',
                    status: currItem.isActive ? 'Active' : 'Inactive',
                })

                return acc;
            }, [])
        }

    
        console.log(foundOBJ);
        return res.status(RouteCode.SUCCESS.statusCode).json(foundOBJ);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

export default {
    getUserPanelDashboard
}