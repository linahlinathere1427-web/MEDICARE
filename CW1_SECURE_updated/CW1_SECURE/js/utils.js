function getLoggedInUser() {
    return JSON.parse(sessionStorage.getItem("currentUser"));
}

// Log out and go back to the login page
function logout() {
    sessionStorage.clear();
    window.location.href = LOGIN_PAGE;
}

//sends you to login if the role is wrong
function requireRole(role) {
    var user = getLoggedInUser();

    if (!user || user.role != role) {
        window.location.href = LOGIN_PAGE;
        return null;
    }

    return user;
}

// Today's date as YYYY-MM-DD
function todayDate() {

    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();

    if (month < 10) {
        month = "0" + month;
    }

    if (day < 10) {
        day = "0" + day;
    }

    return d.getFullYear() + "-" + month + "-" + day;
}

 //time in am pm format
function formatTime(time) {

    if (!time || time.indexOf(":") == -1 || time.indexOf("M") != -1) {
        return time;
    }

    var parts = time.split(":");
    var hour = Number(parts[0]);
    var ampm = "AM";

    if (hour >= 12) {
        ampm = "PM";
    }
    
    hour = hour % 12;

    if (hour == 0) {
        hour = 12;
    }

    if (hour < 10) {
        hour = "0" + hour;
    }

    return hour + ":" + parts[1] + " " + ampm;
}

// Get initials from a name
function getInitials(name) {

    var words = name.trim().split(" ");
    var initials = "";

    for (var i = 0; i < words.length; i++) {
        initials = initials + words[i].charAt(0);
    }

    return initials.toUpperCase();
}

