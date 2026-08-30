import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './SearchModule.css';

const POPULAR_CITIES = ['Hyderabad', 'Bengaluru', 'Vijayawada', 'Visakhapatnam', 'Goa'];
const POPULAR_LOCALITIES = [
  'Gachibowli', 'Kokapet', 'Kondapur', 'Madhapur', 'HITEC City',
  'Whitefield', 'Jubilee Hills', 'Banjara Hills', 'Shamshabad'
];

const PROPERTY_TYPES = [
  'Apartment', 'Villa', 'Independent House', 'Plot',
  'Farm Land', 'Commercial', 'Office', 'Shop', 'Other'
];

const BUY_BUDGETS = [
  { label: '₹20 L', value: 2000000 },
  { label: '₹30 L', value: 3000000 },
  { label: '₹50 L', value: 5000000 },
  { label: '₹75 L', value: 7500000 },
  { label: '₹1 Cr', value: 10000000 },
  { label: '₹2 Cr+', value: 20000000 },
  { label: '₹5 Cr+', value: 50000000 }
];

const RENT_BUDGETS = [
  { label: '₹10K', value: 10000 },
  { label: '₹20K', value: 20000 },
  { label: '₹30K', value: 30000 },
  { label: '₹50K+', value: 50000 },
  { label: '₹1L+', value: 100000 }
];

const BHK_OPTIONS = ['1', '2', '3', '4', '5+'];
const PLOT_SIZES = ['100', '150', '200', '300', '500+'];

const AMENITIES = [
  'Parking', 'Swimming Pool', 'Gym', 'Club House',
  'Gated Community', 'Security', 'Power Backup', 'Lift'
];

const STATUSES = ['Ready to Move', 'Under Construction', 'New Launch', 'Resale'];

const TAB_CONFIG = {
  buy: { types: PROPERTY_TYPES.filter(t => !['Farm Land'].includes(t)), showBhk: true },
  rent: { types: ['Apartment', 'Independent House', 'Villa', 'Office', 'Shop'], showBhk: true },
  plots: { types: ['Plot', 'Farm Land'], showBhk: false },
  projects: { types: ['Apartment', 'Villa', 'Plot'], showBhk: true }
};

const SearchModule = ({ compact = false }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tab, setTab] = useState(searchParams.get('tab') || 'buy');
  const [location, setLocation] = useState(searchParams.get('city') || '');
  const [types, setTypes] = useState([]);
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [bhk, setBhk] = useState([]);
  const [plotSize, setPlotSize] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem('tsp_recent_searches') || '[]')
  );
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const locationRef = useRef(null);

  // More filters state
  const [moreFilters, setMoreFilters] = useState({
    status: [],
    amenities: [],
    areaMin: '',
    areaMax: '',
    possession: ''
  });

  useEffect(() => {
    const handler = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const generateSuggestions = (query) => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const cityMatches = POPULAR_CITIES.filter(c => c.toLowerCase().includes(q));
    const localityMatches = POPULAR_LOCALITIES.filter(l => l.toLowerCase().includes(q));
    const out = [];
    [...localityMatches, ...cityMatches].slice(0, 3).forEach(place => {
      out.push({ type: 'place', label: place });
      out.push({ type: 'search', label: `Services in ${place}` });
      out.push({ type: 'search', label: `${place} Apartments` });
      out.push({ type: 'search', label: `${place} Villas` });
    });
    return out.slice(0, 8);
  };

  const handleLocationInput = (value) => {
    setLocation(value);
    setShowLocationDropdown(true);
    setSuggestions(generateSuggestions(value));
  };

  const selectLocation = (value) => {
    setLocation(value);
    setShowLocationDropdown(false);

    // Save to recent searches
    const updated = [value, ...recentSearches.filter(r => r !== value)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('tsp_recent_searches', JSON.stringify(updated));
  };

  const toggleArrayValue = (arr, value) =>
    arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setTypes([]);
    setBhk([]);
    setPlotSize('');
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('tab', tab);
    if (location.trim()) params.set('city', location.trim());
    if (types.length === 1) params.set('type', types[0]);
    else if (types.length > 1) params.set('type', types.join(','));
    if (budgetMin) params.set('priceMin', budgetMin);
    if (budgetMax) params.set('priceMax', budgetMax);
    if (bhk.length) params.set('bhk', bhk.join(','));
    if (plotSize) params.set('plotSize', plotSize);
    if (moreFilters.status.length) params.set('status', moreFilters.status.join(','));
    if (moreFilters.amenities.length) params.set('amenities', moreFilters.amenities.join(','));
    if (moreFilters.areaMin) params.set('areaMin', moreFilters.areaMin);
    if (moreFilters.areaMax) params.set('areaMax', moreFilters.areaMax);
    if (moreFilters.possession) params.set('possession', moreFilters.possession);

    navigate(`/properties?${params.toString()}`);
  };

  const isPlotsTab = tab === 'plots';
  const showBhkRow = TAB_CONFIG[tab].showBhk;

  return (
    <div className={`search-module ${compact ? 'compact' : ''}`}>
      {/* Main search bar */}
      <div className="sm-bar">
        {/* Location */}
        <div className="sm-field sm-location" ref={locationRef}>
          <span className="sm-icon">📍</span>
          <input
            type="text"
            placeholder="Search city, locality, landmark or project"
            value={location}
            onChange={(e) => handleLocationInput(e.target.value)}
            onFocus={() => setShowLocationDropdown(true)}
          />
          {showLocationDropdown && (
            <div className="sm-dropdown">
              {!location && recentSearches.length > 0 && (
                <>
                  <div className="sm-dd-title">Recent Searches</div>
                  {recentSearches.map((r, i) => (
                    <button key={`r-${i}`} className="sm-dd-item" onClick={() => selectLocation(r)}>
                      🕘 {r}
                    </button>
                  ))}
                </>
              )}
              <div className="sm-dd-title">Popular Localities</div>
              {POPULAR_LOCALITIES.slice(0, 5).map((l, i) => (
                <button key={`l-${i}`} className="sm-dd-item" onClick={() => selectLocation(l)}>
                  📍 {l}
                </button>
              ))}
              <div className="sm-dd-title">Popular Cities</div>
              {POPULAR_CITIES.map((c, i) => (
                <button key={`c-${i}`} className="sm-dd-item" onClick={() => selectLocation(c)}>
                  🏙️ {c}
                </button>
              ))}
            </div>
          )}
          {suggestions.length > 0 && showLocationDropdown && location && (
            <div className="sm-dropdown">
              {suggestions.map((s, i) => (
                <button
                  key={`s-${i}`}
                  className="sm-dd-item"
                  onClick={() => s.type === 'place' ? selectLocation(s.label) : handleSearch()}
                >
                  🔍 {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search button */}
        <button className="sm-search-btn" onClick={handleSearch}>
          SEARCH
        </button>
      </div>
    </div>
  );
};

export default SearchModule;
