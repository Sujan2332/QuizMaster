import React, { useState, useEffect } from 'react';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMediaChange = (e) => setIsMobile(e.matches);

    setIsMobile(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleMediaChange);

    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      alert('Login successful!');
      navigate('/home');
    } catch (err) {
      console.error('Error during login: ', err);
      alert('Login failed. Please check your email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/forgot-password`,
        { email: email }
      );
      alert(response.data.message || 'Password reset email sent!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error sending reset email:', error);
      alert(error.response?.data?.message || 'Error sending reset email.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="Register">
        <div className="registercontainer">
          <form onSubmit={handleSubmit} className="registerform">
            <h2>Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="password-field newpassword">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
              style={{top:"45%"}}
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <i class="fa-solid fa-eye-slash"></i> :<i class="fa-solid fa-eye"></i>}
              </span>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <h4
              type="button"
              onClick={() => navigate('/register')}
              className="navreg"
              style={{ marginBottom: '0px' }}
            >
              New User? Signup
            </h4>
            <p
              className="forgot-password"
              onClick={() => setIsModalOpen(true)}
              style={{
                cursor: 'pointer',
                color: 'blue',
                fontSize: '18px',
                fontWeight: '600',
                marginTop: '-10px',
              }}
            >
              Forgot Password?
            </p>
          </form>
        </div>
        {!isMobile && <div className="registerright"></div>}
      </div>

      {/* Modal for Forgot Password */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2 style={{ margin: '10px', textDecoration: 'underline' }}>
              Forgot Password
            </h2>
            <p>Enter your email to receive a password reset link:</p>
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={resetLoading}>
                {resetLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <button
              onClick={() => setIsModalOpen(false)}
              className="close-modal"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
