import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebase';

export const SEED_PROPERTIES = [
  {
    name: 'Amaranta Villas',
    type: 'Villa',
    location: 'Kokapet',
    city: 'Hyderabad',
    price: 28500000,
    priceLabel: '₹2.85 Cr onwards',
    size: 3200,
    bedrooms: 4,
    status: 'Available',
    featured: true,
    description: "Four-bedroom garden villas set around a private courtyard, built for families who want privacy without leaving the city behind. Double-height living rooms open onto a covered verandah on both floors.",
    amenities: ['24x7 Security', 'Clubhouse', 'Swimming Pool', 'Landscaped Gardens', 'Covered Parking', 'Gymnasium'],
    nearby: ['International School — 2.1 km', 'Multi-specialty Hospital — 3.6 km', 'IT Business Park — 4.8 km', 'Metro Station — 5.2 km'],
    developer: 'Amaranta Developers',
    images: [
      'https://via.placeholder.com/900x650/d4a574/ffffff?text=Amaranta+Villas',
      'https://via.placeholder.com/900x650/c9945f/ffffff?text=Amaranta+Villas+2',
      'https://via.placeholder.com/900x650/b8834a/ffffff?text=Amaranta+Villas+3'
    ],
    createdAt: '2026-02-11T00:00:00.000Z'
  },
  {
    name: 'The Sett — Loft Residences',
    type: 'Apartment',
    location: 'Gachibowli',
    city: 'Hyderabad',
    price: 9800000,
    priceLabel: '₹98 L onwards',
    size: 1450,
    bedrooms: 3,
    status: 'Available',
    featured: true,
    description: "Loft-style 3BHK apartments with exposed structural beams and full-height glazing, designed for professionals who work from home as often as they commute.",
    amenities: ['24x7 Security', 'Gymnasium', 'Power Backup', 'Covered Parking', 'EV Charging Point', 'Community Hall'],
    nearby: ['IT Business Park — 1.5 km', 'Metro Station — 2.0 km', 'Shopping Mall — 2.8 km', 'International School — 3.4 km'],
    developer: 'Sett Urban Developers',
    images: [
      'https://via.placeholder.com/900x650/d4a574/ffffff?text=The+Sett+Apartments',
      'https://via.placeholder.com/900x650/c9945f/ffffff?text=The+Sett+2',
      'https://via.placeholder.com/900x650/b8834a/ffffff?text=The+Sett+3'
    ],
    createdAt: '2026-03-02T00:00:00.000Z'
  },
  {
    name: 'Kolam Plots — Phase II',
    type: 'Plot',
    location: 'Shamshabad',
    city: 'Hyderabad',
    price: 6200000,
    priceLabel: '₹62 L onwards',
    size: 2400,
    bedrooms: null,
    status: 'Available',
    featured: false,
    description: "HMDA-approved residential plots on a gated, tree-lined layout close to the airport corridor — a straightforward site to build the house you actually want.",
    amenities: ['24x7 Security', 'Landscaped Gardens', 'Rainwater Harvesting', 'Jogging Track'],
    nearby: ['International Airport — 9 km', 'Multi-specialty Hospital — 6.2 km', 'International School — 5 km'],
    developer: 'Kolam Land Ventures',
    images: [
      'https://via.placeholder.com/900x650/d4a574/ffffff?text=Kolam+Plots',
      'https://via.placeholder.com/900x650/c9945f/ffffff?text=Kolam+Plots+2',
      'https://via.placeholder.com/900x650/b8834a/ffffff?text=Kolam+Plots+3'
    ],
    createdAt: '2026-01-20T00:00:00.000Z'
  },
  {
    name: 'Sundown Court Apartments',
    type: 'Apartment',
    location: 'Whitefield',
    city: 'Bengaluru',
    price: 14500000,
    priceLabel: '₹1.45 Cr onwards',
    size: 1780,
    bedrooms: 3,
    status: 'Reserved',
    featured: false,
    description: "A quiet mid-rise development set back from the main road, with cross-ventilated 3BHK units and a rooftop deck looking west over the neighbourhood.",
    amenities: ['24x7 Security', 'Swimming Pool', 'Gymnasium', "Children's Play Area", 'Covered Parking'],
    nearby: ['IT Business Park — 3.1 km', 'Metro Station — 4.0 km', 'Shopping Mall — 1.9 km'],
    developer: 'Sundown Habitat',
    images: [
      'https://via.placeholder.com/900x650/d4a574/ffffff?text=Sundown+Court',
      'https://via.placeholder.com/900x650/c9945f/ffffff?text=Sundown+Court+2',
      'https://via.placeholder.com/900x650/b8834a/ffffff?text=Sundown+Court+3'
    ],
    createdAt: '2025-12-14T00:00:00.000Z'
  },
  {
    name: 'Copper & Teak Bungalows',
    type: 'Villa',
    location: 'Sarjapur',
    city: 'Bengaluru',
    price: 41000000,
    priceLabel: '₹4.1 Cr onwards',
    size: 4100,
    bedrooms: 5,
    status: 'Available',
    featured: true,
    description: "Five-bedroom independent bungalows finished in oxidised copper and teak, each with a private plunge pool and a home office wing separated from the main house.",
    amenities: ['24x7 Security', 'Clubhouse', 'Swimming Pool', 'Landscaped Gardens', 'Gymnasium', 'EV Charging Point'],
    nearby: ['International School — 3.8 km', 'IT Business Park — 6.5 km', 'Multi-specialty Hospital — 5.1 km'],
    developer: 'Copper & Teak Estates',
    images: [
      'https://via.placeholder.com/900x650/d4a574/ffffff?text=Copper+%26+Teak+Bungalows',
      'https://via.placeholder.com/900x650/c9945f/ffffff?text=Copper+%26+Teak+2',
      'https://via.placeholder.com/900x650/b8834a/ffffff?text=Copper+%26+Teak+3'
    ],
    createdAt: '2026-04-06T00:00:00.000Z'
  },
  {
    name: 'Northgate Business Plots',
    type: 'Plot',
    location: 'Kompally',
    city: 'Hyderabad',
    price: 5400000,
    priceLabel: '₹54 L onwards',
    size: 1800,
    bedrooms: null,
    status: 'Sold',
    featured: false,
    description: "Compact residential plots along the Northgate ring-road corridor, fully sold out in this launch phase. Registrations for Phase III open later this year.",
    amenities: ['24x7 Security', 'Rainwater Harvesting', 'Community Hall'],
    nearby: ['Shopping Mall — 4.3 km', 'Multi-specialty Hospital — 5.5 km'],
    developer: 'Northgate Realty',
    images: [
      'https://via.placeholder.com/900x650/d4a574/ffffff?text=Northgate+Plots',
      'https://via.placeholder.com/900x650/c9945f/ffffff?text=Northgate+Plots+2',
      'https://via.placeholder.com/900x650/b8834a/ffffff?text=Northgate+Plots+3'
    ],
    createdAt: '2025-10-02T00:00:00.000Z'
  },
  {
    name: 'The Grove at Whitefield',
    type: 'Project',
    location: 'Whitefield',
    city: 'Bengaluru',
    price: 12000000,
    priceLabel: '₹1.2 Cr onwards',
    size: 1650,
    bedrooms: 3,
    status: 'Available',
    featured: false,
    description: "A landscaped, low-density project of 2 and 3BHK apartments arranged around a central grove of rain trees, with clubhouse, pool and co-working lounge.",
    amenities: ['24x7 Security', 'Clubhouse', 'Swimming Pool', 'Landscaped Gardens', 'Gymnasium', 'Jogging Track', 'EV Charging Point'],
    nearby: ['IT Business Park — 2.4 km', 'International School — 3.0 km', 'Metro Station — 3.6 km'],
    developer: 'Grove Living Projects',
    images: [
      'https://via.placeholder.com/900x650/d4a574/ffffff?text=The+Grove',
      'https://via.placeholder.com/900x650/c9945f/ffffff?text=The+Grove+2',
      'https://via.placeholder.com/900x650/b8834a/ffffff?text=The+Grove+3'
    ],
    createdAt: '2026-05-19T00:00:00.000Z'
  },
  {
    name: 'Marigold Court',
    type: 'Apartment',
    location: 'Miyapur',
    city: 'Hyderabad',
    price: 7200000,
    priceLabel: '₹72 L onwards',
    size: 1320,
    bedrooms: 2,
    status: 'Available',
    featured: false,
    description: "Well-priced 2BHK apartments close to the metro, aimed at first-time buyers who want a functional layout over a showpiece lobby.",
    amenities: ['24x7 Security', 'Power Backup', 'Covered Parking', "Children's Play Area"],
    nearby: ['Metro Station — 0.8 km', 'Shopping Mall — 2.1 km', 'Multi-specialty Hospital — 3.2 km'],
    developer: 'Marigold Homes',
    images: [
      'https://via.placeholder.com/900x650/d4a574/ffffff?text=Marigold+Court',
      'https://via.placeholder.com/900x650/c9945f/ffffff?text=Marigold+Court+2',
      'https://via.placeholder.com/900x650/b8834a/ffffff?text=Marigold+Court+3'
    ],
    createdAt: '2026-01-08T00:00:00.000Z'
  },
  {
    name: 'Palmyra Estate',
    type: 'Villa',
    location: 'Assagao',
    city: 'Goa',
    price: 35000000,
    priceLabel: '₹3.5 Cr onwards',
    size: 3600,
    bedrooms: 4,
    status: 'Available',
    featured: true,
    description: "Laterite-and-timber villas tucked into a palm estate ten minutes from Assagao village, designed as either a family retreat or a managed rental property.",
    amenities: ['24x7 Security', 'Swimming Pool', 'Landscaped Gardens', 'Power Backup', 'Covered Parking'],
    nearby: ['International Airport — 34 km', 'Multi-specialty Hospital — 8 km', 'Shopping Mall — 6 km'],
    developer: 'Palmyra Land Co.',
    images: [
      'https://via.placeholder.com/900x650/d4a574/ffffff?text=Palmyra+Estate',
      'https://via.placeholder.com/900x650/c9945f/ffffff?text=Palmyra+Estate+2',
      'https://via.placeholder.com/900x650/b8834a/ffffff?text=Palmyra+Estate+3'
    ],
    createdAt: '2026-03-27T00:00:00.000Z'
  },
  {
    name: 'Silverleaf Residences',
    type: 'Apartment',
    location: 'Kondapur',
    city: 'Hyderabad',
    price: 11200000,
    priceLabel: '₹1.12 Cr onwards',
    size: 1590,
    bedrooms: 3,
    status: 'Reserved',
    featured: false,
    description: "A compact 3BHK development in the heart of Kondapur, close enough to walk to most of what the neighbourhood has to offer.",
    amenities: ['24x7 Security', 'Gymnasium', 'Power Backup', 'Covered Parking', 'Community Hall'],
    nearby: ['Shopping Mall — 1.2 km', 'Metro Station — 2.6 km', 'International School — 2.9 km'],
    developer: 'Silverleaf Developers',
    images: [
      'https://via.placeholder.com/900x650/d4a574/ffffff?text=Silverleaf+Residences',
      'https://via.placeholder.com/900x650/c9945f/ffffff?text=Silverleaf+2',
      'https://via.placeholder.com/900x650/b8834a/ffffff?text=Silverleaf+3'
    ],
    createdAt: '2025-11-29T00:00:00.000Z'
  }
];

export const seedProperties = async () => {
  console.log('🌱 Seeding properties...');
  
  try {
    for (const property of SEED_PROPERTIES) {
      await addDoc(collection(db, 'properties'), property);
      console.log(`✅ Added: ${property.name}`);
    }
    console.log('✅ Properties seeded successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error seeding properties:', error);
    return false;
  }
};

export const createAdminUser = async (email, password, name) => {
  console.log('👤 Creating admin user...');
  
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user profile with admin role
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name,
      email,
      phone: '+91 40 2345 6789',
      role: 'admin',
      createdAt: new Date().toISOString(),
    });
    
    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    return true;
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    return false;
  }
};

// Function to run all seeds
export const runAllSeeds = async () => {
  console.log('🚀 Starting data seeding...\n');
  
  const propertiesSeeded = await seedProperties();
  
  console.log('\n📊 Seeding Summary:');
  console.log(`Properties: ${propertiesSeeded ? '✅' : '❌'}`);
  console.log('\n⚠️  To create an admin user, run:');
  console.log('createAdminUser("admin@verandahestates.com", "admin123", "Admin User")');
  console.log('\nfrom the browser console or use the seed script.');
};

// Make functions available in browser console
if (typeof window !== 'undefined') {
  window.seedProperties = seedProperties;
  window.createAdminUser = createAdminUser;
  window.runAllSeeds = runAllSeeds;
}
            































