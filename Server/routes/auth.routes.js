const express = require("express")
const {register,login,updateToAdmin,forgotPassword,updatePassword} = require("../controllers/auth.controller")

const router = express.Router()

router.post("/register",register)
router.post("/login",login)
router.patch("/update/:userId",updateToAdmin)
router.post("/forgot-password", forgotPassword);
router.post("/update-password", updatePassword);

module.exports = router