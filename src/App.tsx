import { Routes, Route, Navigate } from 'react-router';
import { useState, useCallback } from 'react';
import PageLayout from './components/layout/PageLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Overview from './pages/Overview';
import Agents from './pages/Agents';
import AgentDetail from './pages/AgentDetail';
import ApiKeys from './pages/ApiKeys';
import Usage from './pages/Usage';
import Billing from './pages/Billing';
import Team from './pages/Team';
import Webhooks from './pages/Webhooks';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <PageLayout onLogout={handleLogout}>
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/agents/:id" element={<AgentDetail />} />
                <Route path="/keys" element={<ApiKeys />} />
                <Route path="/usage" element={<Usage />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/team" element={<Team />} />
                <Route path="/webhooks" element={<Webhooks />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </PageLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
