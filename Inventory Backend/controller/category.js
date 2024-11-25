import constant from "../constant/constant.js";
import AssetCategory from "../modal/assetCategory.js";
import User from "../modal/users.js";

const { RouteCode } = constant;

const getCategoryList = async (req, res) => {
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

        const foundCategory = await AssetCategory.find();
        const categoryList = foundCategory?.length > 0 ? foundCategory.reduce((acc, cur) => {
            acc.push({ 
                id: cur._id, 
                name: cur.name,
                description: cur.description,
                isArchived: cur.isArchived,
            })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(categoryList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const postCategory = async (req, res) => {
    const userID = req.user;
    const { categoryID, categoryNameValue, categoryDescriptionValue } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundSimilarName = await AssetCategory.findOne({ name: categoryNameValue });
        if (foundSimilarName) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Category Name already exists!' });

        const newCategory = new AssetCategory({ 
            name: categoryNameValue,
            description: categoryDescriptionValue,
        });
        await newCategory.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'New Category has added successfully' });
    } catch (err) {
        console.error('Error Creating New Category:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putCategoryDetails = async (req, res) => {
    const userID = req.user;
    const { categoryID, categoryNameValue, categoryDescriptionValue } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundCategory = await AssetCategory.findById(categoryID);
        if (!foundCategory) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Category not found, Try again!' });

        if(foundCategory.name !== categoryNameValue){
            const foundSimilarName = await AssetCategory.findOne({ name: categoryNameValue });
            if (foundSimilarName) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Category name already exists, Try another name!' });
        }

        foundCategory.name = categoryNameValue ?? foundCategory.name;
        foundCategory.description = categoryDescriptionValue ?? foundCategory.description;

        await foundCategory.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Category has updated successfully' });
    } catch (err) {
        console.error('Error Updating Category Details:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putArchiveCategory = async (req, res) => {
    const userID = req.user;
    const { categoryID, value } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundCategory = await AssetCategory.findById(categoryID);
        if (!foundCategory) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Category not found, Try again!' });


        foundCategory.isArchived = value ?? false;
        await foundCategory.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: `Category has ${value ? 'archived' : 'restored'} successfully` });
    } catch (err) {
        console.error('Error Archiving Category:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const deleteCategory = async (req, res) => {
    const userID = req.user;
    const { categoryID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });

        const hasPermission = true;
        if(!hasPermission) return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });

        const foundCategory = await AssetCategory.findById(categoryID);
        if (!foundCategory) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Category not found.' });

        await foundCategory.deleteOne();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Category has been deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

const getStCategoryList = async (req, res) => {
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

        const foundCategory = await AssetCategory.find();
        const categoryList = foundCategory?.length > 0 ? foundCategory.reduce((acc, cur) => {
            acc.push({ id: cur._id, name: cur.name })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(categoryList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

export default {
    getCategoryList, postCategory, putCategoryDetails, putArchiveCategory, deleteCategory,
    getStCategoryList
}