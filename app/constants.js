var MESSAGE_RECEIVER = 0;
var MESSAGE_SENDER = 1;
var PAGE_SIZE = 8;

var STATUS_BAD_DATE_RANGE = 205;
var STATUS_DATE_OOB = 206;
var STATUS_DATE_BOOKED = 207;

var ADMIN_OFFS = 0;
var RENTER_OFFS = 1;
var USER_OFFS = 2;

var MAX_SHOWN = 10;

var PORT = 8443;
var SERVER_URL = "https://localhost:" + PORT + "/airbnb/rest";

var STATUS_MODIFIED = 401;
var STATUS_NOT_MODIFIED = 400;

var STATUS_NOT_ENOUGH_DATA = 255;

var generalFailure = function(response) {
    console.log("Got failure response: " + JSON.stringify(response));
    if (response.status == 500) {
        $location.path("/500");
    }
};