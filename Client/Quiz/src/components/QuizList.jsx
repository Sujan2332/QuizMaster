import React, { useEffect, useState } from 'react';
import { getQuizzes } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const QuizList = ({ showNavbar = true }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
        alert("Loading available quizzes...");
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
          setLoading(true); // Set loading to true when fetching begins
          const data = await getQuizzes();
          setQuizzes(data);
          setLoading(false); // Set loading to false once data is fetched
          alert("Quizzes loaded successfully!");
        } catch (error) {
          console.error('Error Fetching Quizzes: ', error);
          alert("Failed to load quizzes. Please try again later.");
          setLoading(false); // Set loading to false even if there’s an error
        }
      };
      fetchQuizzes();
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="quizList">
      {showNavbar && <Navbar />}
      <div className="quizlistcontainer">
        {loading ? ( // Show loading spinner if loading is true
          <div className="spinner">
            <div className="loading-spinner"></div> {/* You can use CSS to style this spinner */}
            <p>Loading quizzes...</p>
          </div>
        ) : isLoggedIn ? (
          <>
            <h1 style={{ textDecoration: 'underline' }}>Available Quizzes:</h1>
            <ul>
              {quizzes.map((quiz) => (
                <Link to={`/quiz/${quiz._id}`} key={quiz._id}>
                  <li>
                    <h2>{quiz.title}</h2>
                    <p>{quiz.description}</p>
                    <p>No. Of Questions: {quiz.questions ? quiz.questions.length : 0}</p>
                    <p>Time: {quiz.timeLimit} Secs</p>
                  </li>
                </Link>
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

export default QuizList;
