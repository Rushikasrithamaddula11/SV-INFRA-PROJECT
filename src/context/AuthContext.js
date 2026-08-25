import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Local admin fallback (used before Firebase Auth is provisioned)
    const localAdmin = sessionStorage.getItem('tsp_local_admin');
    if (localAdmin) {
      try {
        const admin = JSON.parse(localAdmin);
        setCurrentUser({ uid: 'local-admin', email: admin.email });
        setUserProfile({ id: 'local-admin', ...admin });
        setLoading(false);
        return;
      } catch {
        sessionStorage.removeItem('tsp_local_admin');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile({ id: user.uid, ...userDoc.data() });
          }
        } catch (err) {
          console.error('Error loading user profile:', err);
          // Fallback profile so auth-dependent UI still works
          setUserProfile({ id: user.uid, name: user.email?.split('@')[0], email: user.email });
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    isAdmin: userProfile?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
