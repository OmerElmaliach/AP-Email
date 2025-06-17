import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ApiService from '../../ApiService';

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null); // null = loading

  useEffect(() => {
    const validate = async () => {
      try {
        await ApiService.getCurrentUser();
        setIsValid(true);
      } catch {
        setIsValid(false);
      }
    };
    validate();
  }, []);

  if (isValid === null) {
    return <div>Loading...</div>; // ⏳ While validating
  }

  if (!isValid) {
    return <Navigate to="/SignIn" replace />;
  }

  return children; // ✅ Authenticated → render protected content
};

export default ProtectedRoute;