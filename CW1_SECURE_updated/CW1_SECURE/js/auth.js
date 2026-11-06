//========================signup function=============================

function handleSignup(event) {

    event.preventDefault();

    // Wait until the database is ready, then sign up
    whenReady(signUpNow);
}

function signUpNow() {

    var role = document.getElementById("role").value;
    var storeName = TABLES[role];

    var firstName = document.getElementById("firstName").value.trim();
    var lastName = document.getElementById("lastName").value.trim();
    var email = document.getElementById("email").value.trim().toLowerCase();
    var password = document.getElementById("password").value;
    var consent = document.getElementById("consent").checked;

    // Only patients can create their own account

    if (role != "patient") {
        alert("Only patients can create an account here.");
        return;
    }

    if (!consent) {
        alert("Please agree to the privacy policy.");
        return;
    }

    if (!isValidName(firstName) || !isValidName(lastName)) {
        alert("Names can only contain letters, spaces, hyphens and apostrophes.");
        return;
    }

    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (!isStrongPassword(password)) {
        alert("Password must contain at least 8 characters, including uppercase, lowercase, a number and a symbol.");
        return;
    }

    var newUser = {
        First: sanitizeInput(firstName),
        Last: sanitizeInput(lastName),
        email: email,
        password: encryptData(password),
        consentDate: todayDate()
    };

    findUser(storeName, email, function (existingUser) {

        if (existingUser) {
            alert("An account with this email already exists.");
            return;
        }

        addRecord(storeName, newUser, function () {
            alert("Account created. Please log in.");
            window.location.href = "login.html";
        });
    });
}


// generate a secure password for the user
function generateSecurePswrd() {

    var box = document.getElementById("password");
    if (!box) {
        return;
    }
    box.value = makePassword();
    box.type = "text";

    var eye = document.getElementById("eyeButton");
    if (eye) {
        eye.textContent = "🙈";
    }
}


// Show or hide the password
function togglePassword() {

    var box = document.getElementById("password");
    var eye = document.getElementById("eyeButton");

    if (!box || !eye) {
        return;
    }

    if (box.type == "password") {
        box.type = "text";
        eye.textContent = "hide";
    } else {
        box.type = "password";
        eye.textContent = "👁️";
    }
}

//==================================LOGIN FUNCTION=======================================

function handleLogin(event) {

    event.preventDefault();
    whenReady(logInNow);// Wait until the database is ready, then log in
}

function logInNow() {

    if (isLockedOut()) {
        return;
    }

    var role = document.getElementById("role").value;
    var storeName = TABLES[role];

    var email = document.getElementById("email").value.trim().toLowerCase();
    var password = document.getElementById("password").value;

    if (!storeName) {
        alert("Please select your role.");
        return;
    }

    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    findUser(storeName, email, function (user) {

        // Decrypt the stored password and compare it with what was typed
        if (!user || decryptData(user.password) != password) {
            recordFailedLogin();
            alert("Incorrect email, password or role.");
            return;
        }

        clearFailedLogins();

        var firstName = user.First || user.first_name || "";
        var lastName = user.Last || user.last_name || "";
        var fullName = (firstName + " " + lastName).trim();

        sessionStorage.setItem("currentUser", JSON.stringify({
            id: user.id,
            name: fullName,
            email: user.email,
            role: role
        }));

        // The doctor pages from earlier also read these keys
        sessionStorage.setItem("doctorName", fullName);
        sessionStorage.setItem("doctorEmail", user.email);
        sessionStorage.setItem("userRole", role);

        window.location.href = PAGES[role];
    });
}


//Login lock-out 

function isLockedOut() {

    var lockedUntil = Number(localStorage.getItem("lockedUntil"));

    if (lockedUntil && Date.now() < lockedUntil) {
        var minutes = Math.ceil((lockedUntil - Date.now()) / 60000);
        alert("Too many failed attempts. Try again in " + minutes + " minute(s).");
        return true;
    }

    return false;
}

function recordFailedLogin() {

    var count = Number(localStorage.getItem("failedLogins")) + 1;

    localStorage.setItem("failedLogins", count);

    if (count >= MAX_ATTEMPTS) {
        localStorage.setItem("lockedUntil", Date.now() + LOCK_MINUTES * 60000);
        localStorage.setItem("failedLogins", 0);
    }
}

function clearFailedLogins() {
    localStorage.setItem("failedLogins", 0);
}


document.addEventListener("DOMContentLoaded", function () {

    var signupForm = document.getElementById("signupForm");
    var loginForm = document.getElementById("loginForm");

    if (signupForm) {
        signupForm.addEventListener("submit", handleSignup);
    }

    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }
});
