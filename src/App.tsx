import PageShell from './Components/PageShell';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
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
  return (
    <Routes>
      {/* Auth routes: no header/footer */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<CreateUser />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* All other routes use the page shell (header + footer) */}
      <Route path="/*" element={
        <PageShell>
          <Routes>
            <Route path="/" element={<Navigate to="/welcome" />} />
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
      } />
    </Routes>
  );
}

export default App;

