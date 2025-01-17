import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/api';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';

const Leaderboard = () => {
  const { quizId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(leaderboard)
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard(quizId);
        setLeaderboard(data.leaderboard); 
        alert("Leaderboard fetched successfully!"); // Alert on successful leaderboard fetch
      } catch (error) {
        setError(error.message || 'Failed to fetch leaderboard');
        alert("Error fetching leaderboard."); // Alert on error
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [quizId]);

  if (loading) {
    return <div>Loading Leaderboard...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='leaderboard1'>
      <Navbar />
      <div className='leaderboardmain'>
        <h2 style={{ textDecoration: "underline" }}>Leaderboard : </h2>
        {leaderboard.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={entry._id}>
                  <td>{index + 1}</td>
                  <td>{entry.userId.name}</td> 
                  <td>{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Leaderboard data available yet.</p>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
