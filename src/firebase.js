// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Pegá tu configuración acá 👇
const firebaseConfig = {
    apiKey: "AIzaSyBijGxZLfzHIw-HOZl6GQGPW_vdjZcrcLs",
    authDomain: "reserva-depto.firebaseapp.com",
    projectId: "reserva-depto",
    storageBucket: "reserva-depto.firebasestorage.app",
    messagingSenderId: "917899427389",
    appId: "1:917899427389:web:a286e6bbcd6ee64b883454",
    databaseURL: "https://reserva-depto-default-rtdb.firebaseio.com"

};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtén el Auth y Database de Firebase
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };