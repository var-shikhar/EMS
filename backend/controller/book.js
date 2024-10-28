import mongoose from "mongoose";
import constant from "../constant/constant.js";
import { handleImageDeleting, handleImageUploading } from "../helper/cloudinary.js";
import BookDetail from "../modal/bookDetail.js";
import Tag from "../modal/tags.js";
import User from "../modal/users.js";

const { RouteCode } = constant

const getandCreateTags = async (tags) => {
    const tagList = [];
    for (const tag of tags) {
        if (mongoose.Types.ObjectId.isValid(tag)) {
            let existingTag = await Tag.findById(tag);
            if (existingTag) tagList.push(existingTag._id);
        } else {
            let foundTag = await Tag.findOne({ name: tag });
            if(!foundTag){
                foundTag = await Tag.create({ name: tag });
            }
            tagList.push(foundTag._id);                
        }
    }

    return tagList;
};
const getTagList = async (req, res) => {
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

        const foundTags = await Tag.find();
        const tagList = foundTags?.map(tag => {
            return {
                id: tag._id,
                name: tag.name,
            }
        })

        return res.status(RouteCode.SUCCESS.statusCode).json(tagList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const getBookList = async (req, res) => {
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

        const foundList = await BookDetail.find().populate('category').populate('genre').populate('tags');;
        const bookList = foundList?.map(item => {
            return { 
                id: item._id, 
                title: item.title,
                categoryID: item.category._id,
                categoryName: item.category.name,
                genreID: item.genre._id,
                genreName: item.genre.name,
                ISBN: item.ISBN,
                authorName: item.author,
                totalBooks: item.totalQuantities,
                availableBooks: item.availableQuantities,
                lostBooks: item.lostQuantities,
                rentalCost: item.rentalPrice,
                overdueFine: item.fine,
                tagList: item.tags?.map(item => {
                    return {
                        id: item._id,
                        name: item.name,
                    }
                }),
                description: item.description
            }
        })

        return res.status(RouteCode.SUCCESS.statusCode).json(bookList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

const postBook = async (req, res) => {
    const userID = req.user;
    const { title, categoryID, genreID, ISBNNo, tags, authorName, totalQuantity, availableQuantity, rentalPrice, overdueFine, description } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }
        
        let foundBook = await BookDetail.findOne({ title: title });
        if (foundBook) {
            return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Book name already exists, Change Book name!' });
        }

        const coverImageURL = req.files?.coverImage ? await handleImageUploading(req.files.coverImage[0].buffer, req.files.coverImage[0].mimetype) : '';
        const tag = typeof tags === 'string' ? JSON.parse(tags) : tags;
        const tagList = await getandCreateTags(tag);
        const newBook = new BookDetail({
            title: title,
            category: categoryID,
            genre: genreID,
            ISBN: ISBNNo,
            author: authorName,
            addedBy: foundUser._id,
            totalQuantities: Number(totalQuantity),
            availableQuantities: Number(availableQuantity),
            rentalPrice: Number(rentalPrice),
            fine: Number(overdueFine),
            lostQuantities: 0,
            description: description,
            coverImage: coverImageURL,
            tags: tagList,
        });

        await newBook.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Book added successfully' });        
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const getInitBook = async (req, res) => {
    const userID = req.user;
    const { bookID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundBook = await BookDetail.findById(bookID);
        if (!foundBook) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Book not found, Try again!' });
        }

        const bookData = {
            id: foundBook._id ?? bookID,
            title: foundBook.title ?? '',
            categoryID: foundBook.category ?? '', 
            genreID: foundBook.genre ?? '', 
            ISBNNo: foundBook.ISBN, 
            authorName: foundBook.author, 
            totalQuantity: foundBook.totalQuantities, 
            availableQuantity: foundBook.availableQuantities, 
            rentalPrice: foundBook.rentalPrice, 
            overdueFine: foundBook.fine,
            tags: foundBook.tags, 
        }

        return res.status(RouteCode.SUCCESS.statusCode).json(bookData);
    } catch (err) {
        console.error('Error Geting Init Book Data:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putBookDetail = async (req, res) => {
    const userID = req.user;
    const { id, title, categoryID, genreID, ISBNNo, tags, authorName, totalQuantity, availableQuantity, rentalPrice, overdueFine } = req.body;
    const hasCoverImage = req.files?.coverImage ? true : false;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundBook = await BookDetail.findById(id);
        if (!foundBook) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Book not found, Try again!' });
        }

        if(foundBook.title !== title){
            const foundTitle = await BookDetail.findOne({ title: title });
            if (foundTitle) {
                return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Book Title already exists, Try another Title!' });
            }
        }

        const tag = typeof tags === 'string' ? JSON.parse(tags) : tags;
        const tagList = await getandCreateTags(tag);
        let coverImageUrl = foundBook.coverImage; 
        if (hasCoverImage) {
            coverImageUrl = await handleImageUploading(req.files.coverImage[0].buffer, req.files.coverImage[0].mimetype);
            const prevCoverImage = foundBook.coverImage?.split('/').pop().split('.')[0];
            if (prevCoverImage) {
                await handleImageDeleting(prevCoverImage);
            }
        }

        foundBook.title = title ?? foundBook.title;
        foundBook.category = categoryID ?? foundBook.category;
        foundBook.genre = genreID ?? foundBook.genre;
        foundBook.ISBN = ISBNNo ?? foundBook.ISBN;
        foundBook.author = authorName ?? foundBook.author;
        foundBook.totalQuantities = totalQuantity ?? foundBook.totalQuantities;
        foundBook.availableQuantities = availableQuantity ?? foundBook.availableQuantities;
        foundBook.rentalPrice = rentalPrice ?? foundBook.rentalPrice;
        foundBook.fine = overdueFine ?? foundBook.fine;
        foundBook.coverImage = coverImageUrl;
        foundBook.tags = tagList;

        await foundBook.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Book has updated successfully!' });
    } catch (err) {
        console.error('Error Updating Book:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const deleteBook = async (req, res) => {
    const userID = req.user;
    const { bookID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundBook = await BookDetail.findById(bookID);
        if (!foundBook) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Book not found.' });
        }

        await foundBook.deleteOne();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Book has been deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

export default {
    getTagList,
    getBookList,
    postBook, getInitBook, putBookDetail, deleteBook
}