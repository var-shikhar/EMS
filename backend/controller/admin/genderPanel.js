import constant from "../../constant/constant.js";
import Gender from "../../modal/gender.js";
import User from "../../modal/users.js";

const { RouteCode } = constant;

const getGenderList = async (req, res) => {
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

        const foundGenders = await Gender.find();
        const genderList = foundGenders?.length > 0 ? foundGenders.reduce((acc, cur) => {
            acc.push({ id: cur._id, name: cur.genderName })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(genderList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

export default {
    getGenderList
}