import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const { currentUser } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    try {
      const q = query(collection(db, 'favorites'), where('userId', '==', currentUser.uid));
      const snapshot = await getDocs(q);
      const favoritePropertyIds = snapshot.docs.map(doc => doc.data().propertyId);

      // Load property details
      const propertyPromises = favoritePropertyIds.map(async (id) => {
        const propertyDoc = await getDoc(doc(db, 'properties', id));
        if (propertyDoc.exists()) {
          return { id: propertyDoc.id, ...propertyDoc.data() };
        }
        return null;
      });

      const loadedProperties = await Promise.all(propertyPromises);
      setProperties(loadedProperties.filter(p => p !== null));
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container" style={{ padding: '80px 0' }}>
        <div className="empty-state">
          <h3>Log in to view your favorites</h3>
          <p>Save services as you browse and find them here anytime.</p>
          <br />
          <Link to="/account" className="btn btn-primary">Login / Register</Link>
        </div>
      </div>
    );
  }

  return (
    <section style={{ paddingTop: '40px' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Saved by you</span>
            <h2>Favorites</h2>
          </div>
        </div>
        {properties.length === 0 ? (
          <div className="empty-state">
            <h3>No favorites yet</h3>
            <p>Tap the heart on any service to save it here.</p>
            <br />
            <Link to="/services" className="btn btn-ghost">Browse services</Link>
          </div>
        ) : (
          <div className="grid grid-3">
            {properties.map(property => (
              <PropertyCard 
                key={property.id} 
                property={property}
                onFavoriteChange={loadFavorites}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Favorites;
