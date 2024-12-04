import mongoose from "mongoose";
import constant from "../constant/constant.js";
import Asset from "../modal/asset.js";
import AssetOrder from "../modal/assetOrder.js";
import User from "../modal/users.js";
import AssetOrderTransaction from "../modal/assetOrderTransaction.js";
import AssetVendor from "../modal/assetVendor.js";

const { RouteCode } = constant;

const getOrderList = async (req, res) => {
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

        const foundOrders = await AssetOrder.find().populate('vendorID').sort({ createdAt: -1});
        const orderList = foundOrders?.length > 0 ? foundOrders.reduce((acc, cur) => {
            acc.push({ 
                id: cur._id, 
                orderDate: cur.orderDate,
                vendorCompName: cur.vendorID?.companyName,
                vendorName: cur.vendorID?.name,
                orderAmount: cur.finalAmount,
                paidAmount: cur.paidAmount,
                status: cur.paymentStatus,
            })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(orderList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const getOrderDetails = async (req, res) => {
    const userID = req.user;
    const { orderID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access. User is blocked or inactive.' });
        }

        const hasPermission = true;
        if (!hasPermission) {
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundOrder = await AssetOrder.findById(orderID).populate('orderedItems.assetID');
        if (!foundOrder) return res.status(RouteCode.NO_CONTENT.statusCode).json({ message: 'Order not found.' });

        const orderDetail = {
            id: foundOrder._id,
            orderDate: foundOrder.orderDate,
            orderList: foundOrder.orderedItems?.map(item => {
                if (!item.assetID) return null;
                return {
                    assetID: item.assetID._id,
                    assetName: item.assetID.name,
                    assetQuantity: item.assetQuantity,
                    assetPrice: item.assetPrice,
                };
            }).filter(Boolean),
            orderAmount: foundOrder.orderAmount,
            discount: foundOrder.discount,
            finalAmount: foundOrder.finalAmount,
        };

        console.log(orderDetail)
        return res.status(RouteCode.SUCCESS.statusCode).json(orderDetail);

    } catch (err) {
        console.error('Error fetching order details:', err.message);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: 'Internal server error. Please try again later.' });
    }
};
const getTransactionList = async (req, res) => {
    const userID = req.user;
    const { orderID } = req.params; 
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }
        
        const foundOrder = await AssetOrder.findById(orderID);
        if (!foundOrder) return res.status(RouteCode.NO_CONTENT.statusCode).json({ message: 'Order not found.' });


        const foundTransactions = await AssetOrderTransaction.find({ orderID: orderID }).populate('updatedBy').sort({ createdAt: -1});
        const transactionList = foundTransactions?.length > 0 ? foundTransactions.reduce((acc, cur) => {
            acc.push({ 
                id: cur._id, 
                transactionDate: cur.transactionDate,
                transactionAmount: cur.transactionAmount,
                remarks: cur.remarks,
                addedBy: cur.updatedBy?.firstName + ' ' + cur.updatedBy?.lastName,
            })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(transactionList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const postOrder = async (req, res) => {
    const userID = req.user;
    const { orderDate, vendorID, orderNote, orderTotal, finalAmount, discount, assets } = req.body;
    try {
        const foundUser = await User.findById(userID).select('isBlocked isActive');
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.UNAUTHORIZED.statusCode).json({ message: 'Unauthorized access, try again!' });
        }

        const hasPermission = true;
        if (!hasPermission) {
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission denied!' });
        }

        const foundVendor = await AssetVendor.findById(vendorID);
        if (!foundVendor) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Vendor not found, try again!' });
        }

        const parsedOrderDate = new Date(orderDate);
        if (isNaN(parsedOrderDate)) {
            return res.status(RouteCode.BAD_REQUEST.statusCode).json({ message: 'Invalid order date' });
        }

        const newOrder = new AssetOrder({
            orderDate: parsedOrderDate,
            vendorID,
            orderNote,
            orderAmount: orderTotal,
            discount,
            finalAmount,
            status: 'Completed',
            paymentStatus: 'Pending',
        });

        // Start session for transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            if (assets?.length > 0) {
                for (const item of assets) {
                    const foundAsset = await Asset.findById(item.assetID).session(session);
                    if (foundAsset) {
                        newOrder.orderedItems.push({
                            assetID: item.assetID,
                            assetPrice: item.assetPrice,
                            assetQuantity: item.assetQuantity,
                        });

                        const purchaseOBJ = {
                            date: parsedOrderDate,
                            price: item.assetPrice,
                            quantity: item.assetQuantity,
                            vendorID,
                        };

                        foundAsset.totalQuantity = (Number(foundAsset.totalQuantity) || 0) + Number(item.assetQuantity);

                        if (!Array.isArray(foundAsset.purchaseHistory)) {
                            foundAsset.purchaseHistory = [];
                        }

                        foundAsset.purchaseHistory.push(purchaseOBJ);
                        foundAsset.latestPurchase = purchaseOBJ;

                        await foundAsset.save({ session });
                    }
                }
            }

            await newOrder.save({ session });
            await session.commitTransaction();
            session.endSession();
            return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'New order has been added successfully.' });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error('Error during transaction:', error);
            throw error;
        }
    } catch (err) {
        console.error('Error Creating New Order:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: 'Internal server error, please try again later.' });
    }
};

const postOrderViaAsset = async (req, res) => {
    const userID = req.user;
    const { assetID, orderDate, assetPrice, assetQuantity, vendorID, orderNote, orderTotal, finalAmount, discount } = req.body;

    try {
        const foundUser = await User.findById(userID).select('isBlocked isActive');
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.UNAUTHORIZED.statusCode).json({ message: 'Unauthorized access, try again!' });
        }

        const hasPermission = true;
        if (!hasPermission) {
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission denied!' });
        }

        const foundAsset = await Asset.findById(assetID);
        if (!foundAsset) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Asset not found, try again!' });
        }

        const parsedOrderDate = new Date(orderDate);
        if (isNaN(parsedOrderDate)) {
            return res.status(RouteCode.BAD_REQUEST.statusCode).json({ message: 'Invalid order date' });
        }

        const newOrder = new AssetOrder({
            orderDate: parsedOrderDate,
            vendorID,
            orderNote,
            orderAmount: orderTotal,
            discount,
            finalAmount: finalAmount,
            orderedItems: [
                {
                    assetID,
                    assetPrice,
                    assetQuantity,
                },
            ],
            status: 'Completed',
            paymentStatus: 'Pending',
        });

        const purchaseOBJ = {
            date: parsedOrderDate,
            price: assetPrice,
            quantity: assetQuantity,
            vendorID,
        };

        foundAsset.totalQuantity = (Number(foundAsset.totalQuantity) || 0) + Number(assetQuantity);

        if (!Array.isArray(foundAsset.purchaseHistory)) {
            foundAsset.purchaseHistory = [];
        }
        foundAsset.purchaseHistory.push(purchaseOBJ);
        foundAsset.latestPurchase = purchaseOBJ;

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await newOrder.save({ session });
            await foundAsset.save({ session });
            await session.commitTransaction();
            session.endSession();
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }

        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'New order has been added successfully.' });
    } catch (err) {
        console.error('Error Creating New Order:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: 'Internal server error, please try again later.' });
    }
};
const postAddPayment = async (req, res) => {
    const userID = req.user;
    const { orderID, paymentAmount, paymentDate, remarks } = req.body;

    try {
        const foundUser = await User.findById(userID).select('isBlocked isActive');
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.UNAUTHORIZED.statusCode).json({ message: 'Unauthorized access, try again!' });
        }

        const hasPermission = true;
        if (!hasPermission) {
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission denied!' });
        }

        const foundOrder = await AssetOrder.findById(orderID);
        if (!foundOrder) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Order not found, try again!' });

        const paidAmount = Number(foundOrder.paidAmount) + Number(paymentAmount);
        const remainingAmount = Number(foundOrder.finalAmount) - Number(foundOrder.paidAmount);

        if (remainingAmount < paymentAmount) return res.status(RouteCode.CONFLICT.statusCode).json({ message: `Amount should be less then ${remainingAmount}.` });

        foundOrder.paidAmount = paidAmount;
        foundOrder.paymentStatus = paidAmount < foundOrder.finalAmount ? 'Partially Paid' : 'Paid';

        const newTransaction = new AssetOrderTransaction({
            orderID: orderID,
            transactionAmount: paymentAmount,
            transactionDate: new Date(paymentDate),
            remarks: remarks,
            updatedBy: userID,
        });

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await newTransaction.save({ session });
            await foundOrder.save();

            await session.commitTransaction();
            session.endSession();
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }

        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Payment has been added successfully.' });
    } catch (err) {
        console.error('Error Adding Payment:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: 'Internal server error, please try again later.' });
    }
};


export default {
    getOrderList, postOrderViaAsset, getOrderDetails, postAddPayment, getTransactionList, postOrder
}