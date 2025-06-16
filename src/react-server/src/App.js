import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Inbox from './components/inbox.js';
import EmailDisplay from './components/emailDisplay.js';
import ErrorPage from './components/errorPage.js';
import SignUp from './signUp/SignUp';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} /> {/**change this to log-in once i make it...(etl) */}
          {/**add log in page anf sing in pages */}
        <Route
          path="/inbox"
          element={token ? <Inbox /> : <Navigate to="/SignUp" />}
        />
          <Route path="/email/:id" element={<EmailDisplay />} />{/**should this be a url for it self? i need to add a token gourd if so. anayways shouldent work with out token  */}
        <Route path="*" element={<ErrorPage />} /> {/** gotta have that beautiful 404 page! XD */}
      </Routes>
    </Router>
  );
}
   

export default App;