var userPosition;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          userPosition = position;
        });
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
