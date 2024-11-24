import express from "express";
import authController from '../controller/auth.js';
import bookController from '../controller/book.js';
import categoryController from '../controller/bookCategory.js';
import genreController from '../controller/bookGenre.js';
import issueController from '../controller/bookIssue.js';
import { isAuth } from "../middleware/isAuthenticated.js";
import isMulterApproved from "../middleware/isMulterApproved.js";
import reportController from '../controller/report.js';

// Admin Controllers
import roleController from '../controller/admin/role.js';

const router = express.Router();

router.route('/auth/register').post(authController.postRegister);
router.route('/auth/login').post(authController.postLogin).get(isAuth, authController.getUserContext);
router.route('/auth/login/student').post(authController.postStudentLogin).get(isAuth, authController.getUserContext);
router.route('/auth/logout').get(isAuth, authController.getLogout);
router.route('/auth/forgotPassowrd').post(authController.postForgotPassword).put(authController.putResetPassword);


// Library Routes
router.route('/admin/tag-list').get(isAuth, bookController.getTagList)

router.route('/admin/genre').get(isAuth, genreController.getGenreList).post(isAuth, genreController.postGenre).put(isAuth, genreController.putGenreDetail);
router.route('/admin/genre/:genreID').get(isAuth, genreController.getInitGenre).delete(isAuth, genreController.deleteGenre);

router.route('/admin/category').get(isAuth, categoryController.getCategoryList).post(isAuth, categoryController.postCategory).put(isAuth, categoryController.putCategoryDetail);
router.route('/admin/category/:categoryID').get(isAuth, categoryController.getInitCategory).delete(isAuth, categoryController.deleteCategory);

router.route('/admin/book').get(isAuth, bookController.getBookList).post(isAuth, isMulterApproved, bookController.postBook).put(isAuth, isMulterApproved, bookController.putBookDetail);
router.route('/admin/book/:bookID').get(isAuth, bookController.getInitBook).delete(isAuth, bookController.deleteBook);

router.route('/admin/users/:userType/:userName?').get(isAuth, issueController.getUserList);
router.route('/admin/users/validate-issueing/:bookID/:userID').get(isAuth, issueController.getValidateUserforBookIssuing)
router.route('/admin/booking').post(isAuth, issueController.postIssueBook);

router.route('/admin/issued-books').get(isAuth, issueController.getIssuedBooks).post(isAuth, issueController.postReturnBook).put(isAuth, issueController.putAddPayment);
router.route('/admin/prev-issued-books').get(isAuth, issueController.getPrevIssuedBooks);

router.route('/admin/report/data/users/:userName/:searchBy').get(isAuth, reportController.getSearchableUserList)
router.route('/admin/report/data/books/:bookTitle').get(isAuth, reportController.getSearchableBookList)

router.route('/admin/report/users/:userID/:stDate/:edDate').get(isAuth, reportController.getUserReportList)
router.route('/admin/report/books/:bookID/:stDate/:edDate').get(isAuth, reportController.getBooksIssuedByName)

router.route('/admin/dashboard').get(isAuth, reportController.getDashboardData);
router.route('/admin/dashboard/analytics').get(isAuth, reportController.getDashboardAnalytics);


// Admin Routes
import adClassPanelController from '../controller/admin/classPanel.js';
import adSectionPanelController from '../controller/admin/sectionPanel.js';
import adStudentPanelController from '../controller/admin/studentPanel.js';
import adGenderPanelController from '../controller/admin/genderPanel.js';
import adDepartmentPanelController from '../controller/admin/departmentPanel.js';
import adDegreePanelController from '../controller/admin/degreePanel.js';
import adEducatorPanelController from '../controller/admin/educatorPanel.js';



router.route('/admin/roles/:roleID?').get(isAuth, roleController.getUserRoleList).post(isAuth, roleController.postRole).put(isAuth, roleController.putRoleDetails).delete(isAuth, roleController.deleteRole);
router.route('/admin/student-panel').get(isAuth, adStudentPanelController.getStudentList).post(isAuth, adStudentPanelController.postNewStudent).put(isAuth, adStudentPanelController.putStudentDetails);
router.route('/admin/student-panel/:studentID?').put(isAuth, adStudentPanelController.putStudentStatus).delete(isAuth, adStudentPanelController.deleteStudent);
router.route('/admin/educator-panel').get(isAuth, adEducatorPanelController.getEducatorList).post(isAuth, adEducatorPanelController.postNewEducator).put(isAuth, adEducatorPanelController.putEducatorDetails);
router.route('/admin/educator-panel/:educatorID').put(isAuth, adEducatorPanelController.putEducatorStatus).delete(isAuth, adEducatorPanelController.deleteEducator);

router.route('/admin/class-panel').get(isAuth, adClassPanelController.getAcademicClassList)
router.route('/admin/section-panel').get(isAuth, adSectionPanelController.getAcademicSectionList)
router.route('/admin/gender-panel').get(isAuth, adGenderPanelController.getGenderList)
router.route('/admin/department-panel').get(isAuth, adDepartmentPanelController.getDepartmentList)
router.route('/admin/degree-panel').get(isAuth, adDegreePanelController.getDegreeList)
router.route('/admin/educator/role-list').get(isAuth, roleController.getRoleListForEducatorPanel)


router.use('/', async (req, res) => {
    console.log(req.originalUrl);
    return res.send({ message: 'Undefined Request URL' })
})

export default router;