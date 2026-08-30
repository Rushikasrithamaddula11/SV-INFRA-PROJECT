import React from 'react';
import { FaBuilding, FaDraftingCompass, FaLayerGroup, FaLightbulb, FaThLarge, FaWindowMaximize, FaTools } from 'react-icons/fa';
import './Services.css';

const services = [
  { name: 'ACP 3D Facade Cladding', icon: FaLayerGroup, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80' },
  { name: 'Premium Architectural Elevations', icon: FaDraftingCompass, image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=900&q=80' },
  { name: 'CNC Cut ACP Designs', icon: FaTools, image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80' },
  { name: 'Laser Cut Decorative Panels', icon: FaLightbulb, image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80' },
  { name: 'Perforated ACP Facades', icon: FaThLarge, image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80' },
  { name: 'Aluminium Composite Panel Works', icon: FaBuilding, image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=900&q=80&sat=-30' },
  { name: 'Glass Glazing', icon: FaWindowMaximize, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80' },
  { name: 'Spider Glazing', icon: FaWindowMaximize, image: 'https://images.unsplash.com/photo-1462396881884-de2c07cb95ed?auto=format&fit=crop&w=900&q=80' },
  { name: 'Structural Glazing', icon: FaBuilding, image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80' },
  { name: 'Aluminium & UPVC Windows', icon: FaWindowMaximize, image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80&sat=-40' },
  { name: 'Exterior Renovation Works', icon: FaTools, image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80' },
];

const Services = () => (
  <section className="services-page">
    <div className="container">
      <div className="services-intro">
        <span className="eyebrow">SV Projects 972</span>
        <h1>Our Services</h1>
        <p>Complete exterior design, cladding, glazing and renovation solutions for residential and commercial projects.</p>
      </div>
      <div className="services-grid">
        {services.map(({ name, image, icon: Icon }) => (
          <article className="service-card" key={name}>
            <div className="service-card-image" style={{ backgroundImage: `url(${image})` }} />
            <div className="service-card-content">
              <Icon aria-hidden="true" />
              <h2>{name}</h2>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
