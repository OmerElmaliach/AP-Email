import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Inbox from './components/inbox.js';
import EmailDisplay from './components/emailDisplay.js';
import ErrorPage from './components/errorPage.js';
import SignUp from './signUp/SignUp';
import SignIn from './signIn/SignIn.js';
import ApiService from './ApiService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // No token exists, user is not authenticated
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Token exists, let's validate it by making an API call
        await ApiService.getCurrentUser();
        // If we get here, token is valid
        setIsAuthenticated(true);
      } catch (error) {
        console.log('Token validation failed:', error);
        // Token is invalid or expired, clean it up
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        // This runs whether try or catch executed
        setIsLoading(false);
      }
    };

    validateToken();
  }, []); // Empty array means this only runs ONCE when component mounts

  // Show loading screen while validating
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/SignIn" element={<SignIn onSignIn={() => setIsAuthenticated(true)} />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route
          path="/inbox"
          element={isAuthenticated ? <Inbox /> : <Navigate to="/SignIn" replace />}
        />
        <Route 
          path="/email/:id" 
          element={isAuthenticated ? <EmailDisplay /> : <Navigate to="/SignIn" replace />} 
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/inbox" : "/SignIn"} replace />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;