import constant from "../constant/constant.js";
import BookGenre from "../modal/bookGenre.js";
import User from "../modal/users.js";

const { RouteCode } = constant

const getGenreList = async (req, res) => {
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

        const foundGenre = await BookGenre.find();
        const GenreList = foundGenre?.map(item => {
            return { id: item._id, name: item.name }
        })

        return res.status(RouteCode.SUCCESS.statusCode).json(GenreList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const postGenre = async (req, res) => {
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

        const foundGenre = await BookGenre.findOne({ name: name });
        if (foundGenre) {
            return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Genre already exists!' });
        }

        const newGenre = new BookGenre({ name: name });
        await newGenre.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Genre has been added successfully' });
    } catch (err) {
        console.error('Error creating Genre:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const getInitGenre = async (req, res) => {
    const userID = req.user;
    const { genreID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundGenre = await BookGenre.findById(genreID);
        if (!foundGenre) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Genre not found, Try again!' });
        }

        const genreData = {
            id: foundGenre._id,
            name: foundGenre.name, 
        }

        return res.status(RouteCode.SUCCESS.statusCode).json(genreData);
    } catch (err) {
        console.error('Error Geting Init Genre Data:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putGenreDetail = async (req, res) => {
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

        const foundGenre = await BookGenre.findById(id);
        if (!foundGenre) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Genre not found, Try again!' });
        }

        if(foundGenre.name !== name){
            const foundName = await BookGenre.findOne({ name: name });
            if (foundName) {
                return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Genre name already exists, Try another name!' });
            }
        }

        foundGenre.name = name ?? foundGenre.name;
        await foundGenre.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Genre has updated successfully' });
    } catch (err) {
        console.error('Error Editing Genre:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const deleteGenre = async (req, res) => {
    const userID = req.user;
    const { genreID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundGenre = await BookGenre.findById(genreID);
        if (!foundGenre) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Genre not found.' });
        }

        await foundGenre.deleteOne();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Genre has been deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

export default {
    getGenreList, 
    postGenre, getInitGenre, putGenreDetail, deleteGenre,
}