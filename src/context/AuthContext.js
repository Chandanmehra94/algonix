// src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser({
          ...res.data,
          profilePhoto: res.data.profilePhoto ? `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}${res.data.profilePhoto}` : '/assets/default-profile.png'
        });
      } catch (err) {
        console.error('Failed to refresh user:', err);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setUser({
            ...res.data,
            profilePhoto: res.data.profilePhoto ? `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}${res.data.profilePhoto}` : '/assets/default-profile.png'
          });
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      const userData = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/profile`, {
        headers: { Authorization: `Bearer ${res.data.token}` }
      });
      setUser({
        ...userData.data,
        profilePhoto: userData.data.profilePhoto ? `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}${userData.data.profilePhoto}` : '/assets/default-profile.png'
      });
      navigate('/');
    } catch (err) {
      throw new Error(err.response.data.msg || 'Login failed');
    }
  };

  const signup = async (name, email, password, whatsapp) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/signup`, { name, email, password, whatsapp });
      localStorage.setItem('token', res.data.token);
      const userData = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/profile`, {
        headers: { Authorization: `Bearer ${res.data.token}` }
      });
      setUser({
        ...userData.data,
        profilePhoto: userData.data.profilePhoto ? `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}${userData.data.profilePhoto}` : '/assets/default-profile.png'
      });
      navigate('/');
    } catch (err) {
      throw new Error(err.response.data.msg || 'Signup failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};