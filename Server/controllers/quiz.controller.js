const Quiz = require("../models/quiz.model")

exports.getQuizzes = async (req,res)=>{
    try{
        const quizzes = await Quiz.find()
        res.json(quizzes)
    }catch(error){
        res.status(500).json({message:"Error Fetching Quizzes",error})
    }
}

exports.getQuizById = async (req,res)=>{
    try{
        const quiz = await Quiz.findById(req.params.id)
        res.json(quiz)
    }catch(error){
        res.status(500).json({message:"Error Fetching Quiz",error})
    }
}

exports.createQuiz = async (req, res) => {
    const { title, description, questions, timeLimit } = req.body;
    console.log("Create Quiz");
    console.log(req.body);
  
    try {
      // Check if the quiz with the same title already exists
      const existingQuiz = await Quiz.findOne({ title });
  
      if (existingQuiz) {
        // If the quiz already exists, add new questions to the existing quiz
        existingQuiz.questions = [...existingQuiz.questions, ...questions];
        existingQuiz.description = description;
        existingQuiz.timeLimit = timeLimit; // Optionally update the time limit as well
  
        // Save the updated quiz
        await existingQuiz.save();
  
        res.status(200).json({
          message: "Quiz updated with new questions",
          quiz: existingQuiz,
        });
      } else {
        // If no quiz exists, create a new one
        const newQuiz = new Quiz({
          title,
          description,
          questions,
          timeLimit,
        });
  
        await newQuiz.save();
        res.status(201).json({ message: "Quiz Created Successfully", quiz: newQuiz });
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      res.status(500).json({ message: "Error Creating Quiz", error });
    }
  };  

exports.updateQuiz = async(req,res)=>{
    const {title,category,questions,timeLimit} = req.body
    try{
        const updateQuiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            {title,category,questions,timeLimit},
            {new:true}
        )

        if(!updateQuiz){
            return res.status(404).json({message:"Quiz Not Found"})
        }

        res.json({message:"Quiz Updated Successfully",quiz:updateQuiz})
    } catch(error){
        res.status(500).json({message:"Error Updating Quiz",error})
    }
}

exports.deleteQuiz = async (req,res)=>{
    try{
        const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id)

        if(!deletedQuiz){
            return res.status(404).json({message:"Quiz Not Found"})
        }

        res.json({message:"Quiz Dleted Successfully"})
    }catch(error){
        res.status(500).json({message:"Error Deleting Quiz",error})
    }
}

exports.submitQuiz = async (req, res) => {
    const { id } = req.params;
    const answers = req.body.answers; // Ensure you're accessing the answers object from the body

    try {
        const quiz = await Quiz.findById(id); // Await the result of finding the quiz by ID
        if (!quiz) {
            return res.status(404).json({ message: "Quiz Not Found" });
        }

        let score = 0;
        // Loop through each question and check the answers
        quiz.questions.forEach((question) => {
            // Get the corresponding answer from the request body based on question ID
            const userAnswer = answers[question._id.toString()]; // Make sure the answer key matches the question's ID
            if (userAnswer === question.correctAnswer) {
                score += 1;
            }
        });

        const existingLeaderboardEntry = quiz.leaderboard.find(entry => entry.userId.toString() === req.user._id.toString())

        if(existingLeaderboardEntry){
            existingLeaderboardEntry.score = score
        }
        else{
        quiz.leaderboard.push({ userId: req.user._id, score });
        }

        await quiz.save();
        res.status(200).json({ message: "Quiz Submitted", score });
    } catch (error) {
        res.status(500).json({ message: "Error submitting quiz", details: error.message });
    }
};

exports.getLeaderboard = async(req,res)=>{
    const {id} = req.params

    try{
        const quiz = await Quiz.findById(id).populate("leaderboard.userId","name score")
    if(!quiz){
        return res.status(404).json({message:"Quiz Not Found"})
    }  
    const leaderboard = quiz.leaderboard.sort((a,b)=>b.score - a.score) 
    res.status(200).json({leaderboard}) 
    } catch(error){
        res.status(500).json({message:"Error Fetching Leaderborad",details:error.message})
    }
} 