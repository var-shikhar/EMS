import constant from "../constant/constant.js";
import BookCategory from "../modal/bookCategory.js";
import User from "../modal/users.js";

const { RouteCode } = constant

const getCategoryList = async (req, res) => {
    const userID = req.user;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundCategory = await BookCategory.find();
        const categoryList = foundCategory?.map(item => {
            return { id: item._id, name: item.name }
        })

        return res.status(RouteCode.SUCCESS.statusCode).json(categoryList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const postCategory = async (req, res) => {
    const userID = req.user;
    const { name } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundCategory = await BookCategory.findOne({ name: name });
        if (foundCategory) {
            return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Category already exists!' });
        }

        const newCategory = new BookCategory({ name: name });
        await newCategory.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Category has been added successfully' });
    } catch (err) {
        console.error('Error creating category:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const getInitCategory = async (req, res) => {
    const userID = req.user;
    const { categoryID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundCategory = await BookCategory.findById(categoryID);
        if (!foundCategory) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Category not found, Try again!' });
        }

        const categoryData = {
            id: foundCategory._id,
            name: foundCategory.name, 
        }

        return res.status(RouteCode.SUCCESS.statusCode).json(categoryData);
    } catch (err) {
        console.error('Error Geting Init Category Data:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putCategoryDetail = async (req, res) => {
    const userID = req.user;
    const { id, name } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundCategory = await BookCategory.findById(id);
        if (!foundCategory) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Category not found, Try again!' });
        }

        if(foundCategory.name !== name){
            const foundName = await BookCategory.findOne({ name: name });
            if (foundName) {
                return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Category name already exists, Try another name!' });
            }
        }

        foundCategory.name = name ?? foundCategory.name;
        await foundCategory.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Category has updated successfully' });
    } catch (err) {
        console.error('Error Editing Category:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const deleteCategory = async (req, res) => {
    const userID = req.user;
    const { categoryID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundCategory = await BookCategory.findById(categoryID);
        if (!foundCategory) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Category not found.' });
        }

        await foundCategory.deleteOne();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Category has been deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};


export default {
    getCategoryList, postCategory, getInitCategory, putCategoryDetail, deleteCategory
}