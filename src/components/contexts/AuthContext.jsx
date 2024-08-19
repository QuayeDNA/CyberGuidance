import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserDataState] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback((data) => {
    localStorage.setItem('userData', JSON.stringify(data));
    setUserDataState(data);
  }, []);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserDataState(JSON.parse(storedUserData));
    }
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.get('https://cyber-guidance.onrender.com/api/logout');
      localStorage.removeItem('userData');
      setUserDataState(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  const value = useMemo(() => ({
    userData,
    login, // Ensure login function is included here
    logout,
    loading,
  }), [userData, login, logout, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  return useContext(AuthContext);
};