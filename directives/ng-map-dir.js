var app = angular.module('airbnbApp')

app.directive('ng-map', function() {
  var link = function(scope, element, attrs) {
    var map, infoWindow;
    var markers = [];

    var mapOptions = {
      center: new google.maps.LatLng(50,2);
    }
  }
})
