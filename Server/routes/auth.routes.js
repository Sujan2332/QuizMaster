const express = require("express")
const {register,login,updateToAdmin} = require("../controllers/auth.controller")

const router = express.Router()

router.post("/register",register)
router.post("/login",login)
router.patch("/update/:userId",updateToAdmin)

module.exports = router