// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDmslr6DLnWItY-DD6fZnoGHNObLlGPRaw", // Keeping the valid keys but switching project context
    authDomain: "new-luna-app.firebaseapp.com",
    projectId: "new-luna-app",
    storageBucket: "new-luna-app.appspot.com",
    messagingSenderId: "564275833987",
    appId: "1:564275833987:web:91ce2f54d11b4e1f70bfb6",
    measurementId: "G-0R1ZR598M9"
};

// Initialize Firebase as a Singleton to prevent multiple instances errors
if (!firebase.apps.length) {
    try {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase Initialized ❋ (Global Sync)");
    } catch (e) {
        console.error("Firebase Initialization Failed:", e);
    }
}

// Global convenience handles
const db = firebase.firestore();
const auth = firebase.auth();
// const realDB = firebase.database(); // Commented out to prevent TypeError as DB SDK is not included

// Shared Constants for Duo Experience
const DUO_PARTNER_ID = "partner_123";
const CHAT_COLLECTION = "chats";
