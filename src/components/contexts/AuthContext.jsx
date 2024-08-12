import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserDataState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserDataState(JSON.parse(storedUserData));
    }
    setLoading(false);
  }, []);

  const setUserData = (data) => {
    localStorage.setItem('userData', JSON.stringify(data));
    setUserDataState(data);
  };

  const logout = () => {
    localStorage.removeItem('userData');
    setUserDataState(null);
  };

  const value = useMemo(() => ({
    userData,
    setUserData,
    logout,
    loading,
  }), [userData, setUserData, logout, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  return useContext(AuthContext);
};