import React, { useEffect, useState } from 'react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DEFAULT_SERVICES } from '../data/services';
import './Services.css';

const Services = () => {
  const { currentUser, userProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [selectedService, setSelectedService] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'services'));
        const storedServices = snapshot.docs
          .map(serviceDoc => ({ id: serviceDoc.id, ...serviceDoc.data() }))
          .filter(service => service.active !== false)
          .sort((first, second) => (first.order || 0) - (second.order || 0));
        if (storedServices.length) setServices(storedServices);
      } catch (error) {
        console.warn('Showing default services:', error.message);
      }
    };
    loadServices();
  }, []);

  const submitBooking = async (event) => {
    event.preventDefault();
    if (!currentUser) {
      showToast('Please login to book a service');
      setSelectedService(null);
      navigate('/account');
      return;
    }

    const formData = new FormData(event.currentTarget);
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        userId: currentUser.uid,
        bookingType: 'service',
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        name: userProfile?.name || currentUser.displayName || 'Customer',
        email: userProfile?.email || currentUser.email || '',
        phone: formData.get('phone'),
        date: formData.get('date'),
        time: formData.get('time'),
        message: formData.get('message'),
        status: 'Pending',
        createdAt: new Date().toISOString()
      });
      showToast('Service booking request submitted!');
      setSelectedService(null);
    } catch (error) {
      console.error('Error creating service booking:', error);
      showToast('Error submitting booking');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="services-page">
      <div className="container">
        <div className="services-intro">
          <span className="eyebrow">SV Projects 972</span>
          <h1>Our Services</h1>
          <p>Complete exterior design, cladding, glazing and renovation solutions for residential and commercial projects.</p>
        </div>
        <div className="services-grid">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article className="service-card" key={service.id || service.name}>
                <div className="service-card-image" style={{ backgroundImage: `url(${service.image})` }} />
                <div className="service-card-content">
                  <Icon aria-hidden="true" />
                  <h2>{service.name}</h2>
                  {service.description && <p className="service-description">{service.description}</p>}
                  <button className="service-book-button" onClick={() => setSelectedService(service)}>
                    Book this service
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {selectedService && (
        <div className="service-modal-backdrop" role="presentation" onClick={() => setSelectedService(null)}>
          <div className="service-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title" onClick={(event) => event.stopPropagation()}>
            <button className="service-modal-close" onClick={() => setSelectedService(null)} aria-label="Close booking form">×</button>
            <span className="eyebrow">Request a consultation</span>
            <h2 id="booking-title">Book {selectedService.name}</h2>
            <p>Choose a convenient time and our team will confirm your request.</p>
            <form className="service-booking-form" onSubmit={submitBooking}>
              <input required name="phone" type="tel" placeholder="Phone number *" defaultValue={userProfile?.phone || ''} />
              <input required name="date" type="date" min={new Date().toISOString().split('T')[0]} />
              <input required name="time" type="time" />
              <textarea name="message" rows="4" placeholder="Tell us about your project" />
              <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit booking request'}</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;
