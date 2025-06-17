import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Inbox from './components/inbox.js';
import EmailDisplay from './components/emailDisplay.js';
import ErrorPage from './components/errorPage.js';
import SignUp from './signUp/SignUp';
import SignIn from './signIn/SignIn.js';
import ApiService from './ApiService';
import ProtectedRoute from "./components/Auth/ProtectedRoute"
function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />

        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/email/:id"
          element={
            <ProtectedRoute>
              <EmailDisplay />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/inbox" />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;