import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.svg';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="foot-grid">
          <div>
            <div className="logo" style={{ color: 'var(--cream)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={logo} alt="The Swamy Properties" style={{ width: '36px', height: '36px', borderRadius: '8px' }} />
              THE SWAMY
            </div>
            <p style={{ fontSize: '13px', maxWidth: '280px' }}>
              Premium villas, apartments and plots across Hyderabad, Bengaluru and Goa — chosen for how they live, not just how they look.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <Link to="/">Home</Link>
            <Link to="/properties">Properties</Link>
            <Link to="/properties?type=Project">Projects</Link>
            <Link to="/about">About</Link>
          </div>
          <div>
            <h4>Account</h4>
            <Link to="/account">My Account</Link>
            <Link to="/favorites">Favorites</Link>
          </div>
          <div>
            <h4>Talk to us</h4>
            <a href="tel:+914023456789">+91 40 2345 6789</a>
            <a href="https://wa.me/914023456789" target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <a href="mailto:hello@tuheswamiproperties.com">hello@tuheswamiproperties.com</a>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 The Swamy Properties. All rights reserved.</span>
          <span>Hyderabad · Bengaluru · Goa</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
