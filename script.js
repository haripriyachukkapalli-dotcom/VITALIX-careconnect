// ==========================================
// VITALIX CareConnect - Main JavaScript
// ==========================================


// Demo OTP
const DEMO_OTP = "123456";


// ==========================================
// LOGIN - SEND OTP
// ==========================================

function sendOTP() {

    const email = document.getElementById("email");
    const phone = document.getElementById("phone");

    if (!email || !phone) {
        return;
    }

    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();

    // Gmail validation
    if (!emailValue.endsWith("@gmail.com")) {

        alert("Please enter a valid Gmail address.");

        return;
    }


    // Phone validation
    if (!/^[0-9]{10}$/.test(phoneValue)) {

        alert("Please enter a valid 10-digit phone number.");

        return;
    }


    // Save login information
    localStorage.setItem("vitalixEmail", emailValue);
    localStorage.setItem("vitalixPhone", phoneValue);


    // Demo OTP
    alert("Your VITALIX demo OTP is: 123456");


    const otpInput = document.getElementById("otp");

    if (otpInput) {

        otpInput.focus();

    }

}


// ==========================================
// LOGIN - VERIFY OTP
// ==========================================

function verifyOTP() {

    const otpInput = document.getElementById("otp");

    if (!otpInput) {
        return;
    }

    const enteredOTP = otpInput.value.trim();


    if (enteredOTP === DEMO_OTP) {

        alert("OTP verified successfully!");


        // Save login status
        localStorage.setItem(
            "vitalixLoggedIn",
            "true"
        );


        // Go to patient details
        window.location.href = "patient-details.html";

    } else {

        alert("Incorrect OTP. Please enter the correct OTP.");

    }

}


// ==========================================
// PATIENT DETAILS
// ==========================================

const patientForm =
    document.getElementById("patientForm");


if (patientForm) {

    patientForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const fullName =
                document.getElementById("fullName").value.trim();

            const dob =
                document.getElementById("dob").value;

            const gender =
                document.getElementById("gender").value;

            const bloodGroup =
                document.getElementById("bloodGroup").value;

            const city =
                document.getElementById("city").value.trim();

            const emergencyContact =
                document
                    .getElementById("emergencyContact")
                    .value.trim();


            // Basic validation
            if (
                !fullName ||
                !dob ||
                !gender ||
                !bloodGroup ||
                !city ||
                !/^[0-9]{10}$/.test(emergencyContact)
            ) {

                alert(
                    "Please enter all details correctly."
                );

                return;
            }


            // Save patient information
            const patientData = {

                fullName: fullName,

                dob: dob,

                gender: gender,

                bloodGroup: bloodGroup,

                city: city,

                emergencyContact: emergencyContact

            };


            localStorage.setItem(
                "vitalixPatient",
                JSON.stringify(patientData)
            );


            alert(
                "Patient details saved successfully!"
            );


            // Open dashboard
            window.location.href =
                "dashboard.html";

        }
    );

}


// ==========================================
// DASHBOARD - DISPLAY PATIENT NAME
// ==========================================

const patientNameElement =
    document.getElementById("patientName");


if (patientNameElement) {

    const savedPatient =
        localStorage.getItem("vitalixPatient");


    if (savedPatient) {

        const patientData =
            JSON.parse(savedPatient);


        patientNameElement.textContent =
            patientData.fullName;

    }

}


// ==========================================
// DASHBOARD - SERVICE BUTTONS
// ==========================================

function showMessage(serviceName) {

    alert(
        serviceName +
        " section will be available soon."
    );

}


// ==========================================
// LOGOUT
// ==========================================

function logoutUser() {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    if (confirmLogout) {

        localStorage.removeItem(
            "vitalixLoggedIn"
        );

        localStorage.removeItem(
            "vitalixEmail"
        );

        localStorage.removeItem(
            "vitalixPhone"
        );

        localStorage.removeItem(
            "vitalixPatient"
        );


        window.location.href =
            "index.html";

    }

}


// ==========================================
// AUTO LOGIN CHECK
// ==========================================

function checkLogin() {

    const loggedIn =
        localStorage.getItem("vitalixLoggedIn");


    const currentPage =
        window.location.pathname;


    if (
        currentPage.includes("dashboard.html") &&
        loggedIn !== "true"
    ) {

        window.location.href =
            "login.html";

    }

}


// Run login check
checkLogin();
