import constant from "../../constant/constant.js";
import AcademicClass from "../../modal/academicClass.js";
import User from "../../modal/users.js";

const { RouteCode } = constant;

const getAcademicClassList = async (req, res) => {
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

        const foundClasses = await AcademicClass.find();
        const classList = foundClasses?.length > 0 ? foundClasses.reduce((acc, cur) => {
            acc.push({ id: cur._id, name: cur.className })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(classList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

export default {
    getAcademicClassList
}