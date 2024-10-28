import constant from "../constant/constant.js";
import BookDetail from "../modal/bookDetail.js";
import BookIssuance from "../modal/bookIssuance.js";
import UserRole from "../modal/role.js";
import SubscriptionType from "../modal/subscriptionType.js";
import User from "../modal/users.js";
import UserSubscription from "../modal/usersSubscription.js";

const { RouteCode } = constant;

const getUserRoleList = async (req, res) => {
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

        const foundRoles = await UserRole.find();
        const roleList = foundRoles?.map(role => {
            return {
                id: role._id,
                name: role.roleName,
            }
        })

        return res.status(RouteCode.SUCCESS.statusCode).json(roleList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const getUserList = async (req, res) => {
    const userID = req.user;
    const { userType, userName } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if (!hasPermission) {
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        if (!userType) {
            return res.status(RouteCode.BAD_REQUEST.statusCode).json({ message: 'User type is required!' });
        }

        const foundUsers = await User.find({ userRole: userType });
        if (!foundUsers || foundUsers.length === 0) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'No users found for the specified role!' });
        }

        const roleList = foundUsers
            .filter(user => {
                const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
                return fullName.includes(userName?.toLowerCase() || '');
            })
            ?.map(user => ({
                userID: user._id,
                userName: `${user.firstName} ${user.lastName}`,
                uniqueID: user.uniqueID
            }));

        return res.status(RouteCode.SUCCESS.statusCode).json(roleList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const getValidateUserforBookIssuing = async (req, res) => {
    const reqUserID = req.user;
    const { bookID, userID } = req.params;
    try {
        const foundUser = await User.findById(reqUserID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if (!hasPermission) {
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const vaildateUser = await User.findById(userID);
        const vaildateBook = await BookDetail.findById(bookID);

        if(!vaildateUser || !vaildateBook){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: `${!vaildateUser ? 'User not found,' : 'Book not found,'} Try later!` });
        }

        if(vaildateBook.availableQuantities <= 0){
            return res.status(RouteCode.CONFLICT.status).json({ message: "No Quantity is available for allotment!" })
        }

        const hasActiveIssuance = await BookIssuance.findOne({
            userID,
            bookID,
            status: { $in: ['Issued', 'Overdue'] }
        });

        const hasPrevAllotment =  hasActiveIssuance ? true : false;
        return res.status(RouteCode.SUCCESS.statusCode).json(hasPrevAllotment);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const postIssueBook = async (req, res) => {
    const reqUserID = req.user;
    const { bookID, userID, stDate, dueDate, issuedQty, remarks } = req.body;
    try {
        const foundUser = await User.findById(reqUserID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if (!hasPermission) {
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const vaildateUser = await User.findById(userID);
        const vaildateBook = await BookDetail.findById(bookID);

        if(!vaildateUser || !vaildateBook){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: `${!vaildateUser ? 'User not found,' : 'Book not found,'} Try later!` });
        }

        if(vaildateBook.availableQuantities <= issuedQty){
            return res.status(RouteCode.CONFLICT.status).json({ message: `Only ${vaildateBook.availableQuantities} ${vaildateBook.availableQuantities > 1 ? 'books' : 'book'} are available for allotment!` });
        }

        const newBooking = new BookIssuance({
            userID,
            bookID,
            issuedDate: new Date(stDate),
            dueDate: new Date(dueDate),
            paidAmount: 0,
            issuedQuantity: issuedQty,
            remarks: remarks,
            status: 'Issued'
        });

        const issuingResponse = await newBooking.save();
        if(issuingResponse){
            vaildateBook.availableQuantities -= issuedQty;
            await vaildateBook.save();
        }
        return res.status(RouteCode.SUCCESS.statusCode).json({message: 'Book has issued successfully!'});
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
}

// Issued Book Controllers
function calculateDaysBwDates(stDate, edDate) {
    const diffDays = Math.ceil((edDate - stDate) / (1000 * 60 * 60 * 24));
    return diffDays;
} 
export async function findSubTypeData(typeName){
    const subType = await SubscriptionType.findOne({ name: typeName });
    if (!subType) {
        return {
            isFound: false,
            subTypeData: null
        }
    }
    return {
        isFound: true,
        subTypeData: subType
    } 
}
export async function calculateBookingRent(userID, subTypeID, issueDate, bookDueDate, rentedPrice, rentedQty, overdueFine){
    const today = new Date();
    today.setHours(0,0,0,0)

    const membershipData = await UserSubscription.findOne({
        userId: userID,
        subscriptionTypeId: subTypeID,
        status: 'Active',
    });

    const issuedDate = new Date(issueDate);
    issuedDate.setHours(0,0,0,0)
    const dueDate = new Date(bookDueDate);
    dueDate.setHours(0,0,0,0)

    let rentDays = 0;
    let isSubscriptionUser = false;
    let hasPartialPayment = false;
    let subEndDate = null;


    // **Determine if the user has an active subscription**
    if (membershipData) {
        isSubscriptionUser = true;
        subEndDate = membershipData.endDate.toLocaleDateString();

        // **Calculate rent only for the days beyond the subscription end date**
        if (today > membershipData.endDate && dueDate > membershipData.endDate) {
            rentDays = calculateDaysBwDates(membershipData.endDate, today <= dueDate ? today : dueDate);
            hasPartialPayment = true;
        } else if (today <= membershipData.endDate) {
            // **User's subscription covers the rent duration, so no rent is charged**
            rentDays = 0;
        }
    } else {
        // **Calculate rent normally between issued date and today's date or due date**
        rentDays = today <= dueDate ? calculateDaysBwDates(issuedDate, today) : calculateDaysBwDates(issuedDate, dueDate);
    }

    const rentAmount = rentDays * rentedPrice * rentedQty; 
    let fineAmount = 0;
    if (today > dueDate) {
        const extendedDays = calculateDaysBwDates(dueDate, today);
        fineAmount = extendedDays * overdueFine * rentedQty;
    }

    const totalPayable = rentAmount + fineAmount;   
    return { rentAmount, fineAmount, totalPayable, isSubscriptionUser, hasPartialPayment, subEndDate, issuedDate, dueDate, today };
}

const getIssuedBooks = async (req, res) => {
    const userID = req.user;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if (!hasPermission) {
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const { isFound, subTypeData } = await findSubTypeData('Library Card')
        if (!isFound) {
            return res.status(RouteCode.EXPECTATION_FAILED.statusCode).json({ message: 'Something went wrong, Try later!' });
        }

        const issuedBooks = await BookIssuance.find({status: 'Issued'})
            .populate({
                path: 'bookID',
                select: 'rentalPrice fine title author category genre',
            })
            .populate({
                path: 'userID',
                select: 'firstName lastName uniqueID',
            })
            .lean();

        const formattedData = await Promise.all(issuedBooks?.map(async book => {
            const { rentAmount, fineAmount, totalPayable, isSubscriptionUser, hasPartialPayment, subEndDate, issuedDate, dueDate, today } = await calculateBookingRent(book.userID._id, subTypeData._id, book.issuedDate, book.dueDate, book.bookID.rentalPrice, book.issuedQuantity, book.bookID.fine);
            const isExpired = dueDate < today;

            return {
                id: book._id,
                userName: `${book.userID.firstName} ${book.userID.lastName}`,
                userID: book.userID.uniqueID,
                bookName: book.bookID.title,
                bookAuthor: book.bookID.author,
                categoryID: book.bookID.category,
                genreID: book.bookID.genre,
                remarks: book.remarks || 'N/A',
                issuedQty: book.issuedQuantity,
                issuedDate: issuedDate.toLocaleDateString(),
                dueDate: dueDate.toLocaleDateString(),
                rent: rentAmount,
                fine: fineAmount,
                totalPayable,
                paidAmount: book.paidAmount,
                status: book.status,
                isSubscriptionUser,
                hasPartialPayment,
                subEndDate,
                isExpired: isExpired,
                isExpiring: isExpired || calculateDaysBwDates(today, dueDate) <= 2,
            };
        }));

        return res.status(RouteCode.SUCCESS.statusCode).json(formattedData);
    } catch (error) {
        console.error('Error calculating rent and fine:', error);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const getPrevIssuedBooks = async (req, res) => {
    const userID = req.user;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if (!hasPermission) {
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const issuedBooks = await BookIssuance.find({ status: { $ne: 'Issued' } })
            .populate({
                path: 'bookID',
                select: 'rentalPrice fine title author category genre',
            })
            .populate({
                path: 'userID',
                select: 'firstName lastName uniqueID',
            })
            .lean();

        const formattedData = issuedBooks?.map(book => {           
            return {
                id: book._id,
                userName: `${book.userID?.firstName} ${book.userID?.lastName}`,
                userID: book.userID?.uniqueID,
                bookName: book.bookID.title,
                bookAuthor: book.bookID.author,
                categoryID: book.bookID.category,
                genreID: book.bookID.genre,
                remarks: book.remarks || 'N/A',
                issuedDate: book.issuedDate,
                issuedQty: book.issuedQuantity,
                dueDate: book.dueDate,
                paidAmount: book.paidAmount,
                rent: book.totalBookRent,
                fine: book.fine,
                totalPayable: book.totalAmount,
                status: book.status,
                isSubscriptionUser: book.hasMembership,
                hasPartialPayment: book.hasMembership,
                subEndDate: book.membershipEndDate,
            };
        });

        return res.status(RouteCode.SUCCESS.statusCode).json(formattedData);
    } catch (error) {
        console.error('Error calculating rent and fine:', error);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putAddPayment = async (req, res) => {
    const userID = req.user;
    const {issueID, payment} = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if (!hasPermission) {
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundIssuedBook = await BookIssuance.findById(issueID)
            .populate({
                path: 'bookID',
                select: 'rentalPrice fine title author category genre',
            })
            .populate({
                path: 'userID',
                select: 'firstName lastName uniqueID',
            })

        if (!foundIssuedBook) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Issued book not found!' });
        }

        const { isFound, subTypeData } = await findSubTypeData('Library Card')
        if (!isFound) {
            return res.status(RouteCode.EXPECTATION_FAILED.statusCode).json({ message: 'Something went wrong, Try later!' });
        }

        const { rentAmount, fineAmount, totalPayable } = await calculateBookingRent(foundIssuedBook.userID._id, subTypeData._id, foundIssuedBook.issuedDate, foundIssuedBook.dueDate, foundIssuedBook.bookID.rentalPrice, foundIssuedBook.issuedQuantity, foundIssuedBook.bookID.fine);

        if(payment < 0 || payment > totalPayable){
            return res.status(RouteCode.CONFLICT.statusCode).json({message: `Payment should be inbetween 0 and ${totalPayable}`})
        }

        foundIssuedBook.totalAmount = totalPayable;
        foundIssuedBook.paidAmount = Number(foundIssuedBook.paidAmount) + Number(payment);
        foundIssuedBook.totalBookRent = rentAmount;
        foundIssuedBook.fine = fineAmount;
        foundIssuedBook.paymentLog.push({
            amount: payment,
            paidAt: new Date(),
        })

        await foundIssuedBook.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({message: 'Payment has added successfully!'});
    } catch (error) {
        console.error('Error in updating book rent:', error);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }  
}
const postReturnBook = async (req, res) => {
    const userID = req.user;
    const { issueID, returnDate } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if (!hasPermission) {
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundIssuedBook = await BookIssuance.findById(issueID)
            .populate({
                path: 'bookID',
                select: 'rentalPrice fine title author category genre',
            })
            .populate({
                path: 'userID',
                select: 'firstName lastName uniqueID',
            })

        if (!foundIssuedBook) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Issued book not found!' });
        }

        const { isFound, subTypeData } = await findSubTypeData('Library Card')
        if (!isFound) {
            return res.status(RouteCode.EXPECTATION_FAILED.statusCode).json({ message: 'Something went wrong, Try later!' });
        }

        const { issuedDate } = await calculateBookingRent(foundIssuedBook.userID._id, subTypeData._id, foundIssuedBook.issuedDate, foundIssuedBook.dueDate, foundIssuedBook.bookID.rentalPrice, foundIssuedBook.issuedQuantity, foundIssuedBook.bookID.fine);
        const retDate = new Date(returnDate);
        retDate.setHours(0,0,0,0);

        if(retDate < issuedDate){
            return res.status(RouteCode.CONFLICT.statusCode).json({message: `Return date should be greater then Issuing Date(${new Date(issuedDate).toLocaleDateString('en-GB')})`});
        }

        foundIssuedBook.returnDate = new Date(returnDate);
        foundIssuedBook.status = 'Returned';
        foundIssuedBook.paymentStatus = foundIssuedBook.paidAmount < foundIssuedBook.totalAmount ? 'Partially-Paid' : 'Paid';

        await foundIssuedBook.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({message: 'Book has returned successfully!'});
    } catch (error) {
        console.error('Error in returning issued book:', error);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }  
}

export default {
    getUserRoleList, getUserList, getValidateUserforBookIssuing, postIssueBook,
    getIssuedBooks, getPrevIssuedBooks, putAddPayment, postReturnBook
}