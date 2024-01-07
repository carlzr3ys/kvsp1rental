import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCGBlfgjEg-kiOIp_V_TK_vz3xLcs5YmWU",
    authDomain: "kvsp1emart-7ab9b.firebaseapp.com",
    projectId: "kvsp1emart-7ab9b",
    storageBucket: "kvsp1emart-7ab9b.appspot.com",
    messagingSenderId: "299586197465",
    appId: "1:299586197465:web:b7955163a74f8ccedbebc8",
    measurementId: "G-QMYH9KM9YX"
};

export const firebaseApp = initializeApp(firebaseConfig)
export const provider = new GoogleAuthProvider()
export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()