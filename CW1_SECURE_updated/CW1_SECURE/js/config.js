// The open database (database.js fills this in)
var db;

// Add 1 to DB_VERSION every time you change stores or indexes
var DB_NAME = "medicareSecureDB";
var DB_VERSION = 1;

// AES passphrase
var encryptionKey = "IloveSecureWebandItsPrettyFunTodoThisCW2026";

// JSON files
var DATA_URLS = {
    admins: "https://jsethi-mdx.github.io/cst2572.github.io/admin.json",
    doctors: "https://jsethi-mdx.github.io/cst2572.github.io/doctors.json",
    patients: "https://jsethi-mdx.github.io/cst2572.github.io/patients.json",
    medicines: "https://jsethi-mdx.github.io/cst2572.github.io/medicines.json"
};

// Stores that are filled from the JSON files
var DATA_STORES = ["admins", "doctors", "patients", "medicines"];

// Searchable fields
var stores = {
    doctors: ["first_name", "last_name", "email"],
    patients: ["First", "Last", "NHS", "email"],
    admins: ["first_name", "last_name", "email"]
};

// Fields that are AES-encrypted
var ENCRYPTED_FIELDS = {
    patients: ["Telephone", "Address", "DOB", "Allergies"],
    doctors: ["Telephone", "Address"],
    notes: ["text"],
    patientMeds: ["dosage", "frequency"]
};

// Database store for each role
var TABLES = { admin: "admins", doctor: "doctors", patient: "patients" };

// Page to open after login
var PAGES = {
    admin: "../admin/admin_dashboard.html",
    doctor: "../doctor/doctor_dashboard.html",
    patient: "../patient/patient_dashboard.html"
};

var LOGIN_PAGE = "../login/login.html";

// Login lock-out settings
var MAX_ATTEMPTS = 5;
var LOCK_MINUTES = 5;