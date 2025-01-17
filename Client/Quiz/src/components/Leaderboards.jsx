import React, { useEffect, useState } from 'react';
import { getQuizzes } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const QuizListWithLeaderboard = ({ showNavbar = true }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true); // User is logged in if the token exists
      } else {
        setIsLoggedIn(false);
        alert("Oh, you aren't logged in yet. Login now to see the available quiz lists.");
        navigate('/login');
      }
    };

    checkLoginStatus();

    if (isLoggedIn) {
      const fetchQuizzes = async () => {
        try {
          const data = await getQuizzes();
          setQuizzes(data);
          alert("Quizzes fetched successfully!"); // Alert on successful quizzes fetch
        } catch (error) {
          console.error('Error Fetching Quizzes: ', error);
          alert("Error fetching quizzes."); // Alert on error
        }
      };
      fetchQuizzes();
    }
  }, [isLoggedIn, navigate]);

  const handleNavigateToLeaderboard = (quizId) => {
    // Navigate to the Leaderboard page with the quizId
    navigate(`/quiz/${quizId}/leaderboard`);
  };

  return (
    <div className="quizList">
      {showNavbar && <Navbar />}
      <div className="quizlistcontainer">
        {isLoggedIn ? (
          <>
            <h1 style={{ textDecoration: 'underline' }}>Available Leaderboards:</h1>
            <ul>
              {quizzes.map((quiz) => (
                <li key={quiz._id}>
                  <h2>{quiz.title}</h2>
                  <p>{quiz.description}</p>
                  <p>No. Of Questions: {quiz.questions ? quiz.questions.length : 0}</p>
                  <p>Time: {quiz.timeLimit} Secs</p>
                  <button
                    onClick={() => handleNavigateToLeaderboard(quiz._id)}
                    style={{
                      background: 'white',
                      color: 'blue',
                      fontWeight: "800",
                      border: '2px solid blue',
                      borderRadius: '35px',
                      padding: '5px 10px',
                      marginTop: "10px",
                      cursor: 'pointer',
                    }}
                  >
                    View Leaderboard
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div>
            <h1 style={{ color: 'red' }}>Oh You Aren't Logged in yet, Login Now to see the available quiz lists</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizListWithLeaderboard;
