import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import Login from './Login';
import SignUp from './SignUp';
import Chat from './Chat';
import Report from './Report';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;