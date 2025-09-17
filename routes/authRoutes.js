const { createUser, login, logout, getCurrentUser } = require('../controller/authController')
const { authMiddleware } = require('../middleware/auth')

const router = require('express').Router()

router.post("/create_user",createUser)
router.post('/login',login)
router.get("/logout",logout)
router.get("/is_auth",authMiddleware,getCurrentUser)

module.exports=router