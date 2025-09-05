import Header from './Components/Header';
import Footer from './Components/Footer'; 
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './Components/WelcomePage';
import AboutPage from './Components/AboutPage';

function App() {
  return (
    <>
      <Header />

      <div className='app-container'>
        <Routes>
          <Route path="/" element={<Navigate to="/welcome" />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/profile" element={<div>Profile</div>} />
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;

