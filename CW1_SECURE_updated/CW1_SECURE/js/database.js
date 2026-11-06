var createdb = indexedDB.open(DB_NAME, DB_VERSION);
var databaseIsReady = false;
var waitingFunctions = [];

// Runs when the database is created or upgraded
createdb.onupgradeneeded = function (event) {

    var database = event.target.result;
    var upgradeTx = event.target.transaction;

    // Admin, doctor and patient stores
    var userStores = ["admins", "doctors", "patients"];

    for (var i = 0; i < userStores.length; i++) {

        var name = userStores[i];
        var store;

        if (database.objectStoreNames.contains(name)) {
            store = upgradeTx.objectStore(name);
        } else {
            store = database.createObjectStore(name, {
                keyPath: "id",
                autoIncrement: true
            });
        }

        // Add any missing search fields
        var fields = stores[name];

        for (var j = 0; j < fields.length; j++) {
            if (!store.indexNames.contains(fields[j])) {
                store.createIndex(fields[j], fields[j]);
            }
        }
    }

    // All other stores (they only need an id)
    var otherStores = ["medicines", "appointments", "alerts", "notes", "patientMeds"];

    for (var k = 0; k < otherStores.length; k++) {

        if (!database.objectStoreNames.contains(otherStores[k])) {
            database.createObjectStore(otherStores[k], {
                keyPath: "id",
                autoIncrement: true
            });
        }
    }

    console.log("Database stores checked and created.");
};


// The database opened successfully
createdb.onsuccess = function (event) {

    db = event.target.result;

    console.log("Database successfully opened!");
    console.log("Available stores:", Array.from(db.objectStoreNames));

    // Close this connection if another page upgrades the database
    db.onversionchange = function () {
        db.close();
        console.log("Database connection closed for an upgrade.");
    };

    //loads data starting with the first store
    loadNextStore(0);
};


// The database could not be opened
createdb.onerror = function () {
    console.log("Error opening database:", createdb.error);
};


// Another open tab is blocking the upgrade
createdb.onblocked = function () {
    console.log("Database upgrade blocked. Close other project tabs and refresh.");
};



function whenReady(callback) {

    if (databaseIsReady) {
        callback();
    } else {
        waitingFunctions.push(callback);
    }
}


// Called when all the starting data has been checked
function finishLoading() {

    console.log("Finished checking starting data.");

    databaseIsReady = true;

    // Run every function that was waiting
    for (var i = 0; i < waitingFunctions.length; i++) {
        waitingFunctions[i]();
    }

    waitingFunctions = [];
}
