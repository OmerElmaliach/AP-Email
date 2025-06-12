import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inbox from './components/inbox.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inbox />} />
      </Routes>
    </Router>
  );
}

export default App;