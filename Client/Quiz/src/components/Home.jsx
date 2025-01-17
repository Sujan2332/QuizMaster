import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import QuizList from "./QuizList";
import Leaderboards from "./Leaderboards";
import Navbar from "./Navbar";
import { getQuizzes } from "../services/api";

const Home = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [randomQuiz, setRandomQuiz] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading spinner
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkLoginStatus = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();

    if (isLoggedIn) {
      const fetchQuizzes = async () => {
        setLoading(true); // Show spinner
        try {
          const data = await getQuizzes();
          setQuizzes(data);
        } catch (error) {
          console.error("Error fetching quizzes:", error);
          alert("Error fetching quizzes.");
        } finally {
          setLoading(false); // Hide spinner
        }
      };
      fetchQuizzes();
    }
  }, [isLoggedIn]);

  const getRandomQuiz = () => {
    if (quizzes.length > 0) {
      const randomIndex = Math.floor(Math.random() * quizzes.length);
      return quizzes[randomIndex];
    }
    return null;
  };

  const handleQuickStart = () => {
    setLoading(true); // Show spinner
    const quiz = getRandomQuiz();
    if (quiz) {
      setRandomQuiz(quiz);
      alert(`Starting quiz: ${quiz.title}`);
      navigate(`/quiz/${quiz._id}`);
    } else {
      alert("No quizzes available to start.");
    }
    setLoading(false); // Hide spinner
  };

  return (
    <div>
      {location.pathname !== "/quiz" && <Navbar />}

      <div className="container">
        <div className="home">
          <div className="welcome-banner">
            <h1>Welcome {user ? user.name : "Guest"} to QuizMaster!!!</h1>
            <h3>Test your knowledge and challenge yourself with exciting quizzes!</h3>
          </div>

          {loading ? (
            <div className="spinner">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <>
              <div className="quick-start">
                <h1>Quick Start</h1>
                <button onClick={handleQuickStart} className="btn">
                  Start a Random Quiz
                </button>
              </div>

              <div className="home-sections" style={{ marginBottom: "20px" }}>
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

                <div className="notifications">
                  <h2>Announcements</h2>
                  <h3>🎉 New quizzes are going to be added soon!!! Stay tuned.</h3>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
