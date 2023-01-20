const express = require('express')
const router = express.Router();
const userController = require('../../controller/user_controller');
const {auth, generateAuthToken} = require('../../middleware/auth')
const upload = require('../../services/multer');


router.get('/register',userController.register);
router.post('/api/register',upload.single('uploadImage'), userController.authRegister)

//login page
router.get('/', userController.login);
router.post('/login',generateAuthToken,userController.authlogin);


//forget password
router.get('/forgetPass', userController.forgetPass);
router.post('/verifyEmail', userController.verifyEmail);

//otp verify
router.get('/otp',userController.otp)
router.post('/verifyOtp',userController.verifyOtp);
router.post('/updatePassword',userController.updatePassword);


//reset password
router.get('/resetPassword',auth, userController.resetPassword);
router.post('/newPassword',auth,userController.newPassword);

//index
router.get('/index',auth,userController.index)
//profile
router.get('/profile', auth, userController.viewProfile);

//updateProfile
router.get('/updateProfile', auth, userController.updateProfile);

//editprofile
router.post('/editprofile', auth,upload.single('uploadImage'), userController.editProfile);


//logout
router.get('/logout',auth,userController.logout);

 module.exports = router;
