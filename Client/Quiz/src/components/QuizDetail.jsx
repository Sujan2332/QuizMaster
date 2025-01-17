import React, { useEffect, useState } from 'react';
import { getQuizById } from '../services/api';
import { useParams } from 'react-router-dom';
import SubmitQuiz from "./SubmitQuiz";
import Navbar from './Navbar';

const QuizDetail = () => {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0); // State to track remaining time
    const [timerActive, setTimerActive] = useState(false); // To control the timer state

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const data = await getQuizById(id);
                setQuiz(data);
                setTimeLeft(data.timeLimit); // Set time from the quiz data
                setTimerActive(true); // Start the timer
            } catch (error) {
                console.error("Error fetching quiz details: ", error);
            }
        };
        fetchQuiz();
    }, [id]);

    useEffect(() => {
        let timer;
        if (timerActive && timeLeft > 0) {
            // Start countdown timer only if timer is active and timeLeft is greater than 0
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && timerActive) {
            // Submit quiz only when time runs out and timerActive is true
            handleQuizSubmit();
            setTimerActive(false); // Stop the timer after submitting the quiz
        }
    
        return () => clearInterval(timer); // Cleanup timer on unmount
    }, [timeLeft, timerActive]); // Only depend on timeLeft and timerActive    

    const handleAnswerChange = (questionId, answer) => {
        if (!isSubmitted) {
            setAnswers((prev) => ({ ...prev, [questionId]: answer }));
        }
    };

    const handleQuizSubmit = () => {
        setIsSubmitted(true);
        setTimerActive(false); // Stop the timer once the quiz is submitted
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    if (!quiz) return <div>Loading...</div>;

    const question = quiz.questions[currentQuestionIndex];

    return (
        <div className='quizdetails'>
            <Navbar />
            <div className='quizmain'>
            <div className='timer'>
                <h2>{quiz.title} [<span style={{ fontSize: "20px", fontWeight: "200", textDecoration: "none" }}>{quiz.description}</span>]</h2>
                    <h3 className='time'>Time Left: {timeLeft}s</h3> {/* Display remaining time */}
                </div>
                <div className='quizdetailscontainer'>
                    <h2>Questions:</h2>
                    <div className='question-container'>
                        <h3>
                            <strong>Q{currentQuestionIndex + 1}: </strong>
                            {question.questionText}
                        </h3>
                        <ul className='subul'>
                            {question.options.map((option, optionIndex) => (
                                <li key={optionIndex}>
                                    <label className='options'>
                                        <input
                                            type="radio"
                                            name={`question-${currentQuestionIndex}`}
                                            value={option}
                                            onChange={() => handleAnswerChange(question._id, option)}
                                            checked={answers[question._id] === option}
                                            disabled={isSubmitted}
                                        />
                                        <span style={{ paddingLeft: "10px" }}>{option}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                        {isSubmitted && (
                            <p style={{ color: question.correctAnswer === answers[question._id] ? 'green' : 'red' }}>
                                <strong>
                                    <span style={{ textDecoration: "underline" }}>
                                        Correct Answer</span> : {question.correctAnswer}
                                </strong>
                            </p>
                        )}
                    </div>
                    <div className='navigation-buttons'>
                        {currentQuestionIndex > 0 && (
                            <button onClick={handlePreviousQuestion}><i className="fa-solid fa-arrow-left"></i> Previous</button>
                        )}
                        {currentQuestionIndex < quiz.questions.length - 1 && (
                            <button onClick={handleNextQuestion}>Next <i className="fa-solid fa-arrow-right" style={{ paddingLeft: "10px", paddingRight: "0px" }}></i></button>
                        )}
                    </div>
                </div>
                {/* SubmitQuiz component will handle the submission logic */}
                <SubmitQuiz quizId={id} answers={answers} onSubmit={handleQuizSubmit} />
            </div>
        </div>
    );
};

export default QuizDetail;
