import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAKDiyZ7sLobOE7twQDFcEY5zu_fJgtCJY",
    authDomain: "kvsp1rental.firebaseapp.com",
    projectId: "kvsp1rental",
    storageBucket: "kvsp1rental.appspot.com",
    messagingSenderId: "159966366661",
    appId: "1:159966366661:web:becb64433cc20c228d19ac",
    measurementId: "G-7S48DX5XZH"
  };

export const firebaseApp = initializeApp(firebaseConfig)
export const provider = new GoogleAuthProvider()
export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()