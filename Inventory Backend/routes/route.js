import express from "express";
import authController from '../controller/auth.js';
import { isAuth } from "../middleware/isAuthenticated.js";

// Admin Controllers

const router = express.Router();
router.route('/auth/register').post(authController.postRegister);
router.route('/auth/login').post(authController.postLogin).get(isAuth, authController.getUserContext);
router.route('/auth/logout').get(isAuth, authController.getLogout);
router.route('/auth/forgotPassowrd').post(authController.postForgotPassword).put(authController.putResetPassword);


import categoryController from '../controller/category.js';
import vendorController from '../controller/vendor.js';
import assetsController from '../controller/asset.js';


router.route('/admin/category-panel').get(isAuth, categoryController.getCategoryList).post(isAuth, categoryController.postCategory).put(isAuth, categoryController.putCategoryDetails);
router.route('/admin/category-panel/:categoryID').put(isAuth, categoryController.putArchiveCategory).delete(isAuth, categoryController.deleteCategory);
router.route('/admin/vendor-panel/:vendorID?').get(isAuth, vendorController.getVendorList).post(isAuth, vendorController.postVendor).put(isAuth, vendorController.putVendorDetails).delete(isAuth, vendorController.deleteVendor);
router.route('/admin/asset-panel/:assetID?').get(isAuth, assetsController.getAssetsList).post(isAuth, assetsController.postAssets).put(isAuth, assetsController.putAssetsDetails).delete(isAuth, assetsController.deleteAssets);



router.route('/admin/list/category-panel').get(isAuth, categoryController.getStCategoryList);


router.use('/', async (req, res) => {
    console.log(req.originalUrl);
    return res.send({ message: 'Undefined Request URL' })
})

export default router;