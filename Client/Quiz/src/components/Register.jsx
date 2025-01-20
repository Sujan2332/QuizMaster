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
  const [loading, setLoading] = useState(false); // Add loading state
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

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
    setLoading(true); // Set loading to true when registration starts
    try {
      await registerUser({ name, email, password });
      setLoading(false); // Set loading to false when registration is successful
      alert("Registration successful! Redirecting to login...");
      navigate('/login');
    } catch (error) {
      setLoading(false); // Set loading to false if there’s an error
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
            <div className="password-container newpassword">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
              style={{top:"45%"}}
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
              >
                {showPassword ? <i class="fa-solid fa-eye-slash"></i> :<i class="fa-solid fa-eye"></i>}
              </span>
            </div>
            <button type="submit" disabled={loading}>
              Register
            </button>
            {/* Show loading spinner if the loading state is true */}
            {loading && (
              <div className="spinner">
                <div className="loading-spinner"></div>
                <h6>Registering, please wait...</h6>
              </div>
            )}
            <h4 onClick={() => navigate('/login')} className="navreg">
              Already a User? Login
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
