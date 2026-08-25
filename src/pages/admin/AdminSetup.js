import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import './AdminLogin.css';

const AdminSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: 'admin@tuheswamy.com',
    password: 'Admin@123456',
    name: 'Admin User',
    phone: '+91 9876543210'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      const user = userCredential.user;
      
      // Create user profile in Firestore with admin role
      await setDoc(doc(db, 'users', user.uid), {
        email: formData.email,
        name: formData.name,
        role: 'admin',
        phone: formData.phone,
        createdAt: new Date().toISOString(),
        favorites: []
      });
      
      setMessage('✅ Admin user created successfully! Redirecting to login...');
      
      // Wait 2 seconds then redirect to login
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating admin:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        setError('⚠️ This email is already registered. Please login instead.');
      } else if (error.code === 'auth/weak-password') {
        setError('❌ Password is too weak. Use at least 6 characters.');
      } else if (error.code === 'permission-denied' || error.message.includes('permission')) {
        setError('❌ Firestore permission denied. Please check your Firestore rules.');
      } else {
        setError(`❌ Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>🔧 Admin Setup</h1>
          <p>Create your first admin account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Admin Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="field">
            <label>Admin Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
            <small style={{ color: 'var(--ink-3)', fontSize: '12px' }}>
              Minimum 6 characters
            </small>
          </div>

          <div className="field">
            <label>Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          {error && (
            <div style={{
              padding: '12px',
              background: '#fee',
              border: '1px solid #fcc',
              borderRadius: '6px',
              color: '#c33',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{
              padding: '12px',
              background: '#efe',
              border: '1px solid #cfc',
              borderRadius: '6px',
              color: '#3c3',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              {message}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Creating Admin...' : 'Create Admin Account'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <a 
              href="/admin/login" 
              style={{ color: 'var(--primary-orange)', fontSize: '14px' }}
            >
              Already have an account? Login here
            </a>
          </div>
        </form>

        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: 'var(--paper-2)',
          borderRadius: '8px',
          fontSize: '13px',
          color: 'var(--ink-3)'
        }}>
          <strong>Note:</strong> This page creates an admin user with full access to:
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li>Add, edit, delete properties</li>
            <li>Manage bookings and enquiries</li>
            <li>View and manage users</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
