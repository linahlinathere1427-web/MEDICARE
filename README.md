# MEDICARE
A secure, role-based healthcare management web application built with HTML, CSS and JavaScript. Features include patient registration, admin and doctor portals, AES encryption, IndexedDB data storage, appointment booking, prescription requests and input validation.
CST2572 SECURE WEB APPLICATION
Student: Linah fathima- M01086284, Anushka beenu, vibuti Patil, hanan ibrahim    

HOW TO RUN
1. Unzip the folder.
2. Open pages/index.html (or pages/login/login.html) in Google Chrome.
3. On the very first run an alert window shows a generated password for each
   admin, doctor and patient. Note down account details to login to pages.
4. An internet connection is needed on the first run to fetch the JSON data.

FOLDERS
css/    style.css - page styling
js/     config.js      settings, JSON links, encryption key
        encryption.js  AES encrypt/decrypt, password generator
        validation.js  input sanitising and validation checks
        utils.js       small helper functions, logout
        database.js    creates and opens the IndexedDB database
        dbhelpers.js   add, update, delete, read all, search
        fetchdata.js   fetches the JSON files and fills the database
        auth.js        signup and login
lib/    crypto-js.min.js - local copy of CryptoJS (works offline)
pages/  admin/ doctor/ patient/ login/ - the web pages
        index.html, privacy.html
docs/   ER diagram, page designs, report

FEATURES
- IndexedDB database filled from the JSON files on the server
- Admin: add, update and delete patients
- Patient: book appointments, request prescriptions, view medication and shared notes, view patient details
- Doctor: view patients, add notes and medicines, see appointments and requests
- Passwords and sensitive fields encrypted with AES-256 (CryptoJS)
- Input sanitising, email/password/NHS/phone/date validation
- Login lock after 5 failed attempts
- Dummy server function (sendToServer in dbhelpers.js) - logs only

LIMITATIONS
- The encryption key is in the front-end code. A real system would keep keys
  on a server. This is accepted for the client-side coursework.
- Role checks happen in the browser, so a real system would need server checks.

REFERENCES
- CST2572 Lecture 4 (IndexedDB) and Lecture 5 (CryptoJS and input sanitisation)
- Lecture example files: encryption.html, fetch-new.html, sanitize.html,
  add.html, query.html, search.html, json_fetching.html
- CryptoJS 4.2.0 - https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/
-JSON files provided
- claude assistance for some functions.
