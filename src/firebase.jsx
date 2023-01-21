import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCRfHLVxyHLr45C9Aovw7gvdf1qUE9DZtg",
    authDomain: "zumpix-7730e.firebaseapp.com",
    projectId: "zumpix-7730e",
    storageBucket: "zumpix-7730e.appspot.com",
    messagingSenderId: "3145404927",
    appId: "1:3145404927:web:bac47e0ac722b625ff97ca",
    measurementId: "G-FD39VT0F4Q"
};

export const firebaseApp = initializeApp(firebaseConfig)
export const provider = new GoogleAuthProvider()
export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()