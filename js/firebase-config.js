// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY", // Note: Ensure you replace this with your actual key in Firebase Console
    authDomain: "new-luna-app.firebaseapp.com",
    projectId: "new-luna-app",
    storageBucket: "new-luna-app.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_G_ID"
};

// Initialize Firebase as a Singleton to prevent multiple instances errors
if (!firebase.apps.length) {
    try {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase Initialized ✨ (Global Sync)");
    } catch (e) {
        console.error("Firebase Initialization Failed:", e);
    }
}

// Global convenience handles
const db = firebase.firestore();
const auth = firebase.auth();
const realDB = firebase.database(); // In case some real-time DB features are needed

// Shared Constants for Duo Experience
const DUO_PARTNER_ID = "partner_123";
const CHAT_COLLECTION = "chats";
