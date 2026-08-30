import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FaWhatsapp } from 'react-icons/fa';
import { auth, db } from './firebase';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Services from './pages/Services';
import HomeNew from './pages/HomeNew';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import PropertyDetail from './pages/PropertyDetail';
import Favorites from './pages/Favorites';
import Account from './pages/Account';
import About from './pages/About';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProperties from './pages/admin/AdminProperties';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminLogin from './pages/admin/AdminLogin';
import AdminSetup from './pages/admin/AdminSetup';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Local admin fallback (set by AdminLogin before Firebase Auth is provisioned)
    const localAdmin = sessionStorage.getItem('tsp_local_admin');
    if (localAdmin) {
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      if (user) {
        try {
          // Check if user is admin
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setIsAdmin(userDoc.data().role === 'admin');
          }
        } catch (err) {
          console.error('Error checking admin role:', err);
        }
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/setup" element={<AdminSetup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/admin/properties"
              element={isAdmin ? <AdminProperties /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/admin/bookings"
              element={isAdmin ? <AdminBookings /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/admin/users"
              element={isAdmin ? <AdminUsers /> : <Navigate to="/admin/login" />}
            />

            {/* Public Routes */}
            <Route
              path="/*"
              element={
                <>
                  <Header />
                  <main>
                    <Routes>
                      <Route path="/" element={<HomeNew />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/property/:id" element={<PropertyDetail />} />
                      <Route path="/favorites" element={<Favorites />} />
                      <Route path="/account" element={<Account />} />
                      <Route path="/about" element={<About />} />
                    </Routes>
                  </main>
                  <Footer />
                  <a
                    className="whatsapp-float"
                    href="https://wa.me/919515988011"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat with SV Infra Projects 972 on WhatsApp"
                  >
                    <FaWhatsapp aria-hidden="true" />
                    <span>WhatsApp</span>
                  </a>
                </>
              }
            />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
