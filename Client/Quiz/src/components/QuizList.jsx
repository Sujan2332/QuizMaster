import React, { useEffect, useState } from 'react';
import { getQuizzes } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const QuizList = ({ showNavbar = true }) => {  // Add a default prop to show Navbar by default
  const [quizzes, setQuizzes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true); // User is logged in if the token exists
        alert("You are logged in! Loading available quizzes...");
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
          alert("Quizzes loaded successfully!");
        } catch (error) {
          console.error('Error Fetching Quizzes: ', error);
          alert("Failed to load quizzes. Please try again later.");
        }
      };
      fetchQuizzes();
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="quizList">
      {showNavbar && <Navbar />} {/* Only render Navbar if showNavbar is true */}
      <div className="quizlistcontainer">
        {isLoggedIn ? (
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
