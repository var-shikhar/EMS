import constant from "../../constant/constant.js";
import AcademicSection from "../../modal/academicSection.js";
import User from "../../modal/users.js";

const { RouteCode } = constant;

const getAcademicSectionList = async (req, res) => {
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

        const foundSections = await AcademicSection.find();
        const sectionList = foundSections?.length > 0 ? foundSections.reduce((acc, cur) => {
            acc.push({ id: cur._id, name: cur.sectionName, secCode: cur.sectionCode, classID: cur.classID })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(sectionList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

export default {
    getAcademicSectionList
}