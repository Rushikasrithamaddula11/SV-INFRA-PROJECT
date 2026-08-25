import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

/**
 * Create default admin user
 * Run this once to set up your admin account
 */
export const createAdminUser = async () => {
  const adminEmail = 'admin@tuheswamy.com';
  const adminPassword = 'Admin@123456';
  
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      adminEmail,
      adminPassword
    );
    
    const user = userCredential.user;
    
    // Create user profile in Firestore with admin role
    await setDoc(doc(db, 'users', user.uid), {
      email: adminEmail,
      name: 'Admin User',
      role: 'admin',
      phone: '+91 9876543210',
      createdAt: new Date().toISOString(),
      favorites: []
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('You can now login at /admin/login');
    
    return { success: true, email: adminEmail };
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('⚠️ Admin user already exists');
      return { success: false, message: 'Admin already exists' };
    }
    console.error('❌ Error creating admin:', error);
    throw error;
  }
};

// For manual execution in browser console
if (typeof window !== 'undefined') {
  window.createAdminUser = createAdminUser;
}
