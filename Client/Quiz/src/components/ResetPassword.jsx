import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import { updatePassword } from '../services/api';

const ResetPassword = () => {
  const location = useLocation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false); // Toggle for new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for confirm password visibility
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Extract token from query params
  const getTokenFromURL = () => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('token');
  };

  const token = getTokenFromURL();

  useEffect(() => {
    if (!token) {
      setErrorMessage('Invalid or missing reset token.');
    }
  }, [token]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const response = await updatePassword(token, newPassword);
      alert(response.message || 'Password has been successfully reset!');
      setNewPassword('');
      setConfirmPassword('');
      navigate('/login');
    } catch (error) {
      console.error('Error resetting password:', error);
      setErrorMessage(error.response?.data?.message || 'Error resetting password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <Navbar />
      <div className="reset-main">
        {errorMessage && <p className="error">{errorMessage}</p>}
        <form onSubmit={handlePasswordReset} className="reset-form">
          <h1 style={{ textDecoration: "underline" }}>Reset Password</h1>

          {/* New Password Field */}
          <div className="password-field newpassword">
            <input
              type={showNewPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className='newpassword'
            />
            <span
              className="toggle-password"
              onClick={() => setShowNewPassword((prev) => !prev)}
            >
              {showNewPassword ? <i class="fa-solid fa-eye-slash"></i> :<i class="fa-solid fa-eye"></i>}
            </span>
          </div>

          {/* Confirm Password Field */}
          <div className="password-field newpassword">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <i class="fa-solid fa-eye-slash"></i> :<i class="fa-solid fa-eye"></i>}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
