import React, { useState } from 'react';
import { createQuiz } from '../services/api';
import Navbar from './Navbar';
import Papa from 'papaparse'; 

const CreateQuiz = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questions: [{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }],
    timeLimit: "",
  });

  const [loading, setLoading] = useState(false); // New state for loading

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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    if (file.type === "application/json") {
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          validateAndSetData(data);
        } catch (err) {
          alert("Invalid JSON file format.");
        }
      };
      reader.readAsText(file);
    } else if (file.type === "text/csv") {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          validateAndSetData(formatCSVData(results.data));
        },
        error: () => alert("Error parsing CSV file."),
      });
    } else {
      alert("Please upload a valid JSON or CSV file.");
    }
  };

  const formatCSVData = (csvData) => {
    return {
      title: csvData[0]?.title || "",
      description: csvData[0]?.description || "",
      timeLimit: csvData[0]?.timeLimit || "",
      questions: csvData.map((row) => ({
        questionText: row.questionText,
        options: [row.option1, row.option2, row.option3, row.option4],
        correctAnswer: row.correctAnswer,
      })),
    };
  };

  const validateAndSetData = (data) => {
    if (
      data.title &&
      data.description &&
      data.timeLimit &&
      Array.isArray(data.questions) &&
      data.questions.every(
        (q) =>
          q.questionText &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          q.correctAnswer
      )
    ) {
      setFormData(data);
      alert("File uploaded successfully!");
    } else {
      alert("Invalid data format in the uploaded file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    try {
      const response = await createQuiz(formData); 
      alert(response.message);
      setFormData({
        title: "",
        description: "",
        questions: [{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }],
        timeLimit: "",
      });
    } catch (err) {
      alert("Error: " + err.message); 
    } finally {
      setLoading(false); // Set loading to false after completion
    }
  };

  return (
    <div className="createquiz">
      <Navbar />
      <div className="createquizmain">
        {loading &&  <div className="spinner">
            <div className="loading-spinner"></div>
          </div>}
        <form onSubmit={handleSubmit} className="createquizform">
          <h1 style={{ textDecoration: "underline" }}>Create Quiz :</h1>
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
            placeholder="Time Limit (in seconds)"
            onChange={handleInputChange}
            required
          />
          <input
            type="file"
            accept=".json, .csv"
            onChange={handleFileUpload}
            style={{ margin: "10px 0" }}
          />
          {formData.questions.map((question, index) => (
            <div key={index} className="createform">
              <textarea
                type="text"
                placeholder={`Question ${index + 1}`}
                value={question.questionText}
                onChange={(e) =>
                  handleQuestionChange(index, "questionText", e.target.value)
                }
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
                onChange={(e) =>
                  handleQuestionChange(index, "correctAnswer", e.target.value)
                }
                required
              />
            </div>
          ))}
          <div className="formbtns">
            <button type="button" onClick={addQuestion}>
              Add Question
            </button>
            <button type="submit" disabled={loading}> {/* Disable button when loading */}
              {loading ? "Submitting..." : "Create Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
