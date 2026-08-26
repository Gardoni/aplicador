// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyCLaqaOCJnkfG4LID1Y5RoFpgEsX9nYGOM",
  authDomain: "testeapi-1ad07.firebaseapp.com",
  projectId: "testeapi-1ad07",
  storageBucket: "testeapi-1ad07.firebasestorage.app",
  messagingSenderId: "323295128076",
  appId: "1:323295128076:web:3af167424f75b680f19c29"
};
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const ADMIN_USER = "gardoni";
export const ADMIN_PASS = "Rga@193319";