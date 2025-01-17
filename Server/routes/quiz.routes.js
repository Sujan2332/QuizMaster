const express = require("express")
const {getQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz, submitQuiz, getLeaderboard} = require("../controllers/quiz.controller")
const {protect,admin} = require("../middlewares/authMiddleware")

const router = express.Router()

router.get("/",protect,getQuizzes)
router.get("/:id",protect,getQuizById)

router.post("/",protect,admin,createQuiz)
router.put("/:id",protect,admin,updateQuiz)
router.delete("/:id",protect,admin,deleteQuiz)

router.post("/:id/submit",protect,submitQuiz)
router.get("/:id/leaderboard",protect,getLeaderboard)

module.exports = router