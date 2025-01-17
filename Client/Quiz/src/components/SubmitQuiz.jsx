import React ,{useState} from 'react'
import { submitQuiz } from '../services/api'
import { useNavigate } from 'react-router-dom'
const SubmitQuiz = ({quizId,answers, onSubmit }) => {
    const [submitted,setSubmitted] = useState(false)
    const [score,setScore] = useState(null)
    const navigate = useNavigate()

  const handleSubmit = async ()=>{
    const token = localStorage.getItem("token")
    try{
     onSubmit(); 
        const data = await submitQuiz(quizId,answers,token)
        alert(`Quiz Submitted! Your Score: ${data.score}`)
        setScore(data.score)
        setSubmitted(true)
    }catch(error){
        console.error("Error Submitting Quiz: ",error)
    }
  }

  const navLeaderboard = ()=>{
    navigate(`/quiz/${quizId}/leaderboard`)
  }

  const navCategories = ()=>{
    navigate('/quiz')
  }

  const handleSubmitClick = () => {
    onSubmit(); // Trigger the onSubmit prop to mark quiz as submitted
};

    return (
    <div className='submit'>
        {!submitted ? (
      <button onClick={handleSubmit} className='submitbtn'>Submit Quiz</button>
        ):(
            <div className='submitmain'>
                <p>Quiz Submitted! You Score : {score}</p>
                <div className='aftersubmit'>
                    <button onClick={navCategories}>
                        Explore Other Quizzes
                    </button>
                    <button onClick={navLeaderboard}>
                        View LeaderBoard
                    </button>
                </div>
            </div>
        )}
    </div>
  )
}

export default SubmitQuiz
