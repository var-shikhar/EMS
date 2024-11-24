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
const postClass = async (req, res) => {
    const userID = req.user;
    const { classID, classNameValue } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundClass = await AcademicClass.findOne({ className: classNameValue });
        if (foundClass) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Class Name already exists!' });

        const newClass = new AcademicClass({ className : classNameValue });
        await newClass.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'New Class has added successfully' });
    } catch (err) {
        console.error('Error Creating New Class:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putClassDetails = async (req, res) => {
    const userID = req.user;
    const { classID, classNameValue } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundClass = await AcademicClass.findById(classID);
        if (!foundClass) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Class not found, Try again!' });

        if(foundClass.className !== classNameValue){
            const foundSimilarName = await AcademicClass.findOne({ className: classNameValue });
            if (foundSimilarName) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Class name already exists, Try another name!' });
        }

        foundClass.className = classNameValue ?? foundClass.className;

        await foundClass.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Class has updated successfully' });
    } catch (err) {
        console.error('Error Updating Class Details:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const deleteClass = async (req, res) => {
    const userID = req.user;
    const { classID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });

        const hasPermission = true;
        if(!hasPermission) return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });

        const foundClass = await AcademicClass.findById(classID);
        if (!foundClass) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Class not found.' });

        await foundClass.deleteOne();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Class has been deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};


export default {
    getAcademicClassList, postClass, putClassDetails, deleteClass
}