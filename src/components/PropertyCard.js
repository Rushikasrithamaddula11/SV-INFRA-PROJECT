import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './PropertyCard.css';

const PropertyCard = ({ property, onFavoriteChange }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkFavorite = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      const q = query(
        collection(db, 'favorites'),
        where('userId', '==', currentUser.uid),
        where('propertyId', '==', property.id)
      );
      const snapshot = await getDocs(q);
      setIsFavorite(!snapshot.empty);
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  }, [currentUser, property.id]);

  useEffect(() => {
    if (currentUser) {
      checkFavorite();
    }
  }, [currentUser, property.id, checkFavorite]);

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    
    if (!currentUser) {
      showToast('Please login to save favorites');
      return;
    }

    setLoading(true);

    try {
      if (isFavorite) {
        // Remove from favorites
        const q = query(
          collection(db, 'favorites'),
          where('userId', '==', currentUser.uid),
          where('propertyId', '==', property.id)
        );
        const snapshot = await getDocs(q);
        snapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        setIsFavorite(false);
        showToast('Removed from favorites');
      } else {
        // Add to favorites
        const favoriteRef = doc(collection(db, 'favorites'));
        await setDoc(favoriteRef, {
          userId: currentUser.uid,
          propertyId: property.id,
          propertyName: property.name,
          createdAt: new Date().toISOString()
        });
        setIsFavorite(true);
        showToast('Saved to favorites');
      }

      if (onFavoriteChange) {
        onFavoriteChange();
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showToast('Error updating favorites');
    } finally {
      setLoading(false);
    }
  };

  const statusClass = {
    'Available': 'st-available',
    'Reserved': 'st-reserved',
    'Sold': 'st-sold'
  };

  return (
    <div className="p-card">
      <div 
        className="p-card-img" 
        onClick={() => navigate(`/property/${property.id}`)}
        style={{ cursor: 'pointer' }}
      >
        <img 
          src={property.images?.[0] || 'https://via.placeholder.com/900x650/d4a574/ffffff?text=Property+Image'} 
          alt={property.name}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/900x650/e8ddd3/8b7355?text=No+Image';
          }}
        />
        <span className={`p-status ${statusClass[property.status]}`}>
          {property.status}
        </span>
        <button 
          className={`fav-toggle ${isFavorite ? 'active' : ''}`}
          onClick={toggleFavorite}
          disabled={loading}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>
      <div className="p-card-body">
        <span className="p-type">{property.type}</span>
        <h3 onClick={() => navigate(`/property/${property.id}`)} style={{ cursor: 'pointer' }}>
          {property.name}
        </h3>
        <span className="p-loc">{property.location}, {property.city}</span>
        <div className="p-meta">
          <span>{property.size} sq.ft</span>
          {property.bedrooms && <span>{property.bedrooms} BHK</span>}
        </div>
        <p className="p-desc">
          {property.description?.slice(0, 86)}…
        </p>
        <div className="p-price">{property.priceLabel}</div>
        <div className="p-card-actions">
          <button 
            className="btn btn-ghost btn-sm" 
            style={{ flex: 1 }}
            onClick={() => navigate(`/property/${property.id}`)}
          >
            View Details
          </button>
          <button 
            className="btn btn-primary btn-sm" 
            style={{ flex: 1 }}
            onClick={() => navigate(`/property/${property.id}`)}
            disabled={property.status === 'Sold'}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
