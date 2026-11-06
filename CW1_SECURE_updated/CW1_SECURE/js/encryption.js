// Encrypt text with AES
function encryptData(text) {
    return CryptoJS.AES.encrypt(String(text), encryptionKey).toString();
}

// Decrypt text. Returns "" if it fails, so the page does not crash.
function decryptData(text) {
    try {
        return CryptoJS.AES.decrypt(text, encryptionKey).toString(CryptoJS.enc.Utf8);
    } catch (error) {
        return "";
    }
}

function isEncrypted(value) {
    return typeof value == "string" && value.indexOf("U2FsdGVkX1") == 0;
}

// Encrypt the sensitive fields of a record
function encryptFields(record, storeName) {

    var copy = {};
    for (var key in record) {
        copy[key] = record[key];
    }

    var fields = ENCRYPTED_FIELDS[storeName] || [];

    for (var i = 0; i < fields.length; i++) {
        var value = copy[fields[i]];

        if (value !== undefined && value !== null && value !== "" && !isEncrypted(value)) {
            copy[fields[i]] = encryptData(value);
        }
    }

    return copy;
}

// Decrypt the sensitive fields of a record 
function decryptFields(record, storeName) {

    var copy = {};
    for (var key in record) {
        copy[key] = record[key];
    }

    var fields = ENCRYPTED_FIELDS[storeName] || [];

    for (var i = 0; i < fields.length; i++) {
        if (isEncrypted(copy[fields[i]])) {
            copy[fields[i]] = decryptData(copy[fields[i]]);
        }
    }

    return copy;
}

// Random whole number from 0 up to max
function randomNumber(max) {

    var number = new Uint32Array(1);
    crypto.getRandomValues(number);

    return number[0] % max;
}


// Pick one random character from a text
function randomChar(characters) {
    return characters.charAt(randomNumber(characters.length));
}


// Make a random 12 character password
function makePassword() {

    var lower = "abcdefghijklmnopqrstuvwxyz";
    var upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var numbers = "0123456789";
    var symbols = "!@#$%^&*?";
    var all = lower + upper + numbers + symbols;

    // Start with one of each type
    var chars = [
        randomChar(lower),
        randomChar(upper),
        randomChar(numbers),
        randomChar(symbols)
    ];

    // Fill the rest with random characters
    while (chars.length < 12) {
        chars.push(randomChar(all));
    }

    // Shuffle so the first four are not always in the same order
    for (var i = chars.length - 1; i > 0; i--) {

        var j = randomNumber(i + 1);

        var temp = chars[i];
        chars[i] = chars[j];
        chars[j] = temp;
    }

    return chars.join("");
}