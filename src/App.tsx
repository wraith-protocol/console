import { Routes, Route, Navigate } from 'react-router';
import { AuthContext, useAuthProvider, useAuth } from './hooks/useAuth';
import { TeamContext, useTeamProvider } from './hooks/useTeam';
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

function DashboardRoutes() {
  const { logout } = useAuth();

  return (
    <PageLayout onLogout={logout}>
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
  );
}

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();
  const teamState = useTeamProvider(isAuthenticated);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-outline">Loading...</p>
      </div>
    );
  }

  return (
    <TeamContext.Provider value={teamState}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardRoutes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </TeamContext.Provider>
  );
}

export default function App() {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      <AppRoutes />
    </AuthContext.Provider>
  );
}
