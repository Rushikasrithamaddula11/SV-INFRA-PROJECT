import React from 'react';

const About = () => {
  return (
    <section style={{ paddingTop: '40px' }}>
      <div className="container" style={{ maxWidth: '760px' }}>
        <span className="eyebrow">About The Swamy Properties</span>
        <h2 style={{ fontSize: '34px', margin: '12px 0 20px' }}>
          A smaller list of better-checked homes.
        </h2>
        <p style={{ color: 'var(--ink-3)', marginBottom: '16px' }}>
          The Swamy Properties works with a short list of developer partners across Hyderabad, Bengaluru and Goa. 
          Every listing is site-verified before it goes live, and availability status is kept current — what you 
          see is what is actually left.
        </p>
        <p style={{ color: 'var(--ink-3)', marginBottom: '16px' }}>
          We keep the process simple: browse, shortlist, schedule a visit, and talk to a real person before you 
          decide anything. No call centre scripts.
        </p>
        <div className="grid grid-3" style={{ marginTop: '36px' }}>
          <div className="p-card" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '17px', marginBottom: '8px' }}>Site-verified listings</h3>
            <p style={{ fontSize: '13px', color: 'var(--ink-3)' }}>
              Every property is inspected before publishing.
            </p>
          </div>
          <div className="p-card" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '17px', marginBottom: '8px' }}>Real availability</h3>
            <p style={{ fontSize: '13px', color: 'var(--ink-3)' }}>
              Status updates the moment a unit is reserved or sold.
            </p>
          </div>
          <div className="p-card" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '17px', marginBottom: '8px' }}>Direct access</h3>
            <p style={{ fontSize: '13px', color: 'var(--ink-3)' }}>
              Book a visit and speak with our team directly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
