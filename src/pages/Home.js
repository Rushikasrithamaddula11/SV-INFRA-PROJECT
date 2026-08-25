import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { SEED_PROPERTIES } from '../utils/seedData';
import PropertyCard from '../components/PropertyCard';
import SearchModule from '../components/SearchModule';
import './Home.css';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const propertiesRef = collection(db, 'properties');
      // Race against a timeout: if Firestore is unreachable/unconfigured,
      // getDocs can hang retrying instead of rejecting.
      const snapshot = await Promise.race([
        getDocs(propertiesRef),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Firestore timeout')), 5000)
        )
      ]);
      const props = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setProperties(props);
      setFeatured(props.filter(p => p.featured).slice(0, 3));
      
      // Sort by createdAt descending
      const sortedByDate = [...props].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setLatest(sortedByDate.slice(0, 3));
    } catch (error) {
      console.error('Error loading properties:', error);
      // Fallback to seed data when Firestore is unavailable
      const props = SEED_PROPERTIES.map((p, i) => ({ id: `seed-${i}`, ...p }));
      setProperties(props);
      setFeatured(props.filter(p => p.featured).slice(0, 3));
      const sortedByDate = [...props].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setLatest(sortedByDate.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  const cities = [...new Set(properties.map(p => p.city))];
  const types = [...new Set(properties.map(p => p.type))];

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <section className="hero">
        <div className="hero-slats"></div>
      </section>

      <section>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Handpicked</span>
              <h2>Featured properties</h2>
            </div>
            <Link to="/properties" className="btn btn-ghost btn-sm">View all</Link>
          </div>
          <div className="grid grid-3">
            {featured.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Just listed</span>
              <h2>Latest properties</h2>
            </div>
          </div>
          <div className="grid grid-3">
            {latest.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band">
            <h2>Ready to see it in person?</h2>
            <p>Schedule a site visit at a time that works for you — no pressure, no sales script.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/properties" className="btn btn-brass">Schedule a Visit</Link>
              <a href="https://wa.me/914023456789" target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light">
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
