// Firebase configuration for Phone Authentication
// Configuration from otp3.html - OTP Verification Project
const firebaseConfig = {
    apiKey: "AIzaSyC3vJJ6tkHdyHeiJfnQ4_mpxKNfnxkOqsY",
    authDomain: "otp-verification-42b2c.firebaseapp.com",
    projectId: "otp-verification-42b2c",
    storageBucket: "otp-verification-42b2c.firebasestorage.app",
    messagingSenderId: "856421608135",
    appId: "1:856421608135:web:5d10b52b5a98ea811d2ce2",
    measurementId: "G-YK31ZKVNTF",
    // Database URL - Check your Firebase Console > Project Settings > General to confirm
    databaseURL: "https://otp-verification-42b2c-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = firebase.auth();

// Enable phone authentication
auth.useDeviceLanguage();

// Configure phone authentication settings
auth.settings.appVerificationDisabledForTesting = false; // Set to true only for testing

console.log('Firebase initialized successfully for OTP verification');
console.log('Project ID:', firebaseConfig.projectId);
console.log('Auth Domain:', firebaseConfig.authDomain);
