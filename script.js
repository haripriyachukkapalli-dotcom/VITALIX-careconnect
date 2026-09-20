import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyB9O6g1Ck-2al1Gn5UI8At4d-GmUltYw6s",
    authDomain: "vitalix-careconnect.firebaseapp.com",
    projectId: "vitalix-careconnect",
    storageBucket: "vitalix-careconnect.firebasestorage.app",
    messagingSenderId: "563115345786",
    appId: "1:563115345786:web:d2523ae3e3d95f7bf178c3",
    measurementId: "G-K5QZRVN5K4"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


// Test OTP
const TEST_OTP = "123456";

let userEmail = "";
let userPhone = "";


// ===============================
// SEND OTP
// ===============================

window.sendOTP = function () {

    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    // Check Gmail
    if (!email.endsWith("@gmail.com")) {
        alert("Please enter a valid Gmail address.");
        return;
    }

    // Check phone
    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    userEmail = email;
    userPhone = phone;

    // Show OTP box
    document.getElementById("otpBox").classList.remove("hidden");

    alert("Test OTP generated successfully.\n\nYour OTP is: 123456");
};


// ===============================
// VERIFY OTP
// ===============================

window.verifyOTP = async function () {

    const otp = document.getElementById("otp").value.trim();

    if (otp !== TEST_OTP) {
        alert("Invalid OTP. Please enter 123456.");
        return;
    }

    try {

        // Save login information
        localStorage.setItem("vitalixEmail", userEmail);
        localStorage.setItem("vitalixPhone", userPhone);

        // Save patient login data to Firestore
        const patientId = userPhone;

        await setDoc(
            doc(db, "patients", patientId),
            {
                email: userEmail,
                phone: userPhone,
                loginType: "Gmail + Phone",
                createdAt: new Date().toISOString()
            },
            { merge: true }
        );

        alert("OTP verified successfully!");

        // Go to patient details
        window.location.href = "patient-details.html";

    } catch (error) {

        console.error("Login Error:", error);

        alert(
            "Login verified, but patient data could not be saved."
        );
    }
};
