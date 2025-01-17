import React, { useState, useEffect } from "react";
import { deleteQuiz, getQuizzes } from "../services/api";
import Navbar from "./Navbar";

const DeleteQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await getQuizzes();
        setQuizzes(response);
      } catch (err) {
        alert("Error fetching quizzes.");
      }
    };
    fetchQuizzes();
  }, []);

  const handleDelete = async (quizId) => {
    try {
      const response = await deleteQuiz(quizId);
      alert(response.message);
      setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz._id !== quizId));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="delete">
      <Navbar />
      <div className="deletemain">
        <h1 style={{ textDecoration: 'underline' }}>Delete Quiz :</h1>

        <ul className="deleteul">
          {quizzes.map((quiz, index) => (
            <li key={quiz._id}>
              <span>{index + 1}. {quiz.title}</span>
              <button onClick={() => handleDelete(quiz._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DeleteQuiz;
