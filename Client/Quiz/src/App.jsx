import React, { useState, useEffect } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import QuizList from "./components/QuizList";
import QuizDetail from "./components/QuizDetail";
import Home from "./components/Home"; // Corrected Home import
import Leaderboard from "./components/Leaderboard";
import CreateQuiz from "./components/CreateQuiz";
import UpdateQuiz from "./components/UpdateQuiz";
import DeleteQuiz from "./components/DeleteQuiz";
import Navbar from "./components/Navbar";
import Leaderboards from "./components/Leaderboards";
import "./App.css"

// Styles
// Dark
import "../public/styles/Register.css";
import "../public/styles/QuizList.css";
import "../public/styles/QuizDetails.css";
import "../public/styles/navbar.css";
import "../public/styles/Leaderboard.css";
import "../public/styles/DeleteQuiz.css";
import "../public/styles/CreateQuiz.css";

// Light
import "../public/styles/CreateQuizLight.css";
import "../public/styles/RegisterLight.css";
import "../public/styles/QuizListLight.css";
import "../public/styles/QuizDetailsLight.css";
import "../public/styles/navbarlight.css";
import "../public/styles/DeleteQuizLight.css";
import "../public/styles/LeaderboardLight.css";

// CustomAlert Component
export const CustomAlert = ({ message, onClose }) => {
  return (
    <div className="custom-alert">
      <p>{message}</p>
      <button onClick={onClose}><i className="fa-solid fa-circle-xmark"></i></button>
    </div>
  );
};

const App = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Handle theme changes
  useEffect(() => {
    // Apply the loading class immediately to prevent flicker of theme
    document.body.classList.add('loading');
    
    const loadStyles = (theme) => {
      const head = document.head;

      // Remove any previous theme-related stylesheets
      Array.from(document.querySelectorAll("link[data-theme]")).forEach((link) =>
        head.removeChild(link)
      );
      
      // Choose the appropriate stylesheets for dark or light theme
      const stylesheets = theme === 'dark'
        ? [
            "../public/styles/Register.css",
            "../public/styles/QuizList.css",
            "../public/styles/QuizDetails.css",
            "../public/styles/navbar.css",
            "../public/styles/Leaderboard.css",
            "../public/styles/DeleteQuiz.css",
            "../public/styles/CreateQuiz.css",
            "../public/styles/Home.css"
          ]
        : [
            "../public/styles/RegisterLight.css",
            "../public/styles/QuizListLight.css",
            "../public/styles/QuizDetailsLight.css",
            "../public/styles/navbarLight.css",
            "../public/styles/LeaderboardLight.css",
            "../public/styles/DeleteQuizLight.css",
            "../public/styles/CreateQuizLight.css",
            "../public/styles/HomeLight.css"
          ];
      
      // Dynamically load the stylesheets
      stylesheets.forEach((href) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        link.setAttribute("data-theme", theme);
        head.appendChild(link);
      });
    };

    const theme = isDarkTheme ? 'dark' : 'light';
    loadStyles(theme);
    
    localStorage.setItem('theme', theme);

    const timer = setTimeout(() => {
      document.body.classList.remove('loading');
    }, 500); // Same time as the transition duration

    return () => {
      clearTimeout(timer);
      Array.from(document.querySelectorAll("link[data-theme]")).forEach((link) =>
        document.head.removeChild(link)
      );
    };
  }, [isDarkTheme]);

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
  };

  useEffect(() => {
    // Override the default alert globally
    window.alert = (message) => {
      setAlertMessage(message);
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(""); // Clear message for next alerts
      }, 5000);
    };
  }, []);

  const closeAlert = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  // Extract user and isAdmin from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.isAdmin;

  return (
    <div className="app">
      <div className="loading"></div>
      <span className={isDarkTheme ? "dark-theme" : "light-theme"}>
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {isDarkTheme ? <i className="fa-solid fa-moon"></i> : <i className="fa-solid fa-sun"></i>}
        </button>
      </span>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/navbar" element={<Navbar />} />
            <Route path="/quiz" element={<QuizList />} />
            <Route path="/quiz/:id" element={<QuizDetail />} />
            <Route path="/quiz/:quizId/leaderboard" element={<Leaderboard />} />
            <Route path="/leaderboards" element={<Leaderboards />} />

            {/* Admin-only routes */}
            {isAdmin && (
              <>
                <Route path="/createquiz" element={<CreateQuiz />} />
                <Route path="/updatequiz" element={<UpdateQuiz />} />
                <Route path="/deletequiz" element={<DeleteQuiz />} />
              </>
            )}
          </Routes>
        </div>
      </Router>

      {/* Custom Alert */}
      {showAlert && <CustomAlert message={alertMessage} onClose={closeAlert} />}
    </div>
  );
};

export default App;
