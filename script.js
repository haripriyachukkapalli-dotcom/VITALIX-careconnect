import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// ===============================
// FIREBASE CONFIG
// ===============================

const firebaseConfig = {
    apiKey: "AIzaSyB9O6g1Ck-2al1Gn5UI8At4d-GmUltYw6s",
    authDomain: "vitalix-careconnect.firebaseapp.com",
    projectId: "vitalix-careconnect",
    storageBucket: "vitalix-careconnect.firebasestorage.app",
    messagingSenderId: "563115345786",
    appId: "1:563115345786:web:d2523ae3e3d95f7bf178c3",
    measurementId: "G-K5QZRVN5K4"
};


// ===============================
// INITIALIZE FIREBASE
// ===============================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ===============================
// OTP VARIABLES
// ===============================

let confirmationResult = null;

let recaptchaVerifier = null;


// ===============================
// SEND OTP
// ===============================

window.sendOTP = async function () {

    const phone = document
        .getElementById("phone")
        .value
        .trim();


    // Check 10-digit mobile number

    if (!/^[0-9]{10}$/.test(phone)) {

        alert("Please enter a valid 10-digit mobile number.");

        return;
    }


    const phoneNumber = "+91" + phone;


    try {

        // Create reCAPTCHA only once

        if (!recaptchaVerifier) {

            recaptchaVerifier = new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                {
                    size: "invisible"
                }
            );
        }


        // Send OTP

        confirmationResult = await signInWithPhoneNumber(
            auth,
            phoneNumber,
            recaptchaVerifier
        );


        // Show OTP box

        document
            .getElementById("otpBox")
            .classList
            .remove("hidden");


        alert("OTP sent successfully to your mobile number.");


    } catch (error) {

        console.error("OTP Error:", error);

        alert(
            "OTP could not be sent. Please check the mobile number and try again."
        );


        // Reset reCAPTCHA

        if (recaptchaVerifier) {

            recaptchaVerifier.clear();

            recaptchaVerifier = null;
        }
    }
};


// ===============================
// VERIFY OTP
// ===============================

window.verifyOTP = async function () {

    const otp = document
        .getElementById("otp")
        .value
        .trim();


    // Check OTP

    if (!otp) {

        alert("Please enter the OTP.");

        return;
    }


    // Check confirmation result

    if (!confirmationResult) {

        alert("Please request OTP first.");

        return;
    }


    try {

        // Verify OTP

        await confirmationResult.confirm(otp);


        alert("Mobile number verified successfully.");


        // Go to patient details page

        window.location.href = "patient-details.html";


    } catch (error) {

        console.error("OTP Verification Error:", error);

        alert("Invalid OTP. Please enter the correct OTP.");
    }
};


// ===============================
// SAVE PATIENT
// ===============================

window.savePatient = async function () {

    const patient = {

        name: document
            .getElementById("name")
            .value
            .trim(),

        age: document
            .getElementById("age")
            .value,

        gender: document
            .getElementById("gender")
            .value,

        city: document
            .getElementById("city")
            .value
            .trim(),

        concern: document
            .getElementById("concern")
            .value
            .trim()
    };


    // ===============================
    // BASIC VALIDATION
    // ===============================

    if (
        !patient.name ||
        !patient.age ||
        !patient.city
    ) {

        alert("Please fill name, age and city.");

        return;
    }


    // ===============================
    // CURRENT FIREBASE USER
    // ===============================

    const user = auth.currentUser;


    if (!user) {

        alert("Please verify your mobile number first.");

        return;
    }


    try {

        // ===============================
        // SAVE PATIENT TO FIRESTORE
        // ===============================

        await setDoc(
            doc(db, "patients", user.uid),
            {
                ...patient,

                phone: user.phoneNumber,

                createdAt: new Date().toISOString()
            }
        );


        alert("Patient details saved successfully.");


        // Go to dashboard

        window.location.href = "dashboard.html";


    } catch (error) {

        console.error("Firestore Error:", error);

        alert("Unable to save patient details.");
    }
};
