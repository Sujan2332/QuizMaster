import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/api';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import { jsPDF } from 'jspdf';
import badge1 from "../assets/badge1.png"
import certifed from "../assets/certified.png"

const Leaderboard = () => {
  const { quizId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null); // Store logged-in user ID
  const [quizDetails, setQuizDetails] = useState({}); // Store quiz details

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // Assuming the user info is stored in localStorage
    setLoggedInUser(user?._id);

    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard(quizId); // Fetch data from backend
        console.log("Data", data);
        setLeaderboard(data.leaderboard);
        setQuizDetails({
          title: data.title,
          timeLimit: data.timeLimit,
          numberOfQuestions: data.numberOfQuestions,
        });
        alert('Leaderboard fetched successfully!');
      } catch (error) {
        setError(error.message || 'Failed to fetch leaderboard');
        alert('Error fetching leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [quizId]);

  const calculateRemarks = (percentage) => {
    if (percentage < 35) return "Better luck next time! Keep trying!";
    if (percentage >= 35 && percentage < 50) return "Good effort, keep improving!";
    if (percentage >= 50 && percentage < 60) return "Well done, but there's room for improvement.";
    if (percentage >= 60 && percentage < 75) return "Great job, you're almost there!";
    if (percentage >= 75 && percentage < 85) return "Excellent work!";
    if (percentage >= 85 && percentage < 90) return "Outstanding performance!";
    if (percentage >= 90 && percentage < 95) return "Exceptional, you're a pro!";
    return "Perfect! You've aced it!";
  };
  
  const generateCertificate = (name, score) => {
    const { title, timeLimit, numberOfQuestions } = quizDetails;
    const percentage = (score / numberOfQuestions) * 100; // Calculate the percentage
    const remarks = calculateRemarks(percentage); // Get remarks based on the percentage
  
    const doc = new jsPDF('landscape'); // Set orientation to landscape
  
    // Set background color and pattern
    doc.setFillColor(230, 240, 255); // Light pastel background
    doc.rect(10, 10, 277, 190, 'F'); // Full background
  
    // Add a solid border instead of dashed
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190); // Outer border
  
    // Add badge/image to the top-left corner (adjust size and position as needed)
    const imageXLeft = 30; // X position for top-left corner
    const imageYTop = 20;  // Y position for top-left corner
    const imageWidth = 60; // Image width
    const imageHeight = 60; // Image height
    doc.addImage(badge1, 'PNG', imageXLeft, imageYTop, imageWidth, imageHeight);
  
    // Add badge/image to the top-right corner (adjust size and position as needed)
    const imageXRight = 210; // X position for top-right corner
    doc.addImage(badge1, 'PNG', imageXRight, imageYTop, imageWidth, imageHeight);

    const imageXBottom = 30; // X position for bottom-left corner
    const imageYBottom = 130; // Y position for bottom-left corner (near the bottom of the page)
    const imageWidthBottom = 60; // Image width
    const imageHeightBottom = 60; // Image height
    doc.addImage(certifed, 'PNG', imageXBottom, imageYBottom, imageWidthBottom, imageHeightBottom);
  
    // Certificate Title (Bold, Italic & Underlined)
    doc.setFont('Times', 'bolditalic');
    doc.setFontSize(30);
    const titleText = 'Certificate of Achievement';
    const titleWidth = doc.getTextWidth(titleText);
    doc.text(titleText, 148.5, 40, { align: 'center' });
    doc.line(148.5 - titleWidth / 2, 42, 148.5 + titleWidth / 2, 42); // Draw underline
  
    // Subtitle (Bold & Italic)
    doc.setFont('Times', 'bolditalic');
    doc.setFontSize(16);
    doc.text('This certifies that', 148.5, 60, { align: 'center' });
  
    // Recipient Name (In uppercase, Bold, Italic & Underlined)
    const capitalizedName = name.toUpperCase();
    doc.setFont('Times', 'bolditalic');
    doc.setFontSize(24);
    const nameWidth = doc.getTextWidth(capitalizedName);
    doc.text(capitalizedName, 148.5, 80, { align: 'center' });
    doc.line(148.5 - nameWidth / 2, 82, 148.5 + nameWidth / 2, 82); // Draw underline
  
    // Achievement Details (Bold & Italic)
    doc.setFont('Times', 'bolditalic');
    doc.setFontSize(16);
    doc.text(
      `has successfully completed the Quiz titled "${title}"`,
      148.5,
      100,
      { align: 'center' }
    );
    doc.text(
      `with a time limit of ${timeLimit} seconds, ${numberOfQuestions} questions, and a score of ${score} (${percentage.toFixed(2)}%).`,
      148.5,
      115,
      { align: 'center' }
    );
  
    // Remarks (Bold, Italic & Underlined, with color based on performance)
    doc.setFont('Times', 'bolditalic');
    doc.setFontSize(18);
    const remarksText = `Remarks: ${remarks}`;
    const remarksWidth = doc.getTextWidth(remarksText);
  
    let remarksColor = [0, 0, 0]; // Default color (black)
    switch (remarks) {
      case "Better luck next time!":
        remarksColor = [255, 0, 0]; // Red for poor performance
        break;
      case "Good effort, keep improving!":
        remarksColor = [255, 165, 0]; // Orange for medium performance
        break;
      case "Well done, but there's room for improvement.":
        remarksColor = [255, 255, 0]; // Yellow for decent performance
        break;
      case "Great job, you're almost there!":
        remarksColor = [0, 128, 0]; // Green for good performance
        break;
      case "Excellent work!":
        remarksColor = [0, 0, 255]; // Blue for very good performance
        break;
      case "Outstanding performance!":
        remarksColor = [75, 0, 130]; // Indigo for excellent performance
        break;
      case "Exceptional, you're a pro!":
        remarksColor = [138, 43, 226]; // Violet for extraordinary performance
        break;
      default:
        remarksColor = [0, 255, 0]; // Green for perfect performance
        break;
    }
  
    doc.setTextColor(...remarksColor);
    doc.text(remarksText, 148.5, 130, { align: 'center' });
  
    // Thinner line for underline
    doc.setLineWidth(0.3); // Set a thinner line width
    doc.line(148.5 - remarksWidth / 2, 132, 148.5 + remarksWidth / 2, 132); // Draw underline
  
    // Footer Message (Bold & Italic)
    doc.setFont('Times', 'bolditalic');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Reset text color to black
    doc.text('Congratulations on your performance!', 148.5, 150, { align: 'center' });
  
    // Signature Line and Name (Bold & Italic)
    doc.setFont('Times', 'bolditalic');
    doc.text('Signed by', 220, 160, { align: 'center' });
  
    // Then, draw the underline
    doc.line(200, 162, 240, 162); // Signature line
  
    // Finally, print the name "Sai Sujan S"
    doc.text('Sai Sujan S', 220, 170, { align: 'center' });
  
    // Download the PDF
    doc.save(`${capitalizedName}_Certificate.pdf`);
  };
  

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='leaderboard1'>
      <Navbar />
      <div className='leaderboardmain'>
        <h2 style={{ textDecoration: 'underline' }}>Leaderboard:</h2>
        {loading && (
          <div className="spinner">
            <div className="loading-spinner"></div>
            <p>Loading Leaderboard...</p>
          </div>
        )}
        {leaderboard.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Score</th>
                <th>Certificate</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={entry._id}>
                  <td>{index + 1}</td>
                  <td>{entry.userId.name}</td>
                  <td>{entry.score}</td>
                  <td>
                    {loggedInUser === entry.userId._id ? ( // Show button only for logged-in user
                      <button
                        onClick={() => generateCertificate(entry.userId.name, entry.score)}
                        style={{
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          cursor: 'pointer',
                          borderRadius: '5px'
                        }}
                      >
                        Download
                      </button>
                    ):(
                      <span>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: 'center' }}>
            No Leaderboard data available yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
