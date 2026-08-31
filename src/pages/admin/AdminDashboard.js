import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalUsers: 0,
    totalEnquiries: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [dailyActivity, setDailyActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || userProfile?.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    loadDashboardData();
  }, [currentUser, userProfile, navigate]);

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
      // Get bookings
      const bookingsSnapshot = await safeGetDocs(collection(db, 'bookings'));
      const bookings = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const pendingBookingsCount = bookings.filter(b => b.status === 'Pending').length;

      // Get users
      const usersSnapshot = await safeGetDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => doc.data());

      // Get enquiries
      const enquiriesSnapshot = await safeGetDocs(collection(db, 'enquiries'));
      const enquiries = enquiriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setStats({
        totalBookings: bookingsSnapshot.size,
        pendingBookings: pendingBookingsCount,
        totalUsers: usersSnapshot.size,
        totalEnquiries: enquiriesSnapshot.size
      });

      const dateKey = (value) => {
        const date = value?.toDate ? value.toDate() : new Date(value);
        return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
      };
      const today = new Date();
      const activity = Array.from({ length: 14 }, (_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (13 - index));
        const key = date.toISOString().slice(0, 10);
        return {
          key,
          label: date.toLocaleDateString('en-US', { weekday: 'short' }),
          users: users.filter(user => dateKey(user.createdAt) === key).length,
          bookings: bookings.filter(booking => dateKey(booking.createdAt) === key).length,
          enquiries: enquiries.filter(enquiry => dateKey(enquiry.createdAt) === key).length
        };
      });
      setDailyActivity(activity);

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

  const chartMaximum = Math.max(
    ...dailyActivity.flatMap(day => [day.users, day.bookings, day.enquiries]),
    1
  );

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

        <div className="admin-panel activity-panel">
          <div className="panel-header">
            <div>
              <h3>Performance overview</h3>
              <span className="panel-caption">Daily activity for the last 14 days</span>
            </div>
            <div className="activity-legend">
              <span><i className="legend-dot users-dot" /> Users</span>
              <span><i className="legend-dot bookings-dot" /> Bookings</span>
              <span><i className="legend-dot enquiries-dot" /> Enquiries</span>
            </div>
          </div>
          <div className="activity-chart" aria-label="Daily users, bookings and enquiries chart">
            {dailyActivity.map(day => {
              return (
                <div className="activity-day" key={day.key}>
                  <div className="activity-bars">
                    <span className="activity-bar users-bar" style={{ height: `${(day.users / chartMaximum) * 100}%` }} title={`${day.users} users`} />
                    <span className="activity-bar bookings-bar" style={{ height: `${(day.bookings / chartMaximum) * 100}%` }} title={`${day.bookings} bookings`} />
                    <span className="activity-bar enquiries-bar" style={{ height: `${(day.enquiries / chartMaximum) * 100}%` }} title={`${day.enquiries} enquiries`} />
                  </div>
                  <span className="activity-day-label">{day.label}</span>
                  <span className="activity-day-date">{day.key.slice(8)}</span>
                </div>
              );
            })}
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
                      <th>Request</th>
                      <th>User</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map(booking => (
                      <tr key={booking.id}>
                        <td>{booking.bookingType === 'service' ? booking.serviceName : booking.propertyName}</td>
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
                      <th>Request</th>
                      <th>User</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEnquiries.map(enquiry => (
                      <tr key={enquiry.id}>
                        <td>{enquiry.serviceName || enquiry.propertyName}</td>
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
          SV PROJECTS 972
          <span className="admin-badge">Admin</span>
        </div>
        <nav className="admin-nav">
          <Link to="/admin" className={currentPath === '/admin' ? 'active' : ''}>
            Dashboard
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
