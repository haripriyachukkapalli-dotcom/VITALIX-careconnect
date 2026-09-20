
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyB9O6g1Ck-2al1Gn5UI8At4d-GmUltYw6s",
    authDomain: "vitalix-careconnect.firebaseapp.com",
    projectId: "vitalix-careconnect",
    storageBucket: "vitalix-careconnect.firebasestorage.app",
    messagingSenderId: "563115345786",
    appId: "1:563115345786:web:d2523ae3e3d95f7bf178c3",
    measurementId: "G-K5QZRVN5K4"
};

initializeApp(firebaseConfig);


// Demo OTP
const TEST_OTP = "123456";


// Temporary login data
let userEmail = "";
let userPhone = "";


// =================================
// CONTINUE / SEND TEST OTP
// =================================

window.sendOTP = function () {

    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    // Gmail validation
    if (!email.endsWith("@gmail.com")) {
        alert("Please enter a valid Gmail address.");
        return;
    }

    // Phone validation
    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    userEmail = email;
    userPhone = phone;

    // Save login information
    localStorage.setItem("vitalixEmail", userEmail);
    localStorage.setItem("vitalixPhone", userPhone);

    // Show OTP box
    document.getElementById("otpBox").classList.remove("hidden");

    alert("Your test OTP is: 123456");
};


// =================================
// VERIFY OTP
// =================================

window.verifyOTP = function () {

    const otp = document.getElementById("otp").value.trim();

    if (otp !== TEST_OTP) {
        alert("Invalid OTP. Please enter 123456.");
        return;
    }

    // Login successful
    localStorage.setItem("vitalixLoggedIn", "true");

    alert("OTP verified successfully!");

    // Go to patient details
    window.location.href = "patient-details.html";
};
