import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { logoutUser } from '../../axiosServices/authServices'; // Import the logoutUser function
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode to decode the token

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserDataState] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback((data) => {
    localStorage.setItem('userData', JSON.stringify(data));
    localStorage.setItem('token', data.token);
    setUserDataState(data);
    setToken(data.token);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser(); // Use the logoutUser function from AuthServices
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
      setUserDataState(null);
      setToken(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    const storedToken = localStorage.getItem('token');
    if (storedUserData && storedToken) {
      if (isTokenExpired(storedToken)) {
        logout();
      } else {
        setUserDataState(JSON.parse(storedUserData));
        setToken(storedToken);
      }
    }
    setLoading(false);
  }, [logout]);

  const value = useMemo(() => ({
    userData,
    token,
    login,
    logout,
    loading,
  }), [userData, token, login, logout, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  return useContext(AuthContext);
};