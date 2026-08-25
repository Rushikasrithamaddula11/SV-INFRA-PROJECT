import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { format } from 'date-fns';
import './Account.css';

const Account = () => {
  const { currentUser, userProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [bookings, setBookings] = useState([]);
  const [siteVisits, setSiteVisits] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    loadUserData();
  }, [currentUser]);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setPhone(userProfile.phone || '');
    }
  }, [userProfile]);

  const loadUserData = async () => {
    try {
      // Load bookings
      const bookingsQuery = query(collection(db, 'bookings'), where('userId', '==', currentUser.uid));
      const bookingsSnapshot = await getDocs(bookingsQuery);
      setBookings(bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Load site visits
      const visitsQuery = query(collection(db, 'siteVisits'), where('userId', '==', currentUser.uid));
      const visitsSnapshot = await getDocs(visitsQuery);
      setSiteVisits(visitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Load enquiries
      const enquiriesQuery = query(collection(db, 'enquiries'), where('userId', '==', currentUser.uid));
      const enquiriesSnapshot = await getDocs(enquiriesQuery);
      setEnquiries(enquiriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Load favorites
      const favQuery = query(collection(db, 'favorites'), where('userId', '==', currentUser.uid));
      const favSnapshot = await getDocs(favQuery);
      const favoritePropertyIds = favSnapshot.docs.map(doc => doc.data().propertyId);

      const propertyPromises = favoritePropertyIds.map(async (id) => {
        const propertyDocRef = doc(db, 'properties', id);
        const propertyDoc = await getDoc(propertyDocRef);
        if (propertyDoc.exists()) {
          return { id: propertyDoc.id, ...propertyDoc.data() };
        }
        return null;
      });

      const loadedProperties = await Promise.all(propertyPromises);
      setFavorites(loadedProperties.filter(p => p !== null));
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name,
        phone
      });
      showToast('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Error updating profile');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showToast('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="container" style={{ padding: '80px 0' }}>
        <div className="empty-state">
          <h3>Log in to view your account</h3>
          <br />
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Login / Register
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  const tabs = [
    { key: 'profile', label: 'Profile' },
    { key: 'bookings', label: `Bookings (${bookings.length})` },
    { key: 'sitevisits', label: `Site Visits (${siteVisits.length})` },
    { key: 'enquiries', label: `Enquiries (${enquiries.length})` },
    { key: 'favorites', label: `Favorites (${favorites.length})` }
  ];

  const getStatusPillClass = (status) => {
    const classes = {
      'Pending': 'pill-pending',
      'Confirmed': 'pill-confirmed',
      'Completed': 'pill-completed',
      'Cancelled': 'pill-cancelled',
      'New': 'pill-new',
      'Contacted': 'pill-contacted',
      'Interested': 'pill-interested',
      'Closed': 'pill-closed'
    };
    return classes[status] || 'pill-pending';
  };

  return (
    <section style={{ paddingTop: '40px' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Welcome back</span>
            <h2>{userProfile?.name}</h2>
          </div>
        </div>

        <div className="account-layout">
          <div className="account-nav">
            {tabs.map(tab => (
              <a
                key={tab.key}
                href="#"
                className={activeTab === tab.key ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(tab.key);
                }}
              >
                {tab.label}
              </a>
            ))}
          </div>

          <div>
            {activeTab === 'profile' && (
              <div className="profile-card">
                <h3 style={{ marginBottom: '18px' }}>Your details</h3>
                <form onSubmit={handleSaveProfile}>
                  <div className="field">
                    <label>Full name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="field">
                    <label>Email</label>
                    <input type="email" value={userProfile?.email || ''} disabled />
                  </div>
                  <div className="field">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Save changes</button>
                </form>
                <button className="btn btn-ghost" style={{ marginTop: '14px' }} onClick={handleLogout}>
                  Log out
                </button>
              </div>
            )}

            {activeTab === 'bookings' && (
              <>
                {bookings.length === 0 ? (
                  <div className="empty-state" style={{ padding: '60px 20px' }}>
                    <h3>No bookings yet</h3>
                    <p>Book a property and it will show up here.</p>
                  </div>
                ) : (
                  bookings.map(booking => (
                    <div key={booking.id} className="rec-card">
                      <div className="rec-main">
                        <h4>{booking.propertyName}</h4>
                        <div className="rec-meta">
                          Visit slot: {booking.date && format(new Date(booking.date), 'dd MMM yyyy')} · {booking.time}
                        </div>
                      </div>
                      <span className={`status-pill ${getStatusPillClass(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  ))
                )}
              </>
            )}

            {activeTab === 'sitevisits' && (
              <>
                {siteVisits.length === 0 ? (
                  <div className="empty-state" style={{ padding: '60px 20px' }}>
                    <h3>No site visits requested</h3>
                    <p>Schedule a visit from any property page.</p>
                  </div>
                ) : (
                  siteVisits.map(visit => (
                    <div key={visit.id} className="rec-card">
                      <div className="rec-main">
                        <h4>{visit.propertyName}</h4>
                        <div className="rec-meta">
                          {visit.date && format(new Date(visit.date), 'dd MMM yyyy')} · {visit.time}
                        </div>
                      </div>
                      <span className={`status-pill ${getStatusPillClass(visit.status)}`}>
                        {visit.status}
                      </span>
                    </div>
                  ))
                )}
              </>
            )}

            {activeTab === 'enquiries' && (
              <>
                {enquiries.length === 0 ? (
                  <div className="empty-state" style={{ padding: '60px 20px' }}>
                    <h3>No enquiries sent</h3>
                    <p>Ask a question on any property page.</p>
                  </div>
                ) : (
                  enquiries.map(enquiry => (
                    <div key={enquiry.id} className="rec-card">
                      <div className="rec-main">
                        <h4>{enquiry.propertyName}</h4>
                        <div className="rec-meta">
                          {enquiry.message.slice(0, 70)}
                          {enquiry.message.length > 70 && '…'}
                        </div>
                      </div>
                      <span className={`status-pill ${getStatusPillClass(enquiry.status)}`}>
                        {enquiry.status}
                      </span>
                    </div>
                  ))
                )}
              </>
            )}

            {activeTab === 'favorites' && (
              <>
                {favorites.length === 0 ? (
                  <div className="empty-state" style={{ padding: '60px 20px' }}>
                    <h3>No favorites yet</h3>
                    <p>Tap the heart on a property to save it.</p>
                  </div>
                ) : (
                  <div className="grid grid-2">
                    {favorites.map(property => (
                      <PropertyCard key={property.id} property={property} onFavoriteChange={loadUserData} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Account;
