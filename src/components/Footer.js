import React from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="foot-grid">
          <div className="footer-about">
            <h3>SV INFRA PROJECTS 972</h3>
            <p>Professional ACP Cladding, Structural Glazing, Toughened Glass, Aluminium and Interior Solutions for Commercial &amp; Residential Projects.</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <Link to="/about">About Us</Link>
            <Link to="/services">Services</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/">Gallery</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
          <div className="office-details">
            <h4>Andhra Pradesh Office</h4>
            <p><FaMapMarkerAlt aria-hidden="true" /> <span>Opp. Rajahamsa Guest House, RTC Bus Stand to Gooty Road, Anantapur, Andhra Pradesh</span></p>
            <h4>Telangana Office</h4>
            <p><FaMapMarkerAlt aria-hidden="true" /> <span>9-1-1 to 3, Brundavan Studio, ISKCON Compound, St. John's Road, Secunderabad, Telangana</span></p>
          </div>
          <div className="contact-details">
            <h4>Contact</h4>
            <a href="tel:+919515988011"><FaPhoneAlt aria-hidden="true" /> +91 95159 88011</a>
            <a href="tel:+918801185559"><FaPhoneAlt aria-hidden="true" /> +91 88011 85559</a>
            <a href="mailto:svinfraprojects972@gmail.com"><FaEnvelope aria-hidden="true" /> svinfraprojects972@gmail.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
