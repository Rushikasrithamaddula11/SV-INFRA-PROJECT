import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCheck, FaPhoneAlt } from 'react-icons/fa';
import './HomeNew.css';

const highlights = ['ACP 3D Facade Cladding', 'Structural & Spider Glazing', 'Aluminium & UPVC Windows', 'Exterior Renovation Works'];

const HomeNew = () => (
  <>
    <section className="sv-hero">
      <div className="container sv-hero-grid">
        <div className="sv-hero-copy">
          <span className="sv-kicker">SV INFRA PROJECTS 972</span>
          <h1>Built to make every <em>exterior</em> stand apart.</h1>
          <p>Modern façade, glazing, aluminium and interior solutions for commercial and residential projects.</p>
          <div className="sv-actions">
            <Link to="/services" className="sv-btn sv-btn-light">Explore Services <FaArrowRight /></Link>
            <a href="tel:+919515988011" className="sv-btn sv-btn-outline"><FaPhoneAlt /> Talk to us</a>
          </div>
          <div className="sv-hero-points">
            <span><FaCheck /> Design to installation</span>
            <span><FaCheck /> Commercial &amp; residential</span>
          </div>
        </div>
        <div className="sv-hero-image" role="img" aria-label="Modern architectural facade" />
      </div>
    </section>

    <section className="sv-service-strip">
      <div className="container">
        <span>OUR EXPERTISE</span>
        {highlights.map(item => <div key={item}>{item}</div>)}
      </div>
    </section>

    <section className="sv-about">
      <div className="container sv-about-grid">
        <div className="sv-about-copy">
          <span className="sv-kicker sv-kicker-dark">WHO WE ARE</span>
          <h2>About Us</h2>
          <p>SV Infra Projects 972 provides professional architectural, construction finishing and interior solutions for commercial and residential projects. We specialize in modern façade systems, glazing, aluminium works, interior solutions and customized construction finishing services.</p>
          <Link to="/about" className="sv-btn sv-btn-navy">Discover Our Story <FaArrowRight /></Link>
        </div>
        <div className="sv-about-images">
          <div className="sv-image-block" />
          <div className="sv-image-tall" role="img" aria-label="Commercial building exterior" />
        </div>
      </div>
    </section>

    <section className="sv-services-preview">
      <div className="container">
        <div className="sv-section-title">
          <div><span className="sv-kicker sv-kicker-dark">WHAT WE DO</span><h2>Solutions that shape better spaces.</h2></div>
          <Link to="/services" className="sv-text-link">View all services <FaArrowRight /></Link>
        </div>
        <div className="sv-cards">
          {highlights.map((item, index) => <article key={item}><span>0{index + 1}</span><h3>{item}</h3><p>Precise detailing, quality materials and professional installation.</p></article>)}
        </div>
      </div>
    </section>
  </>
);

export default HomeNew;
