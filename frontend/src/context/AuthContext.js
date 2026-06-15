import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on initial load
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          // Set the token in axios headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Verify the token is still valid by fetching user data or making a test request
          // You can add a token verification endpoint, or just set the user
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Optional: Verify token with backend
          // try {
          //   await axios.get('http://https://buddy-script-backend-s1zm.onrender.com//api/verify-token/');
          //   setUser(userData);
          // } catch (error) {
          //   // Token is invalid, clear storage
          //   localStorage.removeItem('access_token');
          //   localStorage.removeItem('user');
          //   delete axios.defaults.headers.common['Authorization'];
          // }
        } catch (error) {
          console.error('Error restoring auth state:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://https://buddy-script-backend-s1zm.onrender.com//api/login/', {
        email,
        password
      });
      const { access, user } = response.data;
      
      // Store tokens and user data
      localStorage.setItem('access_token', access);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      setUser(user);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error('Login failed: ' + (error.response?.data?.error || 'Unknown error'));
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://https://buddy-script-backend-s1zm.onrender.com//api/register/', userData);
      if (response.data) {
        toast.success('Registration successful! Please login.');
        return true;
      }
    } catch (error) {
      toast.error('Registration failed: ' + (error.response?.data?.error || 'Unknown error'));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};