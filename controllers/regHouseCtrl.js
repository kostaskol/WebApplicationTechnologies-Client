var app = angular.module('airbnbApp');

function Errors() {
    this.areaReq = false;
    this.descReq = false;
    this.instrReq = false;
    this.datesErr = false;
    this.datesErrText = "";
}

app.controller('regHouseCtrl', ['$scope', 'HttpCall', '$location', '$rootScope', '$timeout', '$cookies',
                                function ($scope, HttpCall, $location, $rootScope, $timeout, $cookies) {
        $scope.page = 1;
        $scope.marker = null;
        $scope.numBeds = 1;
        $scope.numBaths = 1;
        $scope.accommodates = 1;
        $scope.minDays = "No minimum";
        $scope.maxPersons = 1;
        $scope.dateFrom = null;
        $scope.dateTo = null;
        $scope.pets = false;
        $scope.events = false;
        $scope.livingRoom = false;
        $scope.smoking = false;
        $scope.initd = false;

        $scope.errors = new Errors();

        $scope.less = function (i) {
            switch (i) {
                case 0:
                    if ($scope.numBeds > 1) {
                        $scope.numBeds--;
                    }
                    break;
                case 1:
                    if ($scope.numBaths > 1) {
                        $scope.numBaths--;
                    }
                    break;
                case 2:
                    if ($scope.accommodates > 1) {
                        $scope.accommodates--;
                    }
                    break;
                case 3:
                    if ($scope.minDays > 1) {
                        $scope.minDays--;
                    } else if ($scope.minDays === 1 || $scope.minDays === "No minimum") {
                        $scope.minDays = "No minimum";
                    }
                    break;
                case 4:
                    if ($scope.maxPersons > 0) {
                        $scope.maxPersons--;
                    }
            }
        };

        $scope.more = function (i) {
            switch (i) {
                case 0:
                    $scope.numBeds++;
                    break;
                case 1:
                    $scope.numBaths++;
                    break;
                case 2:
                    $scope.accommodates++;
                    break;
                case 3:
                    if ($scope.minDays === "No minimum") {
                        $scope.minDays = 0;
                    }
                    $scope.minDays++;
                    break;
                case 4:
                    $scope.maxPersons++;
                    break;
            }
        };

        $scope.mapBtn = function () {
            $scope.useMap = true;
            $scope.useAddr = false;
            if (!$scope.initd) {
                $scope.getLocation();
            } else {
                setTimeout(function () {
                    google.maps.event.trigger($scope.map, 'idle');
                }, 500);
            }
        };
                                    
        $scope.initDate = function() {
            $("#datepicker").datepicker({
                language: 'en',
                range: true,
                minDate: new Date(),
                multipleDatesSeparator: " - ",
                onSelect: function (formattedDate, selected, event) {
                    $scope.$apply(function () {
                        var dates = formattedDate.split(" - ");
                        if (dates.length === 2) {
                            $scope.dateFrom = new Date(dates[0]).yyyymmdd();
                            $scope.dateTo = new Date(dates[1]).yyyymmdd();
                        }
                    });

                }
            });
        };

        $scope.addrBtn = function () {
            $scope.useAddr = true;
            $scope.useMap = false;
        };

        function initMap(position) {
            $scope.initd = true;
            if (position === null) {
                console.log("Position is null");
                var uluru;
                if ($scope.marker !== null) {
                    uluru = {
                        lat: $scope.marker.getPosition().lat(),
                        lng: $scope.marker.getPosition().lng()
                    };
                } else {
                    uluru = {
                        lat: 35.5,
                        lng: 35.5
                    };
                }
                $scope.map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 4,
                    center: uluru
                });
            } else {
                var uluru = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                console.log(uluru);
                $scope.map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 13,
                    center: uluru
                });
                console.log("Initialised map");
                if ($scope.marker === null) {
                    $scope.marker = new google.maps.Marker({
                        position: uluru,
                        map: $scope.map
                    });
                } else {
                    $scope.marker = new google.maps.Marker({
                        position: $scope.location,
                        map: $scope.map
                    });
                    $scope.map.panTo({
                        lat: $scope.marker.getPosition().lat(),
                        lng: $scope.marker.getPosition().lng()
                    });
                }
            }

            google.maps.event.addListener($scope.map, 'click', function (event) {
                var location = event.latLng;
                if (!$scope.marker) {
                    $scope.marker = new google.maps.Marker({
                        position: location,
                        map: $scope.map
                    });
                } else {
                    $scope.location = location;
                    $scope.marker.setPosition(location);
                }
                $scope.map.panTo(location);
            });
            $scope.initialized = true;
        }

        $scope.force = 0;
        $scope.next = function () {
            if ($scope.page == 1) {
                $scope.lat = $scope.marker.getPosition().lat();
                $scope.lng = $scope.marker.getPosition().lng();

                $scope.page++;
            } else if ($scope.page == 5) {
                var cont = true;
                if ($scope.area == null || $scope.area.length === 0) {
                    console.log("Area is null");
                    $scope.errors.areaReq = true;
                    cont = false;
                } else {
                    $scope.errors.areaReq = false;
                }
                if ($scope.desc == null || $scope.desc.length === 0) {
                    $scope.errors.descReq = true;
                    cont = false;
                } else {
                    $scope.errors.descReq = false;
                }
                if (($scope.instructions == null || $scope.instructions.length === 0) && $scope.force == 0) {
                    $scope.errors.instrReq = true;
                    cont = false;
                    $scope.force++;
                } else {
                    $scope.errors.instrReq = false;
                }
                if (cont === false) return;
                $scope.page++;
            } else if ($scope.page == 6) {
                var cont = true;
                if ($scope.dateFrom === null || $scope.dateTo === null) {
                    $scope.errors.datesErr = true;
                    $scope.errors.datesErrText = "Please fill in both dates";
                    cont = false;
                } else {
                    $scope.errors.datesReq = false;
                }

                if ($scope.dateFrom > $scope.dateTo) {
                    $scope.errors.datesErr = true;
                    $scope.errors.datesErrText = "Starting date cannot be after ending date";
                    cont = false;
                }

                if (!cont) return;
                $scope.page++;
                console.log($scope.dateFrom);
            } else if ($scope.page == 8) {
                var file = $scope.housePic;
                console.log("file" + file);
                var fd = new FormData();
                fd.append('file', file);
                var tok = $cookies.get('token');
                fd.append('token', tok);
                if ($scope.minDays === "No minimum") {
                    $scope.minDays = 0;
                }
                var object = {
                    "houseID": null,
                    "latitude": $scope.lat,
                    "longitude": $scope.lng,
                    "address": $scope.addr,
                    "numBeds": $scope.numBeds,
                    "numBaths": $scope.numBaths,
                    "accommodates": $scope.accommodates,
                    "livingRoom": $scope.livingRoom,
                    "smoking": $scope.smoking,
                    "pets": $scope.pets,
                    "wifi": $scope.wifi,
                    "airconditioning": $scope.airconditioning,
                    "heating": $scope.heating,
                    "kitchen": $scope.kitchen,
                    "tv": $scope.tv,
                    "parking": $scope.parking,
                    "elevator": $scope.elevator,
                    "events": $scope.events,
                    "area": $scope.area,
                    "description": $scope.desc,
                    "minDays": $scope.minDays,
                    "instructions": $scope.instructions,
                    "rating": 0,
                    "numRatings": 0,
                    "dateFrom": $scope.dateFrom,
                    "dateTo": $scope.dateTo,
                    "minCost": $scope.minCost,
                    "costPerPerson": $scope.costPerPerson,
                    "costPerDay": $scope.costPerDay
                };
                fd.append('data', JSON.stringify(object));

                var success = function(response) {
                    $timeout(function () {
                        console.log("Running");
                        $location.path("/home");
                    }, 2000);
                };

                var failure = function(response) {
                    console.log("There has been an error");
                };

                var headers = {
                    "Content-Type": undefined
                };

                HttpCall.call("house/register", "POST", fd, headers, success, failure);

            } else {
                $scope.page++;
            }
        };


        $scope.confirmAddr = function () {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': $scope.address
            }, function (results, status) {
                if (status === 'OK') {
                    $scope.lat = results[0].geometry.location.lat();
                    $scope.lng = results[0].geometry.location.lng();
                    if ($scope.map === null) {
                        $scope.initd = true;
                        $scope.map = new google.maps.Map(document.getElementById('map'), {
                            zoom: 13,
                            center: results[0].geometry.location
                        });
                        google.maps.event.addListener($scope.map, 'click', function (event) {
                            var location = event.latLng;
                            if (!$scope.marker) {
                                $scope.marker = new google.maps.Marker({
                                    position: location,
                                    map: $scope.map
                                });
                            } else {
                                $scope.location = location;
                                $scope.marker.setPosition(location);
                            }
                        });
                        google.maps.event.addListener($scope.map, 'idle', function () {
                            console.log("Called");
                            $scope.map.panTo($scope.location);
                            google.maps.event.trigger($scope.map, 'resize');
                        });
                    }
                    $scope.map.setCenter(results[0].geometry.location);
                    if ($scope.marker === null) {
                        $scope.marker = new google.maps.Marker({
                            map: $scope.map,
                            position: results[0].geometry.location
                        });
                    } else {
                        $scope.marker.setPosition(results[0].geometry.location);
                    }
                    $scope.location = results[0].geometry.location;
                    $scope.mapBtn();
                } else {
                    $scope.addrNotFound = true;
                    $scope.errText = "The address you provided does not seem to exist. Try selecting your location on the map";
                }
            });
        };


        $scope.getLocation = function () {
            console.log("Called");
            if ($scope.page != 1) return;

            console.log("Acquiring location");
            if (navigator.geolocation) {
                console.log("Initialising map");
                navigator.geolocation.getCurrentPosition(initMap);
            } else {
                console.log("No location info");
                initMap();
            }
        };

        $scope.back = function () {
            $scope.page -= 1;
        };

        $scope.mapBtn();




}]);
