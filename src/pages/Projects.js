import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import './Projects.css';

const projects = [
  {
    name: 'MyCure Hospitals', location: 'Maharanipeta', district: 'Visakhapatnam',
    address: 'Gokhale Road, near Jagadamba Junction, Maharanipeta',
    description: 'SV Infra Projects 972 completed façade and architectural finishing works for the MyCure Hospitals building, a multispecialty healthcare facility serving Andhra Pradesh and Telangana.',
    image: 'https://i.ytimg.com/vi/2zq3N3OYQa0/maxresdefault.jpg'
  },
  {
    name: 'Value Zone Hyper Mart', location: 'Storefront location', district: 'Not specified',
    address: 'Exact street address to be added',
    description: 'Façade and storefront finishing works for Value Zone Hyper Mart, a large-format retail destination with grocery, household, lifestyle, and promotional retail sections.',
    image: 'https://tse3.mm.bing.net/th/id/OIP.Zue7DQBNN6qWP0JDkvKFZQHaEK?r=0&pid=Api&P=0&h=180'
  },
  {
    name: 'Intell Engineering College', location: 'Akkampalli Cross, Kalyandurg Road', district: 'Anantapur',
    address: 'Akkampalli Cross, Kalyandurg Road, PIN 515004',
    description: 'Architectural façade work for the Intell Engineering College entrance building at Akkampalli Cross on Kalyandurg Road, Anantapur District.',
    image: 'https://tse3.mm.bing.net/th/id/OIP.81SUjGvcyCNfyVXiyBzAIgHaFj?r=0&pid=Api&P=0&h=180'
  },
  {
    name: 'Keshav Grand Hotel & Banquet', location: 'Mahaveer Colony, Kalluru', district: 'Kurnool',
    address: 'Near NH 44, Mahaveer Colony, Kalluru, PIN 518003',
    description: 'Façade and architectural finishing works for Keshav Grand Hotel & Banquet, a hospitality and convention venue with deluxe rooms, banquet halls, and event spaces near NH 44.',
    image: 'https://tse3.mm.bing.net/th/id/OIP.-vUQnUgN2IvM2lyUFKsrtQHaE8?r=0&pid=Api&P=0&h=180'
  },
  {
    name: 'LML World - PV Chowdary Motors', location: 'Dealership facility', district: 'Anantapur',
    address: 'Exact street address to be added',
    description: 'Commercial dealership façade for P V Chowdary Motors, an authorized LML World 3S facility handling sales, services, and spares.',
    image: 'https://tse1.mm.bing.net/th/id/OIP.CBVUmWCwWUYys4Cy2pE4xgHaFh?r=0&pid=Api&P=0&h=180'
  },
  {
    name: 'Lodge Building Facade', location: 'Lodge property', district: 'Not specified',
    address: 'Exact street address to be added',
    description: 'Façade and exterior finishing works for a lodge building, balancing a welcoming hospitality frontage with durable materials and clean architectural detailing.',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85'
  }
];

const Projects = () => (
  <section className="projects-page">
    <div className="projects-hero">
      <div className="container">
        <span className="sv-kicker">SV INFRA PROJECTS 972</span>
        <h1>Commercial Projects</h1>
        <p>Selected façade, glazing and architectural finishing work delivered across Andhra Pradesh.</p>
      </div>
    </div>
    <div className="container projects-list">
      {projects.map((project, index) => (
        <article className="project-card" key={project.name}>
          <div className="project-image" style={{ backgroundImage: `url(${project.image})` }}>
            <span>Commercial Projects</span>
          </div>
          <div className="project-body">
            <span className="project-number">0{index + 1}</span>
            <h2>{project.name}</h2>
            <p className="project-location"><FaMapMarkerAlt aria-hidden="true" /> {project.location}</p>
            <p className="project-description">{project.description}</p>
            <div className="project-meta">
              <div><b>District</b><span>{project.district}</span></div>
              <div><b>State</b><span>Andhra Pradesh</span></div>
              <div className="project-address"><b>Address</b><span>{project.address}</span></div>
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default Projects;
