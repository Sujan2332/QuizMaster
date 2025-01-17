import React, { useState, useEffect } from "react";
import { deleteQuiz, getQuizzes } from "../services/api"; // Assuming `getQuizzes` fetches the list of quizzes
import Navbar from "./Navbar";

const DeleteQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);

  // Fetch quizzes on component mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await getQuizzes();
        setQuizzes(response); // Assuming response contains a list of quizzes
      } catch (err) {
        alert("Error fetching quizzes."); // Display error in alert box
      }
    };
    fetchQuizzes();
  }, []);

  const handleDelete = async (quizId) => {
    try {
      const response = await deleteQuiz(quizId); // Pass the quizId to delete
      alert(response.message); // Show success message in an alert box
      
      // Remove the deleted quiz from the list without re-fetching all quizzes
      setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz._id !== quizId));
    } catch (err) {
      alert(err.message); // Show error message in an alert box
    }
  };

  return (
    <div className="delete">
      <Navbar />
      <div className="deletemain">
        <h1 style={{textDecoration:'underline'}}>Delete Quiz :</h1>

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
