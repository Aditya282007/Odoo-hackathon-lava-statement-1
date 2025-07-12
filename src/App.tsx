import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import Layout from './components/Layout/Layout';
import UserDashboard from './components/Dashboard/UserDashboard';
import SkillMatch from './components/Match/SkillMatch';
import RequestsPage from './components/Requests/RequestsPage';
import ChatPage from './components/Chat/ChatPage';
import ReportPage from './components/Report/ReportPage';
import AdminPanel from './components/Admin/AdminPanel';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text-primary dark:text-dark-text-primary transition-colors duration-300">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={
            <Layout>
              <SkillMatch />
            </Layout>
          } />
          <Route path="/dashboard" element={
            <Layout>
              <UserDashboard />
            </Layout>
          } />
          <Route path="/requests" element={
            <Layout>
              <RequestsPage />
            </Layout>
          } />
          <Route path="/chat/:userId" element={
            <Layout>
              <ChatPage />
            </Layout>
          } />
          <Route path="/report/:userId" element={
            <Layout>
              <ReportPage />
            </Layout>
          } />
          <Route path="/admin" element={
            <Layout>
              <AdminPanel />
            </Layout>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;