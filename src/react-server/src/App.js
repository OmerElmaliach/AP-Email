import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inbox from './components/inbox.js';
import EmailDisplay from './components/emailDisplay.js';
import ErrorPage from './components/errorPage.js';
import EmailCreate from './components/emailCreate.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inbox />} />
        <Route path="/email/:id" element={<EmailDisplay />} />
        <Route path="/create-mail" element={<EmailCreate />}/>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;