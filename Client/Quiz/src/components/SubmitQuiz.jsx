import React, { useState } from 'react';
import { submitQuiz } from '../services/api';
import { useNavigate } from 'react-router-dom';

const SubmitQuiz = ({ quizId, answers, onSubmit }) => {
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    setLoading(true); // Set loading to true when submission starts
    try {
      onSubmit(); 
      const data = await submitQuiz(quizId, answers, token);
      setLoading(false); // Set loading to false when submission is successful
      alert(`Quiz Submitted! Your Score: ${data.score}`);
      setScore(data.score);
      setSubmitted(true);
    } catch (error) {
      setLoading(false); // Set loading to false if there’s an error
      console.error('Error Submitting Quiz: ', error);
      alert('There was an error submitting the quiz. Please try again.');
    }
  };

  const navLeaderboard = () => {
    navigate(`/quiz/${quizId}/leaderboard`);
  };

  const navCategories = () => {
    navigate('/quiz');
  };

  const handleSubmitClick = () => {
    onSubmit(); // Trigger the onSubmit prop to mark quiz as submitted
  };

  return (
    <div className="submit">
      {!submitted ? (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-evenly"}}>
          <button onClick={handleSubmit} className="submitbtn" disabled={loading}>
            Submit Quiz
          </button>
          {/* <br /> */}
          {/* Show loading spinner if loading is true */}
          {loading && (
            <div className="spinner">
              <div className="loading-spinner"></div>
              <p>Submitting your quiz, please wait...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="submitmain">
          <p>Quiz Submitted! Your Score: {score}</p>
          <div className="aftersubmit">
            <button onClick={navCategories}>Explore Other Quizzes</button>
            <button onClick={navLeaderboard}>View LeaderBoard</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitQuiz;
