import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { SEED_PROPERTIES } from '../utils/seedData';
import PropertyCard from '../components/PropertyCard';
import './Properties.css';

const PROPERTY_TYPES = [
  'Apartment', 'Villa', 'Independent House', 'Plot',
  'Farm Land', 'Commercial', 'Office', 'Shop', 'Other'
];

const AMENITIES = [
  'Parking', 'Swimming Pool', 'Gym', 'Club House',
  'Gated Community', 'Security', 'Power Backup', 'Lift'
];

const STATUSES = ['Ready to Move', 'Under Construction', 'New Launch', 'Resale'];
const BHK_OPTIONS = ['1', '2', '3', '4', '5+'];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price — Low to High' },
  { value: 'price-desc', label: 'Price — High to Low' }
];

const TAB_LABELS = {
  buy: 'Buy', rent: 'Rent', plots: 'Plots', projects: 'Projects'
};

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  const [filters, setFilters] = useState({
    tab: searchParams.get('tab') || '',
    search: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    bhk: searchParams.get('bhk') ? searchParams.get('bhk').split(',') : [],
    plotSize: searchParams.get('plotSize') || '',
    status: searchParams.get('status') ? searchParams.get('status').split(',') : [],
    amenities: searchParams.get('amenities') ? searchParams.get('amenities').split(',') : [],
    areaMin: searchParams.get('areaMin') || '',
    areaMax: searchParams.get('areaMax') || '',
    possession: searchParams.get('possession') || '',
    sort: searchParams.get('sort') || 'relevance'
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    loadProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties, filters]);

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
    } catch (error) {
      console.error('Error loading properties:', error);
      // Fallback to seed data when Firestore is unavailable
      setProperties(SEED_PROPERTIES.map((p, i) => ({ id: `seed-${i}`, ...p })));
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...properties];

    // Tab filter (buy/rent/plots/projects)
    if (filters.tab === 'plots') {
      filtered = filtered.filter(p => p.type === 'Plot' || p.type === 'Farm Land');
    } else if (filters.tab === 'projects') {
      filtered = filtered.filter(p => p.type === 'Project');
    } else if (filters.tab === 'rent') {
      filtered = filtered.filter(p => p.listingType === 'rent' || p.listingType === 'Rent');
    }

    // Location / keyword filter
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q)
      );
    }

    // Property type filter (supports comma-separated multiple)
    if (filters.type) {
      const typeList = filters.type.split(',').map(t => t.trim());
      filtered = filtered.filter(p => typeList.includes(p.type));
    }

    // Price range
    if (filters.priceMin) {
      filtered = filtered.filter(p => p.price >= Number(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter(p => p.price <= Number(filters.priceMax));
    }

    // BHK filter
    if (filters.bhk.length) {
      filtered = filtered.filter(p => {
        if (!p.bedrooms) return false;
        return filters.bhk.some(b =>
          b === '5+' ? p.bedrooms >= 5 : String(p.bedrooms) === b
        );
      });
    }

    // Plot size filter (Sq. Yd → Sq. Ft approx ×9)
    if (filters.plotSize) {
      filtered = filtered.filter(p => {
        if (!p.size) return false;
        const sizeYd = p.size / 9;
        return filters.plotSize === '500+'
          ? sizeYd >= 500
          : Math.abs(sizeYd - Number(filters.plotSize)) <= 60;
      });
    }

    // Status filter
    if (filters.status.length) {
      filtered = filtered.filter(p => filters.status.includes(p.status));
    }

    // Amenities filter
    if (filters.amenities.length) {
      filtered = filtered.filter(p =>
        filters.amenities.every(a =>
          (p.amenities || []).some(pa => pa.toLowerCase().includes(a.toLowerCase()))
        )
      );
    }

    // Area filter
    if (filters.areaMin) {
      filtered = filtered.filter(p => p.size >= Number(filters.areaMin));
    }
    if (filters.areaMax) {
      filtered = filtered.filter(p => p.size <= Number(filters.areaMax));
    }

    // Possession filter (approximate via status)
    if (filters.possession === 'Ready to Move') {
      filtered = filtered.filter(p => p.status === 'Available' || p.status === 'Ready to Move');
    }

    // Sorting
    switch (filters.sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProperties(filtered);
    setVisibleCount(6);
  };

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Preserve state in URL for shareable links
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        if (v.length) params.set(k, v.join(','));
      } else if (v && !(k === 'sort' && v === 'relevance')) {
        params.set(k, v);
      }
    });
    setSearchParams(params);
  };

  const toggleArrayFilter = (key, value) => {
    const arr = filters[key];
    updateFilter(key, arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]);
  };

  const resetFilters = () => {
    setFilters({
      tab: '', search: '', type: '', priceMin: '', priceMax: '',
      bhk: [], plotSize: '', status: [], amenities: [],
      areaMin: '', areaMax: '', possession: '', sort: 'relevance'
    });
    setSearchParams(new URLSearchParams());
  };

  const activeFilterCount =
    (filters.type ? 1 : 0) + (filters.bhk.length ? 1 : 0) +
    (filters.status.length ? 1 : 0) + (filters.amenities.length ? 1 : 0) +
    ((filters.priceMin || filters.priceMax) ? 1 : 0) +
    ((filters.areaMin || filters.areaMax) ? 1 : 0);

  const visibleProperties = filteredProperties.slice(0, visibleCount);

  const FilterSidebar = () => (
    <aside className="prop-sidebar">
      <div className="sidebar-head">
        <h3>Filters</h3>
        <button className="link-btn" onClick={resetFilters}>Reset all</button>
      </div>

      <div className="filter-group">
        <label>Location</label>
        <input
          type="text"
          placeholder="City or locality"
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Property Type</label>
        <select value={filters.type} onChange={(e) => updateFilter('type', e.target.value)}>
          <option value="">All types</option>
          {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label>Budget</label>
        <div className="range-row">
          <select value={filters.priceMin} onChange={(e) => updateFilter('priceMin', e.target.value)}>
            <option value="">Min</option>
            {[2000000, 3000000, 5000000, 7500000, 10000000].map(v => (
              <option key={v} value={v}>₹{v >= 10000000 ? `${v / 10000000} Cr` : `${v / 100000} L`}</option>
            ))}
          </select>
          <select value={filters.priceMax} onChange={(e) => updateFilter('priceMax', e.target.value)}>
            <option value="">Max</option>
            {[5000000, 7500000, 10000000, 20000000, 50000000].map(v => (
              <option key={v} value={v}>₹{v >= 10000000 ? `${v / 10000000} Cr` : `${v / 100000} L`}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-group">
        <label>BHK</label>
        <div className="chip-row">
          {BHK_OPTIONS.map(b => (
            <button
              key={b}
              className={`chip ${filters.bhk.includes(b) ? 'active' : ''}`}
              onClick={() => toggleArrayFilter('bhk', b)}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Status</label>
        <div className="chip-row wrap">
          {STATUSES.map(s => (
            <button
              key={s}
              className={`chip ${filters.status.includes(s) ? 'active' : ''}`}
              onClick={() => toggleArrayFilter('status', s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Amenities</label>
        <div className="chip-row wrap">
          {AMENITIES.map(a => (
            <button
              key={a}
              className={`chip ${filters.amenities.includes(a) ? 'active' : ''}`}
              onClick={() => toggleArrayFilter('amenities', a)}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Area (Sq. Ft.)</label>
        <div className="range-row">
          <input type="number" placeholder="Min" value={filters.areaMin}
            onChange={(e) => updateFilter('areaMin', e.target.value)} />
          <input type="number" placeholder="Max" value={filters.areaMax}
            onChange={(e) => updateFilter('areaMax', e.target.value)} />
        </div>
      </div>

      <div className="filter-group">
        <label>Possession</label>
        <select value={filters.possession} onChange={(e) => updateFilter('possession', e.target.value)}>
          <option value="">Any</option>
          <option>Ready to Move</option>
          <option>Within 3 Months</option>
          <option>Within 6 Months</option>
          <option>Within 1 Year</option>
        </select>
      </div>
    </aside>
  );

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <section className="props-page">
      <div className="container">
        {/* Page header */}
        <div className="props-header">
          <div>
            <h2>
              Services{filters.search ? ` in ${filters.search}` : ''}
              {filters.tab ? ` · ${TAB_LABELS[filters.tab]}` : ''}
            </h2>
            <span className="eyebrow">{filteredProperties.length} Services Found</span>
          </div>
          <div className="sort-control">
            <label>Sort by:</label>
            <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Mobile controls */}
        <div className="mobile-controls">
          <button className="mobile-filter-btn" onClick={() => setShowMobileFilters(true)}>
            ⚙️ Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        <div className="props-layout">
          {/* Desktop sidebar */}
          <div className="desktop-only"><FilterSidebar /></div>

          {/* Results */}
          <div className="props-results">
            {filteredProperties.length === 0 ? (
              <div className="empty-state">
                <h3>No properties match those filters</h3>
                <p>Try widening your search — clear a filter or two and we'll show you what's available.</p>
                <br />
                <button className="btn btn-ghost" onClick={resetFilters}>
                  Reset filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-2">
                  {visibleProperties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
                {filteredProperties.length > visibleCount && (
                  <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <button
                      className="btn btn-ghost"
                      onClick={() => setVisibleCount(prev => prev + 6)}
                    >
                      Load more properties
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile bottom-sheet filters */}
      {showMobileFilters && (
        <div className="sheet-overlay" onClick={() => setShowMobileFilters(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle"></div>
            <FilterSidebar />
            <div className="sheet-foot">
              <button className="btn btn-ghost" onClick={resetFilters}>RESET</button>
              <button className="btn btn-primary" onClick={() => setShowMobileFilters(false)}>
                SHOW {filteredProperties.length} RESULTS
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Properties;
