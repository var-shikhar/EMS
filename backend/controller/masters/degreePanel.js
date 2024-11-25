import constant from "../../constant/constant.js";
import Degree from "../../modal/degree.js";
import User from "../../modal/users.js";

const { RouteCode } = constant;

const getDegreeList = async (req, res) => {
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

        const foundDegree = await Degree.find().populate('department');
        const degreeList = foundDegree?.length > 0 ? foundDegree.reduce((acc, cur) => {
            acc.push({ 
                id: cur._id, 
                name: cur.name,
                code: cur.code,
                duration: cur.durationYears,
                departmentID: cur.department?._id,
                departmentName: cur.department?.name,
                description: cur.description,
                isActive: cur.isActive,
            })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(degreeList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const postDegree = async (req, res) => {
    const userID = req.user;
    const { degreeIDValue, degreeNameValue, degreeCodeValue, degreeDescriptionValue, degreeDepartmentValue, degreeIsActiveValue, degreeDurationValue } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundSimilarName = await Degree.findOne({ name: degreeNameValue });
        if (foundSimilarName) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Degree Name already exists!' });

        const foundSimilarCode = await Degree.findOne({ code: degreeCodeValue });
        if (foundSimilarCode) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Degree Code already exists!' });

        const newDegree = new Degree({ 
            name: degreeNameValue,
            code: degreeCodeValue,
            description: degreeDescriptionValue,
            department: degreeDepartmentValue,
            durationYears: degreeDurationValue,
            isActive: degreeIsActiveValue,
        });
        await newDegree.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'New Degree has added successfully' });
    } catch (err) {
        console.error('Error Creating New Degree:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putDegreeDetails = async (req, res) => {
    const userID = req.user;
    const { degreeIDValue, degreeNameValue, degreeCodeValue, degreeDescriptionValue, degreeDepartmentValue, degreeIsActiveValue, degreeDurationValue } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundDegree = await Degree.findById(degreeIDValue);
        if (!foundDegree) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Degree not found, Try again!' });

        if(foundDegree.name !== degreeNameValue){
            const foundSimilarName = await Degree.findOne({ name: degreeNameValue });
            if (foundSimilarName) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Degree name already exists, Try another name!' });
        }

        if(foundDegree.code !== degreeCodeValue){
            const foundSimilarCode = await Degree.findOne({ code: degreeCodeValue });
            if (foundSimilarCode) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Degree code already exists, Try another code!' });
        }

        foundDegree.name = degreeNameValue ?? foundDegree.name;
        foundDegree.code = degreeCodeValue ?? foundDegree.code;
        foundDegree.description = degreeDescriptionValue ?? foundDegree.description;
        foundDegree.durationYears = degreeDurationValue ?? foundDegree.durationYears;
        foundDegree.department = degreeDepartmentValue ?? foundDegree.department;
        foundDegree.isActive = degreeIsActiveValue ?? false;

        await foundDegree.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Degree has updated successfully' });
    } catch (err) {
        console.error('Error Updating Degree Details:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const deleteDegree = async (req, res) => {
    const userID = req.user;
    const { degreeID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });

        const hasPermission = true;
        if(!hasPermission) return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });

        const foundDegree = await Degree.findById(degreeID);
        if (!foundDegree) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Degree not found.' });

        await foundDegree.deleteOne();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Degree has been deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

const getStDegreeList = async (req, res) => {
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

        const foundDegree = await Degree.find();
        const degreeList = foundDegree?.length > 0 ? foundDegree.reduce((acc, cur) => {
            acc.push({ id: cur._id, name: cur.name })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(degreeList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
export default {
    getStDegreeList, getDegreeList, postDegree, putDegreeDetails, deleteDegree
}