import Header from './Components/Header';
import Footer from './Components/Footer'; 
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './Components/WelcomePage';
import AboutPage from './Components/AboutPage';
import CalendarPage from './Components/CalendarPage';
import SchedulePage from './Components/SchedulePage';
import ContactPage from './Components/ContactPage';
import OverviewFinancialPage from './Components/OverviewFinancialPage';
import OverviewClientPage from './Components/OverviewClientPage';
import SettingsPage from './Components/SettingsPage';

function App() {
  return (
    <>
      <Header />
      <div className='app-container'>
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
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;

