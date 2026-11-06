// Make text safe to show on a page
function sanitizeInput(input) {

    return String(input)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");
}


function isValidEmail(email) {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(email);
}


function isValidName(name) {
    return /^[A-Za-zÀ-ɏ][A-Za-zÀ-ɏ' -]{0,49}$/.test(name);
}


function isStrongPassword(password) {

    return password.length >= 8 &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password);
}

// NHS number
function isValidNHS(nhs) {
    return /^[0-9]{10}$/.test(nhs);
}

//phone number
function isValidPhone(phone) {
    return /^[0-9+ ()-]{7,20}$/.test(phone);
}

// Date of birth 
function isValidDOB(dob) {
    if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(dob)) {
        return false;
    }
    var date = new Date(dob);
    return !isNaN(date.getTime()) && dob <= todayDate();
}