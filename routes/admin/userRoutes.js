const { updateUserRole, getAllUsers } = require("../../controller/admin/userController")

const router=require("express").Router()

router.put("/update/:id",updateUserRole)
router.get("/get_all",getAllUsers)

module.exports=router