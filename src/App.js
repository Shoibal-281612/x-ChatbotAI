import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ChatPage from './pages/chatpage';
import HistoryPage from './pages/historypage';
import FeedbackOverview from './pages/feedbacklist';

export default function App() {
  return (
    <div>
      <nav className="app-nav">
        <Link to="/">Soul AI</Link>
        <span className="nav-links">
          <Link to="/history">Past Conversions</Link>
          <Link to="/feedback">Feedback</Link>
        </span>
      </nav>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/feedback" element={<FeedbackOverview />} />
      </Routes>
    </div>
  );
}
