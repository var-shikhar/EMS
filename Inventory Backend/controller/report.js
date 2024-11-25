import constant from "../constant/constant.js";
import BookDetail from "../modal/bookDetail.js";
import BookIssuance from "../modal/bookIssuance.js";
import User from "../modal/users.js";
import { calculateBookingRent, findSubTypeData } from "./bookIssue.js";

const { RouteCode } = constant;

const getSearchableUserList = async (req, res) => {
    const userID = req.user;
    const { userName, searchBy } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if (!hasPermission) {
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        let foundList = [];
        const firstPartOfName = userName.split(' ')[0];
        const searchRegex = new RegExp(firstPartOfName, 'i');
        if (searchBy === 'Name') {
            foundList = await User.find({
                $or: [
                    { firstName: searchRegex },
                    { lastName: searchRegex }
                ]
            });

        } else foundList = await User.find({ uniqueID: userName });
        const foundUsers = foundList?.map(item => ({
            id: item._id,
            name: `${item.firstName} ${item.lastName}`,
            secAtt: item.uniqueID,  
        }))

        return res.status(RouteCode.SUCCESS.statusCode).json(foundUsers);
    } catch (error) {
        console.error('Error calculating rent and fine:', error);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const getSearchableBookList = async (req, res) => {
    const userID = req.user;
    const { bookTitle } = req.params;    
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if (!hasPermission) {
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        let foundList = [];
        const searchRegex = new RegExp(bookTitle, 'i');
        foundList = await BookDetail.find({ title: searchRegex });

        const foundBooks = foundList?.map(item => {
            return {
                id: item._id,
                name: item.title,
                secAtt: item.author,
            }
        })

        return res.status(RouteCode.SUCCESS.statusCode).json(foundBooks);
    } catch (error) {
        console.error('Error calculating rent and fine:', error);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

const getUserReportList = async (req, res) => {
    const reqUserID = req.user;
    const { userID, stDate, edDate } = req.params;

    try {
        const adminUser = await User.findById(reqUserID);
        if (!adminUser) {
            return res.status(RouteCode.UNAUTHORIZED.statusCode).json({ message: 'Unauthorized access!' });
        }

        const hasPermission = true;
        if (!hasPermission) {
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'User not found!' });
        }

        const startDate = new Date(stDate);
        const endDate = new Date(edDate);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date range provided.' });
        }

        const { isFound, subTypeData } = await findSubTypeData('Library Card');
        if (!isFound) {
            return res.status(RouteCode.EXPECTATION_FAILED.statusCode).json({ message: 'Something went wrong, Try later!' });
        }

        const issuedBooks = await BookIssuance.find({
            userID: userID,
            issuedDate: { $gte: startDate, $lte: endDate }
        })
            .populate({
                path: 'bookID',
                select: 'rentalPrice fine title author category genre',
            })
            .populate({
                path: 'userID',
                select: 'firstName lastName uniqueID',
            })
            .lean();

        const formattedData = await Promise.all(issuedBooks.map(async book => {
            let rentAmount = book.totalBookRent;
            let fineAmount = book.fine;
            let totalPayable = book.totalAmount;

            if (book.status === 'Issued') {
                const rentDetails = await calculateBookingRent(
                    book.userID._id,
                    subTypeData._id,
                    book.issuedDate,
                    book.dueDate,
                    book.bookID.rentalPrice,
                    book.issuedQuantity,
                    book.bookID.fine
                );

                rentAmount = rentDetails.rentAmount;
                fineAmount = rentDetails.fineAmount;
                totalPayable = rentDetails.totalPayable;
            }

            return {
                id: book._id,
                userName: `${book.userID.firstName} ${book.userID.lastName}`,
                userID: book.userID.uniqueID,
                bookName: book.bookID.title,
                bookAuthor: book.bookID.author,
                issuedQty: book.issuedQuantity,
                issuedDate: new Date(book.issuedDate).toLocaleDateString(),
                dueDate: new Date(book.dueDate).toLocaleDateString(),
                returnDate: book.returnDate ? book.dueDate : '',
                rent: rentAmount,
                fine: fineAmount,
                totalPayable,
                paidAmount: book.paidAmount,
                status: book.status,
            };
        }));

        return res.status(RouteCode.SUCCESS.statusCode).json(formattedData);
    } catch (error) {
        console.error('Error calculating rent and fine:', error);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const getBooksIssuedByName = async (req, res) => {
    const userID = req.user;
    const { bookID, stDate, edDate } = req.params;

    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.UNAUTHORIZED.statusCode).json({ message: 'Unauthorized access!' });
        }
        
        const hasPermission = true;
        if (!hasPermission) {
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundBook = await BookDetail.findById(bookID);
        if (!foundBook) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Book not found!' });
        }

        const startDate = new Date(stDate);
        const endDate = new Date(edDate);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date range provided.' });
        }

        const { isFound, subTypeData } = await findSubTypeData('Library Card');
        if (!isFound) {
            return res.status(RouteCode.EXPECTATION_FAILED.statusCode).json({ message: 'Something went wrong, Try later!' });
        }

        const issuedBooks = await BookIssuance.find({
                bookID: foundBook._id,
                issuedDate: { $gte: startDate, $lte: endDate }
            })
            .populate({
                path: 'userID',
                select: 'firstName lastName uniqueID',
            })
            .lean();

        const formattedData = await Promise.all(issuedBooks.map(async book => {
            let rentAmount = book.totalBookRent;
            let fineAmount = book.fine;
            let totalPayable = book.totalAmount;

            if (book.status === 'Issued') {
                const rentDetails = await calculateBookingRent(
                    book.userID._id,
                    subTypeData._id,
                    book.issuedDate,
                    book.dueDate,
                    foundBook.rentalPrice,
                    book.issuedQuantity,
                    foundBook.fine
                );

                rentAmount = rentDetails.rentAmount;
                fineAmount = rentDetails.fineAmount;
                totalPayable = rentDetails.totalPayable;
            }

            return {
                id: book._id,
                userName: `${book?.userID?.firstName} ${book?.userID?.lastName}` || 'N/A',
                userID: book?.userID?.uniqueID || '-',
                bookName: foundBook.title,
                bookAuthor: foundBook.author,
                issuedQty: book.issuedQuantity,
                issuedDate: new Date(book.issuedDate).toLocaleDateString(),
                dueDate: new Date(book.dueDate).toLocaleDateString(),
                returnDate: book.returnDate ? book.dueDate : '',
                rent: rentAmount,
                fine: fineAmount,
                totalPayable,
                paidAmount: book.paidAmount,
                status: book.status,
            };
        }));

        return res.status(RouteCode.SUCCESS.statusCode).json(formattedData);
    } catch (error) {
        console.error('Error fetching issued books by name:', error);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};


// Dashboard Data
const getDashboardData = async (req, res) => {
    try {
        const latestBookIssues = await BookIssuance.find()
            .sort({ issuedDate: -1 })
            .limit(5)
            .populate({
                path: 'bookID',
                select: 'title category',
                populate: {
                    path: 'category',
                    select: 'name',
                }
            })
            .populate({
                path: 'userID',
                select: 'uniqueID firstName lastName',
            })
            .lean();


        const formattedData = latestBookIssues?.map(issue => ({
            id: issue._id,
            bookName: issue.bookID?.title,
            bookCategoryName: issue.bookID?.category?.name,
            userName: `${issue.userID?.firstName} ${issue.userID?.lastName}`,
            userID: issue.userID?.uniqueID,
            issuedDate: new Date(issue.issuedDate).toLocaleDateString(),
            dueDate: new Date(issue.dueDate).toLocaleDateString(),
            issuedQty: issue.issuedQuantity,
        }));

        return res.status(RouteCode.SUCCESS.statusCode).json(formattedData);
    } catch (error) {
        console.error('Error fetching latest book issues:', error);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const getDashboardAnalytics = async (req, res) => {
    try {
        const today = new Date();
        const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

        const bookCount = await BookDetail.countDocuments();

        const currentMonthStats = await BookIssuance.aggregate([
            {$match: { issuedDate: { $gte: firstDayOfCurrentMonth, $lt: firstDayOfNextMonth }, },},
            {$group: { _id: null, totalIssuedBooks: { $sum: 1 }, },},
        ]);

        const lastMonthStats = await BookIssuance.aggregate([
            {$match: { issuedDate: { $gte: firstDayOfLastMonth, $lt: firstDayOfCurrentMonth }, },},
            {$group: { _id: null, totalIssuedBooks: { $sum: 1 },},},
        ]);

        const totalRentReceived = await BookIssuance.aggregate([
            {$match: {status: 'Returned',},},
            {$group: {_id: null, totalRent: { $sum: '$totalAmount' },},},
        ]);

        const response = {
            cntMthIssuedBooks: currentMonthStats[0]?.totalIssuedBooks || 0,
            lstMthIssuedBooks: lastMonthStats[0]?.totalIssuedBooks || 0,
            totalRentReceived: totalRentReceived[0]?.totalRent || 0,
            totalBooks: bookCount,
        };

        return res.status(RouteCode.SUCCESS.statusCode).json(response);
    } catch (error) {
        console.error('Error fetching monthly statistics:', error);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};






export default {
    getSearchableUserList, getSearchableBookList, getUserReportList, getBooksIssuedByName,
    getDashboardData, getDashboardAnalytics
}