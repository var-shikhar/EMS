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

        const foundSections = await AcademicSection.find().populate('classID').populate('sectionTeacher');
        const sectionList = foundSections?.length > 0 ? foundSections.reduce((acc, cur) => {
            acc.push({ 
                id: cur._id, 
                name: cur.sectionName, 
                secCode: cur.sectionCode, 
                classID: cur.classID?._id,
                className: cur.classID?.className,
                teacherID: cur.sectionTeacher?._id,
                teacherName: cur.sectionTeacher?._id ? cur.sectionTeacher.firstName + ' ' + cur.sectionTeacher.lastName : '',
            })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(sectionList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const postSection = async (req, res) => {
    const userID = req.user;
    const { sectionIDValue, sectionNameValue, sectionCodeValue, classIDValue, teacherIDValue } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundSimilarName = await AcademicSection.findOne({ sectionName: sectionNameValue });
        if (foundSimilarName) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Section Name already exists!' });

        const foundSimilarCode = await AcademicSection.findOne({ classID: classIDValue, sectionCode: sectionCodeValue });
        if (foundSimilarCode) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Section Code already exists!' });

        const newSection = new AcademicSection({ 
            classID: classIDValue,
            sectionName: sectionNameValue,
            sectionCode: sectionCodeValue,
        });

        if(teacherIDValue !== ''){
            newSection.sectionTeacher = teacherIDValue;
        }

        await newSection.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'New Section has added successfully' });
    } catch (err) {
        console.error('Error Creating New Section:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putSectionDetails = async (req, res) => {
    const userID = req.user;
    const { sectionIDValue, sectionNameValue, sectionCodeValue, classIDValue, teacherIDValue } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundSection = await AcademicSection.findById(sectionIDValue);
        if (!foundSection) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Section not found, Try again!' });

        if(foundSection.sectionName !== sectionNameValue){
            const foundSimilarName = await AcademicSection.findOne({ sectionName: sectionNameValue });
            if (foundSimilarName) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Section name already exists, Try another name!' });
        }

        if(foundSection.sectionCode !== sectionCodeValue){
            const foundSimilarCode = await AcademicSection.findOne({ classID: classIDValue, sectionCode: sectionCodeValue });
            if (foundSimilarCode) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Section code already exists, Try another code!' });
        }

        foundSection.classID = classIDValue ?? foundSection.classID;
        foundSection.sectionName = sectionNameValue ?? foundSection.sectionName;
        foundSection.sectionCode = sectionCodeValue ?? foundSection.sectionCode;

        if(teacherIDValue !== ''){
            foundSection.sectionTeacher = teacherIDValue ?? foundSection.sectionTeacher;
        }

        await foundSection.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Section has updated successfully' });
    } catch (err) {
        console.error('Error Updating Section Details:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const deleteSection = async (req, res) => {
    const userID = req.user;
    const { sectionID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }
        const hasPermission = true;
        if(!hasPermission) return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });

        const foundSection = await AcademicSection.findById(sectionID);
        if (!foundSection) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Section not found.' });

        await foundSection.deleteOne();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Section has been deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

const getStSectionList = async (req, res) => {
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
    getStSectionList, getAcademicSectionList, postSection, putSectionDetails, deleteSection
}