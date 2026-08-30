import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { uploadMultipleToCloudinary } from '../../utils/cloudinary';
import { SEED_PROPERTIES } from '../../utils/seedData';
import { AdminHeader } from './AdminDashboard';
import './AdminDashboard.css';

const AdminProperties = () => {
  const { currentUser, userProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'Villa',
    location: '',
    city: 'Hyderabad',
    price: '',
    priceLabel: '',
    size: '',
    bedrooms: '',
    status: 'Available',
    featured: false,
    description: '',
    amenities: '',
    nearby: '',
    developer: '',
    images: ''
  });

  const loadProperties = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, 'properties'));
      const props = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProperties(props);
    } catch (error) {
      console.error('Error loading properties:', error);
      // Firestore not provisioned / rules deny access — fall back to seed data
      setProperties(SEED_PROPERTIES.map((p, i) => ({ id: `seed-${i}`, ...p })));
      showToast('Showing demo data (Firestore not connected)');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!currentUser || userProfile?.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    loadProperties();
  }, [currentUser, userProfile, navigate, loadProperties]);

  const handleOpenModal = (property = null) => {
    if (property) {
      setEditingProperty(property);
      setFormData({
        name: property.name || '',
        type: property.type || 'Villa',
        location: property.location || '',
        city: property.city || 'Hyderabad',
        price: property.price || '',
        priceLabel: property.priceLabel || '',
        size: property.size || '',
        bedrooms: property.bedrooms || '',
        status: property.status || 'Available',
        featured: property.featured || false,
        description: property.description || '',
        amenities: property.amenities?.join(', ') || '',
        nearby: property.nearby?.join(', ') || '',
        developer: property.developer || '',
        images: property.images?.join(', ') || ''
      });
    } else {
      setEditingProperty(null);
      setFormData({
        name: '',
        type: 'Villa',
        location: '',
        city: 'Hyderabad',
        price: '',
        priceLabel: '',
        size: '',
        bedrooms: '',
        status: 'Available',
        featured: false,
        description: '',
        amenities: '',
        nearby: '',
        developer: '',
        images: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const propertyData = {
      ...formData,
      price: Number(formData.price),
      size: Number(formData.size),
      bedrooms: formData.bedrooms ? Number(formData.bedrooms) : null,
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a),
      nearby: formData.nearby.split(',').map(n => n.trim()).filter(n => n),
      images: formData.images.split(',').map(i => i.trim()).filter(i => i),
      createdAt: editingProperty?.createdAt || new Date().toISOString()
    };

    try {
      if (editingProperty) {
        await updateDoc(doc(db, 'properties', editingProperty.id), propertyData);
        showToast('Property updated successfully');
      } else {
        await addDoc(collection(db, 'properties'), propertyData);
        showToast('Property added successfully');
      }
      setShowModal(false);
      loadProperties();
    } catch (error) {
      console.error('Error saving property:', error);
      showToast('Error saving property');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;

    try {
      await deleteDoc(doc(db, 'properties', id));
      showToast('Property deleted successfully');
      loadProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      showToast('Error deleting property');
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
      <AdminHeader currentPath="/admin/properties" onLogout={handleLogout} userProfile={userProfile} />

      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1>Services</h1>
            <p>Manage property listings</p>
          </div>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            + Add Property
          </button>
        </div>

        <div className="admin-panel">
          <div className="panel-body">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(property => (
                  <tr key={property.id}>
                    <td><strong>{property.name}</strong></td>
                    <td>{property.type}</td>
                    <td>{property.location}, {property.city}</td>
                    <td>{property.priceLabel}</td>
                    <td>
                      <span className={`status-badge status-${property.status.toLowerCase()}`}>
                        {property.status}
                      </span>
                    </td>
                    <td>{property.featured ? '⭐' : '—'}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-ghost" 
                        onClick={() => handleOpenModal(property)}
                        style={{ marginRight: '8px' }}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => handleDelete(property.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && setShowModal(false)}>
          <div className="modal-box" style={{ maxWidth: '700px' }}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <h3>{editingProperty ? 'Edit Property' : 'Add New Property'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="field-row">
                <div className="field">
                  <label>Property Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="field">
                  <label>Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Plot">Plot</option>
                    <option value="Project">Project</option>
                  </select>
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div className="field">
                  <label>City *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  >
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Goa">Goa</option>
                  </select>
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="field">
                  <label>Price Label *</label>
                  <input
                    type="text"
                    value={formData.priceLabel}
                    onChange={(e) => setFormData({ ...formData, priceLabel: e.target.value })}
                    placeholder="e.g. ₹2.85 Cr onwards"
                    required
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Size (sq.ft) *</label>
                  <input
                    type="number"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    required
                  />
                </div>
                <div className="field">
                  <label>Bedrooms</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
                <div className="field">
                  <label>Developer *</label>
                  <input
                    type="text"
                    value={formData.developer}
                    onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    style={{ marginRight: '8px' }}
                  />
                  Featured Property
                </label>
              </div>

              <div className="field">
                <label>Description *</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="field">
                <label>Amenities (comma-separated)</label>
                <textarea
                  rows="2"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="24x7 Security, Swimming Pool, Gymnasium"
                />
              </div>

              <div className="field">
                <label>Nearby (comma-separated with distance)</label>
                <textarea
                  rows="2"
                  value={formData.nearby}
                  onChange={(e) => setFormData({ ...formData, nearby: e.target.value })}
                  placeholder="International School — 2.1 km, Hospital — 3.6 km"
                />
              </div>

              <div className="field">
                <label>Upload Images (Cloudinary)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploadingImages}
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length === 0) return;
                    setUploadingImages(true);
                    try {
                      const urls = await uploadMultipleToCloudinary(files);
                      const existing = formData.images
                        .split(',')
                        .map((i) => i.trim())
                        .filter(Boolean);
                      setFormData({ ...formData, images: [...existing, ...urls].join(', ') });
                      showToast(`${urls.length} image(s) uploaded`, 'success');
                    } catch (err) {
                      console.error(err);
                      showToast('Image upload failed: ' + err.message, 'error');
                    } finally {
                      setUploadingImages(false);
                      e.target.value = '';
                    }
                  }}
                />
                {uploadingImages && (
                  <p style={{ fontSize: '12px', color: 'var(--primary-orange)', marginTop: '6px' }}>
                    Uploading images to Cloudinary…
                  </p>
                )}
              </div>

              <div className="field">
                <label>Image URLs (comma-separated)</label>
                <textarea
                  rows="2"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary btn-block">
                  {editingProperty ? 'Update Property' : 'Add Property'}
                </button>
                <button type="button" className="btn btn-ghost btn-block" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProperties;
