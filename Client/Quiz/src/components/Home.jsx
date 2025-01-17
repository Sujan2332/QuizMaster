import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import QuizList from "./QuizList";
import Leaderboards from "./Leaderboards";
import Navbar from "./Navbar";
import { getQuizzes } from '../services/api';

const Home = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [randomQuiz, setRandomQuiz] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [user, setUser] = useState(null); // State to store user data
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check login status when the component mounts
    const checkLoginStatus = () => {
      const storedUser = localStorage.getItem("user"); // Fetch user from localStorage
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser); // Parse user data
        setUser(parsedUser);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();

    // Fetch quizzes if logged in
    if (isLoggedIn) {
      const fetchQuizzes = async () => {
        try {
          const data = await getQuizzes();
          setQuizzes(data);
        } catch (error) {
          console.error("Error fetching quizzes:", error);
        }
      };
      fetchQuizzes();
    }
  }, [isLoggedIn]);

  // Function to pick a random quiz
  const getRandomQuiz = () => {
    if (quizzes.length > 0) {
      const randomIndex = Math.floor(Math.random() * quizzes.length);
      return quizzes[randomIndex];
    }
    return null;
  };

  // Handle Quick Start button click
  const handleQuickStart = () => {
    const quiz = getRandomQuiz();
    if (quiz) {
      setRandomQuiz(quiz);
      navigate(`/quiz/${quiz._id}`);
    }
  };

  return (
    <div>
      {/* Conditionally render Navbar based on the route */}
      {location.pathname !== "/quiz" && <Navbar />}

      <div className="container">
        <div className="home">
          <div className="welcome-banner">
            {/* Display user's name if logged in */}
            <h1>Welcome {user ? user.name : "Guest"} to QuizMaster!!!</h1>
            <h3>Test your knowledge and challenge yourself with exciting quizzes!</h3>
          </div>

          {/* Quick Start */}
          <div className="quick-start">
            <h1>Quick Start</h1>
            <button onClick={handleQuickStart} className="btn">
              Start a Random Quiz
            </button>
          </div>

          <div className="home-sections" style={{ marginBottom: "20px" }}>
            {/* Quiz Categories */}
            <div className="categories">
              <h1>Explore Categories:</h1>
              {isLoggedIn ? (
                <QuizList showNavbar={false} />
              ) : (
                <button>
                  <Link to="/login">Log in to explore quizzes!</Link>
                </button>
              )}
            </div>

            {/* Leaderboard */}
            <div className="leaderboard">
              <h1 style={{ textDecoration: "underline" }}>Leaderboard :</h1>
              {isLoggedIn ? (
                <Leaderboards showNavbar={false} />
              ) : (
                <button>
                  <Link to="/login">Log in to view the leaderboard!</Link>
                </button>
              )}
              {!isLoggedIn && (
                <ul>
                  <li>Rank 1: John Doe</li>
                  <li>Rank 2: Jane Smith</li>
                  <li>Rank 3: Chris Johnson</li>
                </ul>
              )}
            </div>

            {/* Notifications */}
            <div className="notifications">
              <h2>Announcements</h2>
              <h3>🎉 New quizzes are going to be added soon!!! Stay tuned.</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
