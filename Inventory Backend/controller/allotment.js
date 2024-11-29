import constant from "../constant/constant.js";
import Asset from "../modal/asset.js";
import AssetTransaction from "../modal/assetTransaction.js";
import User from "../modal/users.js";

const { RouteCode } = constant;

const postAllotAsset = async (req, res) => {
    const adminUserID = req.user;
    const { assetID, allotmentMode, allotmentQuantity, allotmentDate, allotmentNote, userID } = req.body;
    try {
        const foundUser = await User.findById(adminUserID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundAsset = await Asset.findById(assetID);
        if (!foundAsset) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Asset not found, try again!' });

        if(allotmentQuantity > foundAsset.totalQuantity) return res.status(RouteCode.CONFLICT.statusCode).json({ message: `Allotment quantity should be equal or less than ${foundAsset.totalQuantity}` });

        const foundAllotUser = await User.findById(userID);
        if (!foundAllotUser || foundAllotUser.isBlocked || !foundAllotUser.isActive) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'User not found, Try again!' });

        const newAssetTransaction = new AssetTransaction({
            assetID: assetID,
            userID: userID,
            transactionDate: new Date(allotmentDate),
            transactionQuantity: allotmentQuantity,
            updatedBy: adminUserID,
            remarks: allotmentNote,
            status: allotmentMode
        });

        foundAsset.totalQuantity = foundAsset.totalQuantity - allotmentQuantity;
        
        await foundAsset.save();
        await newAssetTransaction.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Asset has Transfered successfully!' });
    } catch (err) {
        console.error('Error Allocating Asset to User:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};


export default {
    postAllotAsset
}