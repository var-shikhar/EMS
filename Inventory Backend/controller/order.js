import mongoose from "mongoose";
import constant from "../constant/constant.js";
import Asset from "../modal/asset.js";
import AssetOrder from "../modal/assetOrder.js";
import User from "../modal/users.js";

const { RouteCode } = constant;

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
            finalAmount,
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

        foundAsset.totalQuantity = (foundAsset.totalQuantity || 0) + assetQuantity;
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


export default {
    postOrderViaAsset
}