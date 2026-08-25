import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AdminHeader } from './AdminDashboard';
import { format } from 'date-fns';

const AdminBookings = () => {
  const { currentUser, userProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [siteVisits, setSiteVisits] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || userProfile?.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [currentUser, userProfile]);

  const loadData = async () => {
    // Helper: read a collection, returning [] instead of throwing when
    // Firestore is not provisioned or rules deny access.
    const safeGetDocs = async (ref) => {
      try {
        return await getDocs(ref);
      } catch (err) {
        console.warn('Firestore read skipped:', err.code || err.message);
        return { docs: [] };
      }
    };

    try {
      const bookingsSnapshot = await safeGetDocs(collection(db, 'bookings'));
      setBookings(bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const visitsSnapshot = await safeGetDocs(collection(db, 'siteVisits'));
      setSiteVisits(visitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const enquiriesSnapshot = await safeGetDocs(collection(db, 'enquiries'));
      setEnquiries(enquiriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, collection, newStatus) => {
    try {
      await updateDoc(doc(db, collection, id), { status: newStatus });
      showToast('Status updated successfully');
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Error updating status');
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
      <AdminHeader currentPath="/admin/bookings" onLogout={handleLogout} userProfile={userProfile} />

      <div className="admin-content">
        <div className="admin-page-header">
          <h1>Bookings & Enquiries</h1>
          <p>Manage customer requests</p>
        </div>

        <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
          <button
            className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings ({bookings.length})
          </button>
          <button
            className={`btn ${activeTab === 'sitevisits' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('sitevisits')}
          >
            Site Visits ({siteVisits.length})
          </button>
          <button
            className={`btn ${activeTab === 'enquiries' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('enquiries')}
          >
            Enquiries ({enquiries.length})
          </button>
        </div>

        <div className="admin-panel">
          <div className="panel-body">
            {activeTab === 'bookings' && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id}>
                      <td><strong>{booking.propertyName}</strong></td>
                      <td>{booking.name}</td>
                      <td>{booking.email}</td>
                      <td>{booking.phone}</td>
                      <td>
                        {booking.date && format(new Date(booking.date), 'dd MMM yyyy')}
                        <br />
                        <small style={{ color: 'var(--ink-3)' }}>{booking.time}</small>
                      </td>
                      <td>
                        <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={booking.status}
                          onChange={(e) => handleUpdateStatus(booking.id, 'bookings', e.target.value)}
                          style={{ padding: '6px', fontSize: '12px' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-3)' }}>
                        No bookings yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'sitevisits' && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Date & Time</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {siteVisits.map(visit => (
                    <tr key={visit.id}>
                      <td><strong>{visit.propertyName}</strong></td>
                      <td>{visit.name}</td>
                      <td>{visit.phone}</td>
                      <td>
                        {visit.date && format(new Date(visit.date), 'dd MMM yyyy')}
                        <br />
                        <small style={{ color: 'var(--ink-3)' }}>{visit.time}</small>
                      </td>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {visit.message || '—'}
                      </td>
                      <td>
                        <span className={`status-badge status-${visit.status.toLowerCase()}`}>
                          {visit.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={visit.status}
                          onChange={(e) => handleUpdateStatus(visit.id, 'siteVisits', e.target.value)}
                          style={{ padding: '6px', fontSize: '12px' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {siteVisits.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-3)' }}>
                        No site visits yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'enquiries' && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map(enquiry => (
                    <tr key={enquiry.id}>
                      <td><strong>{enquiry.propertyName}</strong></td>
                      <td>{enquiry.userName}</td>
                      <td>{enquiry.userEmail}</td>
                      <td>{enquiry.phone}</td>
                      <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {enquiry.message}
                      </td>
                      <td>
                        <span className={`status-badge status-${enquiry.status.toLowerCase()}`}>
                          {enquiry.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={enquiry.status}
                          onChange={(e) => handleUpdateStatus(enquiry.id, 'enquiries', e.target.value)}
                          style={{ padding: '6px', fontSize: '12px' }}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Interested">Interested</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {enquiries.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-3)' }}>
                        No enquiries yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
