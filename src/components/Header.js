import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { FaHome, FaBuilding, FaSearch, FaUser, FaHeart, FaCog } from 'react-icons/fa';
import AuthModal from './AuthModal';
import logo from '../logo.svg';
import './Header.css';

const Header = () => {
  const { currentUser, userProfile } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (currentUser) {
      loadFavoriteCount();
    }
  }, [currentUser]);

  const loadFavoriteCount = async () => {
    if (!currentUser) return;
    const q = query(collection(db, 'favorites'), where('userId', '==', currentUser.uid));
    const snapshot = await getDocs(q);
    setFavoriteCount(snapshot.size);
  };

  const openAuth = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleAccountClick = () => {
    if (currentUser) {
      navigate('/account');
    } else {
      openAuth('login');
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <header className="header">
        <div className="container nav-row">
          <Link to="/" className="logo">
            <img src={logo} alt="The Swamy Properties" className="logo-img" />
            <span className="logo-text">
              THE SWAMY
              <span className="logo-sub">Properties</span>
            </span>
          </Link>

          <nav className="desktop-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/properties" className="nav-link">Properties</Link>
            <Link to="/properties?type=Project" className="nav-link">Projects</Link>
            <Link to="/about" className="nav-link">About</Link>
            
            {/* Inline Search Bar */}
            <div className="nav-search">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search properties..." 
                className="nav-search-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    navigate(`/properties?search=${e.target.value}`);
                    e.target.value = '';
                  }
                }}
              />
            </div>
            
            {currentUser && (
              <span className="nav-link">
                Hi, {userProfile?.name?.split(' ')[0] || 'User'}
              </span>
            )}
          </nav>

          <div className="header-actions">
            <button 
              className="icon-btn" 
              onClick={() => setShowSearchBar(!showSearchBar)} 
              title="Search"
            >
              <FaSearch />
            </button>
            <button className="icon-btn" onClick={() => navigate('/favorites')} title="Favorites">
              <FaHeart />
              {favoriteCount > 0 && (
                <span className="badge-count">{favoriteCount}</span>
              )}
            </button>
            <button className="icon-btn" onClick={handleAccountClick} title="Account">
              <FaUser />
            </button>
            <button className="hamburger" onClick={() => setShowMobileMenu(true)}>
              <div></div>
              <div></div>
              <div></div>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearchBar && (
          <div className="search-bar-dropdown">
            <div className="container">
              <input 
                type="text" 
                placeholder="Search properties..." 
                className="search-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/properties?search=${e.target.value}`);
                    setShowSearchBar(false);
                  }
                }}
              />
            </div>
          </div>
        )}
      </header>

      {/* Bottom Navigation Bar */}
      <nav className="bottom-nav">
        <Link 
          to="/" 
          className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}
        >
          <FaHome />
          <span>Home</span>
        </Link>
        <Link 
          to="/properties" 
          className={`bottom-nav-item ${isActive('/properties') ? 'active' : ''}`}
        >
          <FaBuilding />
          <span>Properties</span>
        </Link>
        <button 
          className="bottom-nav-item" 
          onClick={() => setShowSearchBar(!showSearchBar)}
        >
          <FaSearch />
          <span>Search</span>
        </button>
        <Link 
          to="/favorites" 
          className={`bottom-nav-item ${isActive('/favorites') ? 'active' : ''}`}
        >
          <FaHeart />
          <span>Favorites</span>
          {favoriteCount > 0 && (
            <span className="bottom-nav-badge">{favoriteCount}</span>
          )}
        </Link>
        <button 
          className="bottom-nav-item" 
          onClick={handleAccountClick}
        >
          <FaCog />
          <span>Settings</span>
        </button>
      </nav>

      {showMobileMenu && (
        <div className="mobile-drawer open">
          <button className="drawer-close" onClick={() => setShowMobileMenu(false)}>
            ×
          </button>
          <nav style={{ marginTop: '20px' }}>
            <Link to="/" className="nav-link" onClick={() => setShowMobileMenu(false)}>
              Home
            </Link>
            <Link to="/properties" className="nav-link" onClick={() => setShowMobileMenu(false)}>
              Properties
            </Link>
            <Link to="/properties?type=Project" className="nav-link" onClick={() => setShowMobileMenu(false)}>
              Projects
            </Link>
            <Link to="/about" className="nav-link" onClick={() => setShowMobileMenu(false)}>
              About
            </Link>
            <Link to="/account" className="nav-link" onClick={() => setShowMobileMenu(false)}>
              {currentUser ? `My Account — ${userProfile?.name?.split(' ')[0]}` : 'Login / Register'}
            </Link>
            <Link to="/favorites" className="nav-link" onClick={() => setShowMobileMenu(false)}>
              Favorites
            </Link>
          </nav>
        </div>
      )}

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}
    </>
  );
};

export default Header;
