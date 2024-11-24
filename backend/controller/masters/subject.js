import constant from "../../constant/constant.js";
import Subject from "../../modal/subject.js";
import User from "../../modal/users.js";

const { RouteCode } = constant;

const getSubjectList = async (req, res) => {
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

        const foundSubjects = await Subject.find();
        const subjectList = foundSubjects?.length > 0 ? foundSubjects.reduce((acc, cur) => {
            acc.push({ id: cur._id, name: cur.name, code: cur.code, description: cur.description, isActive: cur.isActive })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(subjectList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const postSubject = async (req, res) => {
    const userID = req.user;
    const { subjectID, subjectNameValue, subjectCodeValue, subjectDescriptionValue, subjectISActive } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundSubject = await Subject.findOne({ name: subjectNameValue });
        if (foundSubject) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Subject Name already exists!' });

        const foundSubjectCode = await Subject.findOne({ code: subjectCodeValue });
        if (foundSubjectCode) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Subject Code already exists!' });

        const newSubject = new Subject({ 
            name: subjectNameValue,
            code: subjectCodeValue,
            description: subjectDescriptionValue,
            isActive: subjectISActive ?? false,
        });
        await newSubject.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'New Subject has added successfully' });
    } catch (err) {
        console.error('Error Creating New Subject:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putSubjectDetails = async (req, res) => {
    const userID = req.user;
    const { subjectID, subjectNameValue, subjectCodeValue, subjectDescriptionValue, subjectISActive } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundSubject = await Subject.findById(subjectID);
        if (!foundSubject) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Subject not found, Try again!' });

        if(foundSubject.name !== subjectNameValue){
            const foundSimilarName = await Subject.findOne({ name: subjectNameValue });
            if (foundSimilarName) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Subject name already exists, Try another name!' });
        }
        
        if(foundSubject.code !== subjectCodeValue){
            const foundSimilarCode = await Subject.findOne({ code: subjectCodeValue });
            if (foundSimilarCode) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Subject code already exists, Try another code!' });
        }


        foundSubject.name = subjectNameValue ?? foundSubject.name;
        foundSubject.code = subjectCodeValue ?? foundSubject.code;
        foundSubject.description = subjectDescriptionValue ?? foundSubject.description;
        foundSubject.isActive = subjectISActive ?? false;

        await foundSubject.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Subject has updated successfully' });
    } catch (err) {
        console.error('Error Updating Subject Details:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const deleteSubject = async (req, res) => {
    const userID = req.user;
    const { subjectID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });

        const hasPermission = true;
        if(!hasPermission) return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });

        const foundSubject = await Subject.findById(subjectID);
        if (!foundSubject) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Subject not found.' });

        await foundSubject.deleteOne();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Subject has been deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

export default {
    getSubjectList, postSubject, putSubjectDetails, deleteSubject
}