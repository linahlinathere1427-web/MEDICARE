// Check one store If it is empty, fill it Then move to the next store.
function loadNextStore(number) {

    // No more stores left
    if (number >= DATA_STORES.length) {
        finishLoading();
        return;
    }

    var storeName = DATA_STORES[number];

    var request = db.transaction(storeName)
        .objectStore(storeName)
        .count();

    request.onsuccess = function () {

        if (request.result > 0) {
            // Already has data, so skip it
            console.log(storeName + " already contains data.");
            loadNextStore(number + 1);
        } else {
            downloadStore(storeName, number);
        }
    };

    request.onerror = function () {
        console.log("Could not count " + storeName);
        loadNextStore(number + 1);
    };
}


// Download the JSON file for a store and save it
function downloadStore(storeName, number) {

    console.log("Loading " + storeName + "...");

    fetch(DATA_URLS[storeName])
        .then(function (response) {

            if (!response.ok) {
                throw new Error("Could not download " + storeName);
            }

            return response.json();
        })
        .then(function (list) {

            // After saving, move on to the next store
            var goNext = function () {
                loadNextStore(number + 1);
            };

            if (storeName == "medicines") {
                saveMedicines(list, goNext);
            } else {
                saveUsers(storeName, list, goNext);
            }
        })
        .catch(function (error) {
            console.log("Error loading " + storeName + ":", error);
            loadNextStore(number + 1);
        });
}


// Save the medicines
function saveMedicines(list, callback) {

    var tx = db.transaction("medicines", "readwrite");
    var store = tx.objectStore("medicines");

    for (var i = 0; i < list.length; i++) {
        store.put(list[i]);
    }

    tx.oncomplete = function () {
        console.log("Medicine data inserted.");
        callback();
    };
}


// Save the users, create a password for each one, and show the passwords
function saveUsers(storeName, list, callback) {

    var users = [];
    var message = "PASSWORDS FOR " + storeName.toUpperCase() + "\n";
    message += "Write them down. They will NOT be shown again.\n\n";

    for (var i = 0; i < list.length; i++) {

        // Copy the record from the JSON file
        var user = {};

        for (var key in list[i]) {
            user[key] = list[i][key];
        }

        // Make the email lowercase
        var email = (user.email || user.Email || "").trim().toLowerCase();

        if (email == "") {
            console.log("Skipped user without an email.");
            continue;
        }

        user.email = email;

        // Make a password, remember it for the message, and store only the hash
        var password = makePassword();

        message += email + "  :  " + password + "\n";

        user.password = encryptData(password);

        users.push(encryptFields(user, storeName));   // AES-encrypt the sensitive fields
    }

    // Show the passwords once, BEFORE saving the data
    console.log(message);
    alert(message);

    // Now save the users
    var tx = db.transaction(storeName, "readwrite");
    var store = tx.objectStore(storeName);

    for (var j = 0; j < users.length; j++) {
        store.put(users[j]);
    }

    tx.oncomplete = function () {
        console.log(storeName + " data inserted.");
        callback();
    };
}