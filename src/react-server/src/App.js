import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './signUp/SignUp';
import Inbox from './Inbox';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} /> {/**change this to log in once i make it... */}

        <Route
          path="/inbox"
          element={token ? <Inbox /> : <Navigate to="/SignUp" />}
        />
         <Route path="*" element={<Navigate to="/SignUp" />} />
      </Routes>
    </Router>
  );
}

export default App;