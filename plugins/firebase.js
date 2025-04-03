import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

export default defineNuxtPlugin((nuxtApp) => {
  const config = {
    apiKey: "AIzaSyDMEjsY9p3C0FxhWNDvAUDjKCNj171UWz8",
    authDomain: "clim-71eb2.firebaseapp.com",
    projectId: "clim-71eb2",
    storageBucket: "clim-71eb2.firebasestorage.app",
    messagingSenderId: "938151441437",
    appId: "1:938151441437:web:3a5f1af9834250d44202f4",
    measurementId: "G-B4YW6J84SL"
  };

  const app = initializeApp(config);
  const firestore = getFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app);

  nuxtApp.provide('firebase', { app, firestore, auth, storage });
}); 