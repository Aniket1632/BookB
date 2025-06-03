import express from 'express';
import middleware from '../../config/middleware.js';
import {
    login,
    checkMobileNumber,
    onBoardSignUp,onBoardSignUpNew, userSignup,
    OTPVerification, getAllUsers, deleteUser,
    changeStatusOfUser, userSignupForMobile, changePassword, updateSalonForSuperAdmin,
    AssignStylistToUser, sendMessage, forgotPassword, onBoardCompelete,
    deviceIDUpdate, updateUserProfileImage, getUserByDeviceToken, logOutUser, updateAllUsersUserName,
    changeRole,checkSalonStylistDeatils
} from '../../api/auth.api.js';
import { uploadImage } from '../../config/multer.config.js';
import { getUserByToken, updatePassword, updateUser } from '../../api/user.api.js';
const router = express.Router();

router.use(middleware.optional)
router.post('/login', login)
router.post('/check-mobile-number', checkMobileNumber)
router.post('/otp-verification', OTPVerification)
router.post('/user-signup-for-mobile', userSignupForMobile)
router.post('/send-message', sendMessage)
router.patch('/forgot-password', forgotPassword)
//router.post('/onboard-signup', onBoardSignUp);
router.post('/onboard-signup', onBoardSignUpNew);
router.post('/verifySalonDetails',checkSalonStylistDeatils)
router.put('/change-role', changeRole);
router.post('/onboard-done', onBoardCompelete);
router.put('/update-users-username', updateAllUsersUserName)

router.use(middleware.required)
router.patch('/assign-stylist-to-user', AssignStylistToUser)
router.get('/get-user', getAllUsers)
router.post('/user-signup', userSignup)
router.get('/get-user-by-token', getUserByToken)
router.delete('/delete-user', deleteUser)
router.patch('/enable-disable-user', changeStatusOfUser)
router.patch('/update-salon-for-superadmin', updateSalonForSuperAdmin)
router.patch('/change-password', changePassword)
router.patch('/update-device-id', deviceIDUpdate)
router.patch('/update-profile-image', uploadImage.single('photo'), updateUserProfileImage)
router.post('/get-user-by-token', getUserByDeviceToken)
router.patch('/logout-user', logOutUser)
router.put('/update-profile', uploadImage.single('photo'), updateUser)
router.patch('/update-password', updatePassword)

export default router;
