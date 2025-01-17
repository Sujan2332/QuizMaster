const mongoose = require('mongoose')
const { schema } = require('./user.model')

const QuestionSchema = new mongoose.Schema({
    questionText:{type:String,required:true},
    options:[{type:String,required:true}],
    correctAnswer:{type:String,required:true},
})

const QuizSchema = new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    questions:[QuestionSchema],
    leaderboard:[{userId:{type:mongoose.Schema.Types.ObjectId,ref:"quizusers"},score:{type:Number,min:0}}],
    timeLimit:{type:Number,required:true},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "quizusers" }, // Optional: Creator's user ID
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default:Date.now}
})

QuizSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });

module.exports = mongoose.model('Quiz',QuizSchema)