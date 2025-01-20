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
import ResetPassword from "./components/ResetPassword"; // Import ResetPassword component
import "./App.css";

// CustomAlert Component
export const CustomAlert = ({ message, onClose }) => {
  return (
    <div className="custom-alert">
      <p>{message}</p>
      <button onClick={onClose}>
        <i className="fa-solid fa-circle-xmark"></i>
      </button>
    </div>
  );
};

const App = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  // Handle theme changes
  useEffect(() => {
    document.body.classList.add("loading");

    const loadStyles = (theme) => {
      const head = document.head;

      Array.from(document.querySelectorAll("link[data-theme]")).forEach((link) =>
        head.removeChild(link)
      );

      const stylesheets =
        theme === "dark"
          ? [
              "/styles/Register.css",
              "/styles/QuizList.css",
              "/styles/QuizDetails.css",
              "/styles/navbar.css",
              "/styles/Leaderboard.css",
              "/styles/DeleteQuiz.css",
              "/styles/CreateQuiz.css",
              "/styles/Home.css",
              "/styles/ResetPassword.css"
            ]
          : [
              "/styles/RegisterLight.css",
              "/styles/QuizListLight.css",
              "/styles/QuizDetailsLight.css",
              "/styles/navbarLight.css",
              "/styles/LeaderboardLight.css",
              "/styles/DeleteQuizLight.css",
              "/styles/CreateQuizLight.css",
              "/styles/HomeLight.css",
              "/styles/ResetPasswordLight.css"
            ];

      stylesheets.forEach((href) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        link.setAttribute("data-theme", theme);
        head.appendChild(link);
      });
    };

    const theme = isDarkTheme ? "dark" : "light";
    loadStyles(theme);

    localStorage.setItem("theme", theme);

    const timer = setTimeout(() => {
      document.body.classList.remove("loading");
    }, 500);

    return () => {
      clearTimeout(timer);
      Array.from(document.querySelectorAll("link[data-theme]")).forEach((link) =>
        document.head.removeChild(link)
      );
    };
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
  };

  useEffect(() => {
    window.alert = (message) => {
      setAlertMessage(message);
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
        setAlertMessage("");
      }, 5000);
    };
  }, []);

  const closeAlert = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.isAdmin;

  return (
    <div className="app">
      <div className="loading"></div>
      <span className={isDarkTheme ? "dark-theme" : "light-theme"}>
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {isDarkTheme ? (
            <i className="fa-solid fa-moon"></i>
          ) : (
            <i className="fa-solid fa-sun"></i>
          )}
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

            {/* Reset Password Route */}
            <Route path="/reset-password" element={<ResetPassword />} />

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
