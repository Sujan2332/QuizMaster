import React, { useEffect, useState } from 'react';
import { getQuizzes } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const QuizListWithLeaderboard = ({ showNavbar = true }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        alert("Oh, you aren't logged in yet. Login now to see the available quiz lists.");
        navigate('/login');
      }
    };

    const fetchQuizzes = async () => {
        setLoading(true)
      try {
        const data = await getQuizzes();
        setQuizzes(data);
        alert("Quizzes fetched successfully!"); // Alert on successful quizzes fetch
      } catch (err) {
        console.error('Error Fetching Quizzes: ', err);
        setError('Failed to fetch quizzes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();

    if (isLoggedIn) {
      fetchQuizzes();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, navigate]);

  const handleNavigateToLeaderboard = (quizId) => {
    navigate(`/quiz/${quizId}/leaderboard`);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="quizList">
      {showNavbar && <Navbar />}
      <div className="quizlistcontainer">
        {isLoggedIn ? (
          <>
            <h1 style={{ textDecoration: 'underline' }}>Available Leaderboards:</h1>
            {loading && (
                <div className="spinner">
                <div className="loading-spinner"></div>
              </div>
            )}
            {quizzes.length > 0 ? (
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
            ) : (
              <p style={{textAlign:"center"}}>No quizzes available at the moment. Please check back later.</p>
            )}
          </>
        ) : (
          <div>
            <h1 style={{ color: 'red' }}>Oh, you aren't logged in yet. Login now to see the available quiz lists.</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizListWithLeaderboard;
