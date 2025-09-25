const { createUser, login, logout, getCurrentUser, sendOtpforResetPassword, resetPassword } = require('../controller/authController')
const { sendOtpforVerification, verifyAccount } = require('../controller/verifyAccount')
const { authMiddleware } = require('../middleware/auth')

const router = require('express').Router()

router.post("/create_user",createUser)
router.post('/login',login)
router.get("/logout",logout)
router.get("/is_auth",authMiddleware,getCurrentUser)
router.post("/send_otp_for_reset_password",sendOtpforResetPassword)
router.post("/reset_password",resetPassword)
router.post("/send_otp_for_verify_account",sendOtpforVerification)
router.post("/verify_account",verifyAccount)
module.exports=router