import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalUsers: 0,
    totalEnquiries: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || userProfile?.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    loadDashboardData();
  }, [currentUser, userProfile]);

  const loadDashboardData = async () => {
    // Helper: read a collection, returning [] instead of throwing when
    // Firestore is not provisioned or rules deny access.
    const safeGetDocs = async (ref) => {
      try {
        return await getDocs(ref);
      } catch (err) {
        console.warn('Firestore read skipped:', err.code || err.message);
        return { docs: [], size: 0 };
      }
    };

    try {
      // Get properties
      const propertiesSnapshot = await safeGetDocs(collection(db, 'properties'));
      const properties = propertiesSnapshot.docs.map(doc => doc.data());
      const availableCount = properties.filter(p => p.status === 'Available').length;

      // Get bookings
      const bookingsSnapshot = await safeGetDocs(collection(db, 'bookings'));
      const bookings = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const pendingBookingsCount = bookings.filter(b => b.status === 'Pending').length;

      // Get users
      const usersSnapshot = await safeGetDocs(collection(db, 'users'));

      // Get enquiries
      const enquiriesSnapshot = await safeGetDocs(collection(db, 'enquiries'));
      const enquiries = enquiriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setStats({
        totalProperties: propertiesSnapshot.size,
        availableProperties: availableCount,
        totalBookings: bookingsSnapshot.size,
        pendingBookings: pendingBookingsCount,
        totalUsers: usersSnapshot.size,
        totalEnquiries: enquiriesSnapshot.size
      });

      // Sort bookings by date (most recent first)
      const sortedBookings = bookings.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentBookings(sortedBookings.slice(0, 5));

      // Sort enquiries by date (most recent first)
      const sortedEnquiries = enquiries.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentEnquiries(sortedEnquiries.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <AdminHeader currentPath="/admin" onLogout={handleLogout} userProfile={userProfile} />

      <div className="admin-content">
        <div className="admin-page-header">
          <h1>Dashboard</h1>
          <p>Overview of your real estate platform</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--brass)' }}>🏘️</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalProperties}</div>
              <div className="stat-label">Total Properties</div>
              <div className="stat-sub">{stats.availableProperties} available</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--moss)' }}>📅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalBookings}</div>
              <div className="stat-label">Total Bookings</div>
              <div className="stat-sub">{stats.pendingBookings} pending</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--teak)' }}>👥</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-label">Registered Users</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--rust)' }}>💬</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalEnquiries}</div>
              <div className="stat-label">Enquiries</div>
            </div>
          </div>
        </div>

        <div className="admin-grid-2">
          <div className="admin-panel">
            <div className="panel-header">
              <h3>Recent Bookings</h3>
              <Link to="/admin/bookings" className="btn btn-sm btn-ghost">View all</Link>
            </div>
            <div className="panel-body">
              {recentBookings.length === 0 ? (
                <p style={{ color: 'var(--ink-3)', textAlign: 'center', padding: '20px' }}>
                  No bookings yet
                </p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>User</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map(booking => (
                      <tr key={booking.id}>
                        <td>{booking.propertyName}</td>
                        <td>{booking.name}</td>
                        <td>{booking.date}</td>
                        <td>
                          <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="admin-panel">
            <div className="panel-header">
              <h3>Recent Enquiries</h3>
              <Link to="/admin/bookings" className="btn btn-sm btn-ghost">View all</Link>
            </div>
            <div className="panel-body">
              {recentEnquiries.length === 0 ? (
                <p style={{ color: 'var(--ink-3)', textAlign: 'center', padding: '20px' }}>
                  No enquiries yet
                </p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>User</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEnquiries.map(enquiry => (
                      <tr key={enquiry.id}>
                        <td>{enquiry.propertyName}</td>
                        <td>{enquiry.userName}</td>
                        <td>
                          <span className={`status-badge status-${enquiry.status.toLowerCase()}`}>
                            {enquiry.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Header Component
export const AdminHeader = ({ currentPath, onLogout, userProfile }) => {
  return (
    <div className="admin-header">
      <div className="admin-header-left">
        <div className="admin-logo">
          THE SWAMY
          <span className="admin-badge">Admin</span>
        </div>
        <nav className="admin-nav">
          <Link to="/admin" className={currentPath === '/admin' ? 'active' : ''}>
            Dashboard
          </Link>
          <Link to="/admin/properties" className={currentPath === '/admin/properties' ? 'active' : ''}>
            Properties
          </Link>
          <Link to="/admin/bookings" className={currentPath === '/admin/bookings' ? 'active' : ''}>
            Bookings
          </Link>
          <Link to="/admin/users" className={currentPath === '/admin/users' ? 'active' : ''}>
            Users
          </Link>
        </nav>
      </div>
      <div className="admin-header-right">
        <span className="admin-user-name">{userProfile?.name}</span>
        <a href="/" target="_blank" className="btn btn-sm btn-ghost">View Site</a>
        <button onClick={onLogout} className="btn btn-sm btn-ghost">Logout</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
