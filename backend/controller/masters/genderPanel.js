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
const postGender = async (req, res) => {
    const userID = req.user;
    const { genderID, genderNameValue } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundGender = await Gender.findOne({ genderName: genderNameValue });
        if (foundGender) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Gender Name already exists!' });

        const newGender = new Gender({ genderName : genderNameValue });
        await newGender.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'New Gender has added successfully' });
    } catch (err) {
        console.error('Error Creating New Gender:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putGenderDetails = async (req, res) => {
    const userID = req.user;
    const { genderID, genderNameValue } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundGender = await Gender.findById(genderID);
        if (!foundGender) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Gender not found, Try again!' });

        if(foundGender.name !== genderNameValue){
            const foundSimilarName = await Gender.findOne({ genderName: genderNameValue });
            if (foundSimilarName) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Gender name already exists, Try another name!' });
        }

        foundGender.genderName = genderNameValue ?? foundGender.genderName;

        await foundGender.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Gender has updated successfully' });
    } catch (err) {
        console.error('Error Updating Gender Details:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const deleteGender = async (req, res) => {
    const userID = req.user;
    const { genderID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });

        const hasPermission = true;
        if(!hasPermission) return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });

        const foundGender = await Gender.findById(genderID);
        if (!foundGender) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Gender not found.' });

        await foundGender.deleteOne();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Gender has been deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

export default {
    getGenderList, postGender, putGenderDetails, deleteGender
}