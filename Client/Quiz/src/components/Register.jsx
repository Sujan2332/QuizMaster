import React, { useState, useEffect } from 'react';
import { registerUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import robot from '../../public/assets/robot.gif';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the screen size matches mobile view
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMediaChange = (e) => setIsMobile(e.matches);

    // Set initial state
    setIsMobile(mediaQuery.matches);

    // Listen for changes
    mediaQuery.addEventListener('change', handleMediaChange);

    // Cleanup listener on component unmount
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ name, email, password });
      alert("Registration successful! Redirecting to login...");
      navigate('/login');
    } catch (error) {
      console.error('Error during Registration: ', error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="Register">
        <div className="registercontainer">
          <form onSubmit={handleSubmit} className="registerform">
            <h2>Register</h2>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Register</button>
            <h4
              type="submit"
              onClick={() => navigate('/login')}
              className="navreg"
            >
              Already User? Login
            </h4>
          </form>
        </div>
        {/* Conditionally render the registerright div */}
        {!isMobile && (
          <div className="registerright">
            {/* Image or content can be added here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
