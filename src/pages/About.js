import React from "react";
import "./About.css";

const About = () => {
  return (
    <section className="about-page">
      <div className="container about-shell">
        <span className="about-kicker">About SV Projects 972</span>
        <h2 className="about-title">
          Exterior solutions, built with care.
        </h2>
        <p className="about-lead about-text">
          SV Projects 972 delivers façade, cladding, glazing, window and renovation work for residential and commercial projects.
          We focus on durable materials, clean detailing and dependable execution from design through installation.
        </p>
        <p className="about-text">
          We keep the process simple: discuss your requirement, select the right finish and system, then coordinate a professional installation.
        </p>
        <div className="about-benefits" style={{ marginTop: '36px' }}>
          <div className="about-benefit" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '17px', marginBottom: '8px' }}>Quality finishes</h3>
            <p style={{ fontSize: '13px', color: 'var(--ink-3)' }}>
              Thoughtful material choices for a lasting exterior.
            </p>
          </div>
          <div className="about-benefit" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '17px', marginBottom: '8px' }}>Expert execution</h3>
            <p style={{ fontSize: '13px', color: 'var(--ink-3)' }}>
              Skilled workmanship for every stage of the project.
            </p>
          </div>
          <div className="about-benefit" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '17px', marginBottom: '8px' }}>Direct support</h3>
            <p style={{ fontSize: '13px', color: 'var(--ink-3)' }}>
              Speak directly with our team about your requirements.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
