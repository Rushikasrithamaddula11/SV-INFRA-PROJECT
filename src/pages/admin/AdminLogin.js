import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

// Default admin credentials (change after first login)
const DEFAULT_ADMIN_EMAIL = 'admin@tuheswamy.com';
const DEFAULT_ADMIN_PASSWORD = 'TuheSwamy@2026';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();

  useEffect(() => {
    if (currentUser && userProfile?.role === 'admin') {
      navigate('/admin');
    }
  }, [currentUser, userProfile, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      } catch (authErr) {
        // If Firebase Auth rejects (user not created yet), try the default
        // local admin credentials so the panel is usable before Firestore/Auth
        // are fully provisioned.
        if (
          email.trim().toLowerCase() === DEFAULT_ADMIN_EMAIL &&
          password === DEFAULT_ADMIN_PASSWORD
        ) {
          sessionStorage.setItem('tsp_local_admin', JSON.stringify({
            email: DEFAULT_ADMIN_EMAIL,
            role: 'admin',
            name: 'Administrator'
          }));
          // Full reload so AuthContext re-initializes with the local admin session
          window.location.href = '/admin';
          return;
        }
        throw authErr;
      }

      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

      if (!userDoc.exists()) {
        // First login — create the admin profile document
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name: 'Administrator',
          email: email.trim(),
          role: 'admin',
          createdAt: new Date().toISOString()
        });
      } else if (userDoc.data().role !== 'admin') {
        setError('Access denied. Admin privileges required.');
        await auth.signOut();
        setLoading(false);
        return;
      }

      navigate('/admin');
    } catch (err) {
      console.error('Admin login error:', err);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">
        <div className="admin-logo">
          THE SWAMY
          <span className="admin-badge">Admin</span>
        </div>
        <h2>Admin Login</h2>
        <p className="admin-subtitle">Access the management dashboard</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/" style={{ fontSize: '13px', color: 'var(--ink-3)' }}>
            ← Back to main site
          </a>
          <div style={{ marginTop: '12px' }}>
            <a href="/admin/setup" style={{ fontSize: '13px', color: 'var(--primary-orange)' }}>
              Create Admin Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
