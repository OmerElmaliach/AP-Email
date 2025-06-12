import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './signUp/SignUp';
import Inbox from './Inbox';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/inbox" element={<Inbox />} />


      </Routes>
    </Router>
  );
}

export default App;