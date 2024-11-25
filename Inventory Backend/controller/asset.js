import constant from "../constant/constant.js";
import Asset from "../modal/asset.js";
import User from "../modal/users.js";

const { RouteCode } = constant;

const getAssetsList = async (req, res) => {
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

        const foundAssets = await Asset.find().populate('categoryID');
        const assetList = foundAssets?.length > 0 ? foundAssets.reduce((acc, cur) => {
            acc.push({ 
                id: cur._id, 
                name: cur.name,
                categoryID: cur.categoryID?._id,
                categoryName: cur.categoryID?.name,
                availableQty: cur.totalQuantity,
                lastPurchaseDetails: {
                    date: cur.latestPurchase?.date,
                    quantity: cur.latestPurchase?.quantity,
                },
                isAvailable: cur.isAvailable,
            })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(assetList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const postAssets = async (req, res) => {
    const userID = req.user;
    const { assetID, assetName, assetCategory, assetIsAvailable } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundAsset = await Asset.findOne({ name: assetName, categoryID: assetCategory });
        if (foundAsset) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Assets already exists!' });

        const newAsset = new Asset({ 
            name: assetName,
            categoryID: assetCategory,
            isAvailable: assetIsAvailable,
        });
        await newAsset.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'New Assets has added successfully' });
    } catch (err) {
        console.error('Error Creating New Assets:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putAssetsDetails = async (req, res) => {
    const userID = req.user;
    const { assetID, assetName, assetCategory, assetIsAvailable } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundAssets = await Asset.findById(assetID);
        if (!foundAssets) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Assets not found, Try again!' });

        if(foundAssets.name !== assetName){
            const foundSimilarName = await Asset.findOne({ name: assetName });
            if (foundSimilarName) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Asset name already exists, Try another name!' });
        }

        foundAssets.name = assetName ?? foundAssets.name;
        foundAssets.categoryID = assetCategory ?? foundAssets.categoryID;
        foundAssets.isAvailable = assetIsAvailable ?? false;

        await foundAssets.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Assets has updated successfully' });
    } catch (err) {
        console.error('Error Updating Assets Details:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const deleteAssets = async (req, res) => {
    const userID = req.user;
    const { assetID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission) return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });

        const foundAssets = await Asset.findById(assetID);
        if (!foundAssets) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Assets not found.' });

        await foundAssets.deleteOne();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Assets has been deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

const getStAssetList = async (req, res) => {
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

        const foundAssets = await Asset.find();
        const assetList = foundAssets?.length > 0 ? foundAssets.reduce((acc, cur) => {
            acc.push({ id: cur._id, name: cur.name })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(assetList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

export default {
    getAssetsList, postAssets, putAssetsDetails, deleteAssets, getStAssetList
}