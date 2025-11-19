import React from 'react';
import PageShell from './Components/PageShell';
import './App.css';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import WelcomePage from './Components/WelcomePage';
import AboutPage from './Components/AboutPage';
import CalendarPage from './Components/CalendarPage';
import SchedulePage from './Components/SchedulePage';
import ContactPage from './Components/ContactPage';
import OverviewFinancialPage from './Components/OverviewFinancialPage';
import OverviewClientPage from './Components/OverviewClientPage';
import AddClientPage from './Components/AddClientPage';
import ViewClientPage from './Components/ViewClientPage';
import SettingsPage from './Components/SettingsPage';
import Login from './Components/Login';
import CreateUser from './Components/CreateUser';
import ForgotPassword from './Components/ForgotPassword';
 

function App() {
  const isAuthenticated = (() => {
    try { return !!localStorage.getItem('app_auth'); } catch (err) { return false; }
  })();

  const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    try {
      if (localStorage.getItem('app_auth')) return <>{children}</>;
    } catch (err) {}
    return <Navigate to="/login" replace />;
  };

  const Logout: React.FC = () => {
    const navigate = useNavigate();
    React.useEffect(() => {
      try { localStorage.removeItem('app_auth'); } catch (err) {}
      // small timeout to ensure storage cleared
      setTimeout(() => navigate('/login'), 80);
    }, []);
    return null;
  };

  return (
    <Routes>
      {/* Auth routes: no header/footer */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<CreateUser />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      {/* All other routes use the page shell (header + footer) and require auth */}
      <Route path="/logout" element={<Logout />} />
      <Route path="/*" element={
        <RequireAuth>
          <PageShell>
            <Routes>
              <Route path="/" element={<Navigate to={isAuthenticated ? "/welcome" : "/login"} />} />
              <Route path="/welcome" element={<WelcomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/financial" element={<OverviewFinancialPage />} />
              <Route path="/client" element={<OverviewClientPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/client/add" element={<AddClientPage />} />
              <Route path="/client/view" element={<ViewClientPage />} />
            </Routes>
          </PageShell>
        </RequireAuth>
      } />
      </Routes>
  );
}

export default App;

