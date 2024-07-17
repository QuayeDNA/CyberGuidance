import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock function to login, in real scenarios you would fetch this from an API
  const login = () => {
    setIsAuthenticated(true);
  };

  // Mock function to logout
  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
