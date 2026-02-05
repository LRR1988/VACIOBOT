import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Publish from './components/Publish';
import Dashboard from './components/Dashboard';
<<<<<<< HEAD
import PaymentManager from './components/PaymentManager';
import AllAds from './pages/AllAds';
=======
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
import AuthModal from './components/AuthModal';
import Notifications from './components/Notifications';
import AdminPanel from './components/AdminPanel';
import StripeIntegration from './components/StripeIntegration';
import { isAdmin } from './utils/helpers';
import './i18n/i18n';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    }
  }, []);

  useEffect(() => {
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  };

  // Componente protegido para administradores
  const ProtectedAdminRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    if (!currentUser || !isAdmin(currentUser)) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <Router>
      <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
        <Header 
          isAuthenticated={isAuthenticated} 
          currentUser={currentUser}
          onLogout={handleLogout}
          onToggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
          onShowAuthModal={() => setShowAuthModal(true)}
        />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={
              isAuthenticated ? <Profile /> : <Navigate to="/login" />
            } />
            <Route path="/publish" element={
              isAuthenticated ? <Publish /> : <Navigate to="/login" />
            } />
            <Route path="/dashboard" element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
            } />
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminPanel />
              </ProtectedAdminRoute>
            } />
            <Route path="/stripe-config" element={
              isAuthenticated && isAdmin(currentUser) ? <StripeIntegration /> : <Navigate to="/login" />
            } />
<<<<<<< HEAD
            <Route path="/payments" element={
              isAuthenticated ? <PaymentManager /> : <Navigate to="/login" />
            } />
            <Route path="/all-ads" element={<AllAds />} />
=======
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
          </Routes>
        </main>
        
        <Footer />
        
        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)} 
            onLogin={handleLogin}
          />
        )}
      </div>
    </Router>
  );
};

export default App;