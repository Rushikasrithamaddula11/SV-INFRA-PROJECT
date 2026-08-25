import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { format } from 'date-fns';
import './PropertyDetail.css';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const { showToast } = useToast();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSiteVisitModal, setShowSiteVisitModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      const propertyDoc = await getDoc(doc(db, 'properties', id));
      if (propertyDoc.exists()) {
        setProperty({ id: propertyDoc.id, ...propertyDoc.data() });
      } else {
        showToast('Property not found');
        navigate('/properties');
      }
    } catch (error) {
      console.error('Error loading property:', error);
      showToast('Error loading property');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (formData) => {
    if (!currentUser) {
      showToast('Please login to book');
      return;
    }

    try {
      await addDoc(collection(db, 'bookings'), {
        userId: currentUser.uid,
        propertyId: property.id,
        propertyName: property.name,
        ...formData,
        status: 'Pending',
        createdAt: new Date().toISOString()
      });
      showToast('Booking request submitted!');
      setShowBookingModal(false);
    } catch (error) {
      console.error('Error creating booking:', error);
      showToast('Error submitting booking');
    }
  };

  const handleSiteVisit = async (formData) => {
    if (!currentUser) {
      showToast('Please login to schedule visit');
      return;
    }

    try {
      await addDoc(collection(db, 'siteVisits'), {
        userId: currentUser.uid,
        propertyId: property.id,
        propertyName: property.name,
        ...formData,
        status: 'Pending',
        createdAt: new Date().toISOString()
      });
      showToast('Site visit request submitted!');
      setShowSiteVisitModal(false);
    } catch (error) {
      console.error('Error creating site visit:', error);
      showToast('Error submitting request');
    }
  };

  const handleEnquiry = async (formData) => {
    if (!currentUser) {
      showToast('Please login to enquire');
      return;
    }

    try {
      await addDoc(collection(db, 'enquiries'), {
        userId: currentUser.uid,
        propertyId: property.id,
        propertyName: property.name,
        userName: userProfile?.name,
        userEmail: userProfile?.email,
        ...formData,
        status: 'New',
        createdAt: new Date().toISOString()
      });
      showToast('Enquiry sent successfully!');
      setShowEnquiryModal(false);
    } catch (error) {
      console.error('Error creating enquiry:', error);
      showToast('Error sending enquiry');
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="empty-state">
        <h3>Property not found</h3>
      </div>
    );
  }

  const statusClass = {
    'Available': 'st-available',
    'Reserved': 'st-reserved',
    'Sold': 'st-sold'
  };

  return (
    <div className="container" style={{ paddingTop: '36px', paddingBottom: '80px' }}>
      <div style={{ fontSize: '12px', color: 'var(--ink-3)', marginBottom: '18px' }}>
        <Link to="/properties" style={{ color: 'var(--ink-3)' }}>Properties</Link> / {property.name}
      </div>

      <div className="detail-gallery">
        <img 
          src={property.images?.[0] || 'https://via.placeholder.com/900x650/d4a574/ffffff?text=Property+Image'} 
          alt={property.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/900x650/e8ddd3/8b7355?text=No+Image';
          }}
        />
        <div className="gallery-side">
          <img 
            src={property.images?.[1] || 'https://via.placeholder.com/900x650/c9945f/ffffff?text=Property+Image+2'} 
            alt=""
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/900x650/e8ddd3/8b7355?text=No+Image';
            }}
          />
          <img 
            src={property.images?.[2] || 'https://via.placeholder.com/900x650/b8834a/ffffff?text=Property+Image+3'} 
            alt=""
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/900x650/e8ddd3/8b7355?text=No+Image';
            }}
          />
        </div>
      </div>

      <div className="detail-layout">
        <div>
          <div className="detail-badges">
            <span className={`p-status ${statusClass[property.status]}`} style={{ position: 'static' }}>
              {property.status}
            </span>
            <span className="eyebrow" style={{ alignSelf: 'center' }}>{property.type}</span>
          </div>
          
          <h1 className="detail-title">{property.name}</h1>
          <div className="detail-loc">
            {property.location}, {property.city} · Developed by {property.developer}
          </div>

          <div className="stat-strip">
            <div className="stat">
              <span className="eyebrow">Price</span>
              <div className="stat-val">{property.priceLabel}</div>
            </div>
            <div className="stat">
              <span className="eyebrow">Area</span>
              <div className="stat-val">{property.size} sq.ft</div>
            </div>
            {property.bedrooms && (
              <div className="stat">
                <span className="eyebrow">Bedrooms</span>
                <div className="stat-val">{property.bedrooms} BHK</div>
              </div>
            )}
            <div className="stat">
              <span className="eyebrow">Listed</span>
              <div className="stat-val">{format(new Date(property.createdAt), 'dd MMM yyyy')}</div>
            </div>
          </div>

          <div className="detail-block">
            <h3>Description</h3>
            <p style={{ color: 'var(--ink-3)' }}>{property.description}</p>
          </div>

          <div className="detail-block">
            <h3>Amenities</h3>
            <div className="amenity-list">
              {property.amenities?.map((amenity, index) => (
                <div key={index} className="amenity-item">{amenity}</div>
              ))}
            </div>
          </div>

          {property.nearby && (
            <div className="detail-block">
              <h3>Nearby</h3>
              {property.nearby.map((item, index) => {
                const [name, distance] = item.split(' — ');
                return (
                  <div key={index} className="nearby-item">
                    <span>{name}</span>
                    <span className="mono">{distance}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <div className="sticky-panel">
            <div className="p-price">{property.priceLabel}</div>
            <div style={{ fontSize: '12px', color: 'var(--ink-3)' }}>
              {property.size} sq.ft{property.bedrooms && ` · ${property.bedrooms} BHK`}
            </div>
            <div className="sticky-actions">
              <button 
                className="btn btn-primary btn-block"
                onClick={() => setShowBookingModal(true)}
                disabled={property.status === 'Sold'}
              >
                Book Now
              </button>
              <button 
                className="btn btn-ghost btn-block"
                onClick={() => setShowSiteVisitModal(true)}
                disabled={property.status === 'Sold'}
              >
                Schedule Site Visit
              </button>
              <button 
                className="btn btn-ghost btn-block"
                onClick={() => setShowEnquiryModal(true)}
              >
                Enquire Now
              </button>
              <button 
                className="btn btn-wa btn-block"
                onClick={() => window.open(`https://wa.me/914023456789?text=Hi, I'm interested in ${encodeURIComponent(property.name)}`, '_blank')}
              >
                WhatsApp
              </button>
              <button 
                className="btn btn-ghost btn-block"
                onClick={() => window.location.href = 'tel:+914023456789'}
              >
                Call Now
              </button>
            </div>
            <div className="dev-card">
              <strong>{property.developer}</strong><br />
              Verified developer partner of The Swamy Properties.
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showBookingModal && (
        <BookingModal
          property={property}
          userProfile={userProfile}
          onSubmit={handleBooking}
          onClose={() => setShowBookingModal(false)}
        />
      )}

      {showSiteVisitModal && (
        <SiteVisitModal
          property={property}
          userProfile={userProfile}
          onSubmit={handleSiteVisit}
          onClose={() => setShowSiteVisitModal(false)}
        />
      )}

      {showEnquiryModal && (
        <EnquiryModal
          property={property}
          userProfile={userProfile}
          onSubmit={handleEnquiry}
          onClose={() => setShowEnquiryModal(false)}
        />
      )}
    </div>
  );
};

// Booking Modal Component
const BookingModal = ({ property, userProfile, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    phone: userProfile?.phone || '',
    email: userProfile?.email || '',
    date: '',
    time: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>Book Now</h3>
        <div className="modal-sub">{property.name} · {property.location}, {property.city}</div>
        <form onSubmit={handleSubmit}>
          <div className="field-row">
            <div className="field">
              <label>Full name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label>Preferred date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="field">
              <label>Preferred time</label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              >
                <option value="">Select</option>
                <option>Morning (10am–12pm)</option>
                <option>Afternoon (12pm–4pm)</option>
                <option>Evening (4pm–7pm)</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>Message (optional)</label>
            <textarea
              rows="3"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Anything we should know before we call you?"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Submit Booking</button>
        </form>
      </div>
    </div>
  );
};

// Site Visit Modal
const SiteVisitModal = ({ property, userProfile, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    phone: userProfile?.phone || '',
    date: '',
    time: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>Schedule Site Visit</h3>
        <div className="modal-sub">{property.name} · {property.location}, {property.city}</div>
        <form onSubmit={handleSubmit}>
          <div className="field-row">
            <div className="field">
              <label>Full name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Visit date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="field">
              <label>Visit time</label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              >
                <option value="">Select</option>
                <option>Morning (10am–12pm)</option>
                <option>Afternoon (12pm–4pm)</option>
                <option>Evening (4pm–7pm)</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>Message (optional)</label>
            <textarea
              rows="3"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Request Visit</button>
        </form>
      </div>
    </div>
  );
};

// Enquiry Modal
const EnquiryModal = ({ property, userProfile, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    phone: userProfile?.phone || '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>Enquire Now</h3>
        <div className="modal-sub">{property.name} · {property.location}, {property.city}</div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label>Message</label>
            <textarea
              rows="4"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="What would you like to know?"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Send Enquiry</button>
        </form>
      </div>
    </div>
  );
};

export default PropertyDetail;
