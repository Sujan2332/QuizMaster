import React, { useState, useEffect } from 'react';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMediaChange = (e) => setIsMobile(e.matches);

    setIsMobile(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleMediaChange);

    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, password });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user)); 

      alert('Login successful!');
      
      navigate('/home');
    } catch (err) {
      console.error('Error during login: ', err);
      alert('Login failed. Please check your email or password.');
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
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
            <h4
              type="submit"
              onClick={() => navigate('/register')}
              className="navreg"
            >
              New User? Signup
            </h4>
          </form>
        </div>
        {!isMobile && <div className="registerright"></div>}
      </div>
    </div>
  );
};

export default Login;
