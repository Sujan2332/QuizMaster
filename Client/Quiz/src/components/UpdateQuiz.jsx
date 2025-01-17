import React, { useState, useEffect } from "react";
import { getQuizzes, updateQuiz } from "../services/api";
import Navbar from "./Navbar";

const UpdateQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questions: [{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }],
    timeLimit: "",
  });
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true); // Start loading
      try {
        const response = await getQuizzes();
        setQuizzes(response);
      } catch (err) {
        alert("Failed to load quizzes");
      } finally {
        setLoading(false); // Stop loading after fetch is done
      }
    };

    fetchQuizzes();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][field] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
      ],
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleQuizSelect = (quizId) => {
    setSelectedQuizId(quizId);
    const selectedQuiz = quizzes.find((quiz) => quiz._id === quizId);
    if (selectedQuiz) {
      setFormData({
        title: selectedQuiz.title,
        description: selectedQuiz.description,
        questions: selectedQuiz.questions || [{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }],
        timeLimit: selectedQuiz.timeLimit,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading while submitting the quiz
    try {
      const response = await updateQuiz(selectedQuizId, formData);
      alert(`${response.message}`);
    } catch (err) {
      alert(`Error Updating Quiz: ${err.message}`);
    } finally {
      setLoading(false); // Stop loading after submission is done
    }
  };

  return (
    <div className="createquiz">
      <Navbar />
      <div className="createquizmain">
        <h1 style={{ textDecoration: "underline" }}>Update Quiz:</h1>
        {loading && (
          <div className="spinner">
            <div className="loading-spinner"></div>
          </div>
        )}

        {!selectedQuizId && !loading && (
          <div className="selection">
            <h3>Select a Quiz to Update:</h3>
            <ul>
              {quizzes.map((quiz, index) => (
                <li key={quiz._id}>
                  <p>{index + 1}. {quiz.title}</p>
                  <button onClick={() => handleQuizSelect(quiz._id)}>Update</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedQuizId && !loading && (
          <form onSubmit={handleSubmit} className="createquizform">
            <input
              type="text"
              name="title"
              value={formData.title}
              placeholder="Quiz Title"
              onChange={handleInputChange}
              required
            />
            <textarea
              name="description"
              value={formData.description}
              placeholder="Quiz Description"
              onChange={handleInputChange}
              required
            ></textarea>
            <input
              type="number"
              name="timeLimit"
              value={formData.timeLimit}
              placeholder="Time Limit (in minutes)"
              onChange={handleInputChange}
              required
            />

            {Array.isArray(formData.questions) &&
              formData.questions.length > 0 &&
              formData.questions.map((question, index) => (
                <div key={index} className="createform">
                  <textarea
                    type="text"
                    placeholder={`Question ${index + 1}`}
                    value={question.questionText}
                    onChange={(e) => handleQuestionChange(index, "questionText", e.target.value)}
                    required
                    className="question"
                  />
                  {question.options.map((option, i) => (
                    <input
                      key={i}
                      type="text"
                      placeholder={`Option ${i + 1}`}
                      value={question.options[i]}
                      onChange={(e) =>
                        handleQuestionChange(index, "options", [
                          ...question.options.slice(0, i),
                          e.target.value,
                          ...question.options.slice(i + 1),
                        ])
                      }
                      required
                    />
                  ))}
                  <input
                    type="text"
                    placeholder="Correct Answer"
                    value={question.correctAnswer}
                    onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => removeQuestion(index)} className="removebtn">
                    Remove Question
                  </button>
                </div>
              ))}
            <div className="formbtns">
              <button type="button" onClick={addQuestion}>
                Add Question
              </button>

              <button type="submit">Update Quiz</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateQuiz;
