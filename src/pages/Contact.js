import React, { useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaPhoneAlt } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="contact-page">
      <div className="container contact-layout">
        <aside className="contact-info">
          <article className="contact-info-card">
            <h3>Andhra Pradesh Office</h3>
            <p><FaMapMarkerAlt aria-hidden="true" /><span>Opp. Rajahamsa Guest House, RTC Bus Stand to Gooty Road, Anantapur, Andhra Pradesh</span></p>
          </article>
          <article className="contact-info-card">
            <h3>Telangana Office</h3>
            <p><FaMapMarkerAlt aria-hidden="true" /><span>9-1-1 to 3, Brundavan Studio, ISKCON Compound, St. John's Road, Secunderabad, Telangana</span></p>
          </article>
          <article className="contact-info-card contact-direct">
            <a href="tel:+919515988011"><FaPhoneAlt aria-hidden="true" /> +91 95159 88011</a>
            <a href="tel:+918801185559"><FaPhoneAlt aria-hidden="true" /> +91 88011 85559</a>
            <a href="mailto:info@svinfraprojects.com"><FaEnvelope aria-hidden="true" /> info@svinfraprojects.com</a>
          </article>
        </aside>
        <div className="enquiry-form-wrap">
          <span className="sv-kicker sv-kicker-dark">CONTACT SV INFRA PROJECTS 972</span>
          <h1>Get a Free Quote</h1>
          <p>Fill in the form and our team will get back to you shortly.</p>
          {submitted ? (
            <div className="form-success">Thank you. Your enquiry has been received and our team will contact you shortly.</div>
          ) : (
            <form onSubmit={submit} className="enquiry-form">
              <input required name="name" placeholder="Full Name *" />
              <input required name="phone" type="tel" placeholder="Phone Number *" />
              <input name="email" type="email" placeholder="Email" />
              <input name="location" placeholder="Location" />
              <select name="service" defaultValue=""><option value="" disabled>Service Required</option><option>ACP 3D Facade Cladding</option><option>Architectural Elevations</option><option>Glass & Structural Glazing</option><option>Aluminium & UPVC Windows</option><option>Exterior Renovation Works</option></select>
              <select name="projectType" defaultValue="Residential"><option>Residential</option><option>Commercial</option><option>Institutional</option></select>
              <textarea name="message" placeholder="Message" rows="6" />
              <button type="submit"><FaPaperPlane /> Submit Enquiry</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
