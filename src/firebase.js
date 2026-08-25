import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAEZ1Xl4Io13EF7f3_z2-IUavbQf3oA-P0",
  authDomain: "sami-b1b53.firebaseapp.com",
  projectId: "sami-b1b53",
  storageBucket: "sami-b1b53.firebasestorage.app",
  messagingSenderId: "1018059043047",
  appId: "1:1018059043047:web:951c1582282fb047d73242",
  measurementId: "G-YDJCWPJG7P"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
