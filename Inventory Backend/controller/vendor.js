import constant from "../constant/constant.js";
import AssetVendor from "../modal/assetVendor.js";
import User from "../modal/users.js";

const { RouteCode } = constant;

const getVendorList = async (req, res) => {
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

        const foundVendors = await AssetVendor.find().populate('categoryID');
        const vendorList = foundVendors?.length > 0 ? foundVendors.reduce((acc, cur) => {
            acc.push({ 
                id: cur._id, 
                name: cur.name,
                companyName: cur.companyName,
                categoryID: cur.categoryID?._id,
                categoryName: cur.categoryID?.name,
                phone: cur.phone,
                address: cur.address,
                isAvailable: cur.isAvailable,
            })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(vendorList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const postVendor = async (req, res) => {
    const userID = req.user;
    const { vendorID, vendorNameValue, companyNameValue, categoryID, vendorPhoneValue, vendorAddressValue, vendorIsAvailable } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundSimilarName = await AssetVendor.findOne({ companyName: companyNameValue });
        if (foundSimilarName) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Company already exists!' });

        const newVendor = new AssetVendor({ 
            name: vendorNameValue,
            companyName: companyNameValue,
            categoryID: categoryID,
            phone: vendorPhoneValue,
            address: vendorAddressValue,
            isAvailable: vendorIsAvailable,
        });
        await newVendor.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'New Vendor has added successfully' });
    } catch (err) {
        console.error('Error Creating New Vendor:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const putVendorDetails = async (req, res) => {
    const userID = req.user;
    const { vendorID, vendorNameValue, companyNameValue, categoryID, vendorPhoneValue, vendorAddressValue, vendorIsAvailable } = req.body;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission){
            return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });
        }

        const foundVendors = await AssetVendor.findById(vendorID);
        if (!foundVendors) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Vendor not found, Try again!' });

        if(foundVendors.companyName !== companyNameValue){
            const foundSimilarName = await AssetVendor.findOne({ companyName: companyNameValue });
            if (foundSimilarName) return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Company already exists, Try another name!' });
        }

        foundVendors.name = vendorNameValue ?? foundVendors.name;
        foundVendors.companyName = companyNameValue ?? foundVendors.companyName;
        foundVendors.categoryID = categoryID ?? foundVendors.categoryID;
        foundVendors.phone = vendorPhoneValue ?? foundVendors.phone;
        foundVendors.address = vendorAddressValue ?? foundVendors.address;
        foundVendors.isAvailable = vendorIsAvailable ?? false;


        await foundVendors.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Vendor has updated successfully' });
    } catch (err) {
        console.error('Error Updating Vendor Details:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
const deleteVendor = async (req, res) => {
    const userID = req.user;
    const { vendorID } = req.params;
    try {
        const foundUser = await User.findById(userID);
        if (!foundUser || foundUser.isBlocked || !foundUser.isActive) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Unauthorized access, Try again!' });
        }

        const hasPermission = true;
        if(!hasPermission) return res.status(RouteCode.FORBIDDEN.statusCode).json({ message: 'Permission Denied!' });

        const foundVendors = await AssetVendor.findById(vendorID);
        if (!foundVendors) return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: 'Vendor not found.' });

        await foundVendors.deleteOne();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Vendor has been deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

const getStVendorList = async (req, res) => {
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

        const foundVendors = await AssetVendor.find();
        const vendorList = foundVendors?.length > 0 ? foundVendors.reduce((acc, cur) => {
            acc.push({ id: cur._id, name: cur.name, companyName: cur.companyName })
            return acc;
        }, []) : [];

        return res.status(RouteCode.SUCCESS.statusCode).json(vendorList);
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

export default {
    getVendorList, postVendor, putVendorDetails, deleteVendor, 
    getStVendorList
}