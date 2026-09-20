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
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


// ===============================
// OTP VARIABLES
// ===============================

let confirmationResult = null;


// ===============================
// SEND OTP
// ===============================

window.sendOTP = async function () {

    const phone = document
        .getElementById("phone")
        .value
        .trim();

    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    const phoneNumber = "+91" + phone;

    try {

        // Create reCAPTCHA only once
        if (!window.recaptchaVerifier) {

            window.recaptchaVerifier = new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                {
                    size: "invisible"
                }
            );
        }

        confirmationResult = await signInWithPhoneNumber(
            auth,
            phoneNumber,
            window.recaptchaVerifier
        );

        document
            .getElementById("otpBox")
            .classList.remove("hidden");

        alert("OTP sent successfully to your mobile number.");

    } catch (error) {

        console.error(error);

        alert(
            "OTP could not be sent. Please check the mobile number and try again."
        );

        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
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

    if (!otp) {
        alert("Please enter the OTP.");
        return;
    }

    if (!confirmationResult) {
        alert("Please request OTP first.");
        return;
    }

    try {

        await confirmationResult.confirm(otp);

        alert("Mobile number verified successfully.");

        window.location.href = "patient-details.html";

    } catch (error) {

        console.error(error);

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


    // Basic validation

    if (
        !patient.name ||
        !patient.age ||
        !patient.city
    ) {

        alert("Please fill name, age and city.");
        return;
    }


    // Current authenticated Firebase user

    const user = auth.currentUser;

    if (!user) {

        alert("Please verify your mobile number first.");
        return;
    }


    try {

        // Save patient to Firestore

        await setDoc(
            doc(db, "patients", user.uid),
            {
                ...patient,
                phone: user.phoneNumber,
                createdAt: new Date().toISOString()
            }
        );

        alert("Patient details saved successfully.");

        window.location.href = "dashboard.html";

    } catch (error) {

        console.error(error);

        alert("Unable to save patient details.");

    }
};
