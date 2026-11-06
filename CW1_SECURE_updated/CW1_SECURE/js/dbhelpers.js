// ADD a new record
function addRecord(storeName, record, callback) {

    var tx = db.transaction(storeName, "readwrite");

    tx.objectStore(storeName).add(encryptFields(record, storeName));

    tx.oncomplete = function () {
        sendToServer(storeName, "add");
        if (callback) {
            callback();
        }
    };

    tx.onerror = function () {
        console.log("Could not add to " + storeName);
        alert("Could not save. Please try again.");
    };
}

// UPDATE a record and adds a new one if the record has no id yet.
function saveRecord(storeName, record, callback) {

    var tx = db.transaction(storeName, "readwrite");

    tx.objectStore(storeName).put(encryptFields(record, storeName));

    tx.oncomplete = function () {
        sendToServer(storeName, "update");
        if (callback) {
            callback();
        }
    };

    tx.onerror = function () {
        console.log("Could not save to " + storeName);
    };
}

// DELETE a record by its id
function deleteRecord(storeName, id, callback) {

    var tx = db.transaction(storeName, "readwrite");

    tx.objectStore(storeName).delete(id);

    tx.oncomplete = function () {
        sendToServer(storeName, "delete");
        if (callback) {
            callback();
        }
    };

    tx.onerror = function () {
        console.log("Could not delete from " + storeName);
    };
}

// READ ALL records
function getAllRecords(storeName, callback) {

    var request = db.transaction(storeName, "readonly")
        .objectStore(storeName)
        .getAll();

    request.onsuccess = function () {

        var list = [];

        for (var i = 0; i < request.result.length; i++) {
            list.push(decryptFields(request.result[i], storeName));
        }

        callback(list);
    };

    request.onerror = function () {
        console.log("Error querying data");
    };
}

// SEARCH using an index 
function searchByIndex(storeName, indexName, value, callback) {

    var index = db.transaction(storeName, "readonly")
        .objectStore(storeName)
        .index(indexName);

    var request = index.get(value);

    request.onsuccess = function () {
        if (request.result) {
            callback(decryptFields(request.result, storeName));
        } else {
            callback(undefined);
        }
    };

    request.onerror = function () {
        console.log("Error querying data");
    };
}

// Find a user by email
function findUser(storeName, email, callback) {
    searchByIndex(storeName, "email", email.trim().toLowerCase(), callback);
}

// DUMMY server function 
function sendToServer(storeName, action) {
    // A real version would send the change to a web database over HTTPS
    console.log("[dummy server] " + action + " on " + storeName);
}