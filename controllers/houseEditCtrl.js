var app = angular.module('airbnbApp');

app.controller("houseEditCtrl", ['$scope', '$routeParams', 'HttpCall', '$cookies', '$location',
    function ($scope, $routeParams, HttpCall, $cookies, $location) {
    $scope.houseId = $routeParams.houseId;
    $scope.page = 1;
    $scope.marker = null;

    var getSuccess = function(response) {
        $scope.house = response.data;
        $scope.initMap();
    };

    HttpCall.get("house/gethouse/" + $scope.houseId, getSuccess, generalFailure);

    $scope.initDatepicker = function () {
        $("#datepicker").datepicker({
            language: 'en',
            range: true,
            minDate: new Date(),
            multipleDatesSeparator: " - ",
            onSelect: function (formattedDate, selected, event) {
                $scope.$apply(function () {
                    var dates = formattedDate.split(" - ");
                    if (dates.length === 2) {
                        $scope.house.dateFrom = new Date(dates[0]).yyyymmdd();
                        $scope.house.dateTo = new Date(dates[1]).yyyymmdd();
                    }
                });

            }
        });

    };


    $scope.less = function (i) {
        switch (i) {
            case 0:
                if ($scope.house.numBeds > 1) {
                    $scope.house.numBeds--;
                }
                break;
            case 1:
                if ($scope.house.numBaths > 1) {
                    $scope.house.numBaths--;
                }
                break;
            case 2:
                if ($scope.house.accommodates > 1) {
                    $scope.house.accommodates--;
                }
                break;
            case 3:
                if ($scope.house.minDays > 0) {
                    $scope.house.minDays--;
                }
                break;
            case 4:
                if ($scope.house.maxPersons > 0) {
                    $scope.house.maxPersons--;
                }
        }
    };

    $scope.more = function (i) {
        switch (i) {
            case 0:
                $scope.house.numBeds++;
                break;
            case 1:
                $scope.house.numBaths++;
                break;
            case 2:
                $scope.house.accommodates++;
                break;
            case 3:
                $scope.house.minDays++;
                break;
            case 4:
                $scope.house.maxPersons++;
                break;
        }
    };

    $scope.mapBtn = function () {
        $scope.useMap = true;
        $scope.useAddr = false;
        if (!$scope.initd) {
            initMap({
                lat: $scope.house.latitude,
                lng: $scope.house.longitude
            });
        } else {
            setTimeout(function () {
                google.maps.event.trigger($scope.map, 'idle');
            }, 500);
        }
    };

    $scope.addrBtn = function () {
        $scope.useAddr = true;
        $scope.useMap = false;
    };

    $scope.initMap = function () {
        $scope.initd = true;
        var uluru = {
            lat: $scope.house.latitude,
            lng: $scope.house.longitude
        };
        console.log(uluru);
        $scope.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: uluru
        });
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
        if ($scope.page === 8) {
            var data = {
                token: $cookies.get("token"),
                house: $scope.house
            };

            HttpCall.postJson("house/updatehouse/" + $scope.houseId, data,
                function(response) {
                    window.history.back();
                },
                function(response) {});

            var files = [];
            if ($scope.housePic1 != null) {
                files.push($scope.housePic1);
            }
            if ($scope.housePic2 != null) {
                files.push($scope.housePic2);
            }
            if ($scope.housePic3 != null) {
                files.push($scope.housePic3);
            }
            console.log("Sending " + files.length + " pictures");
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var fd = new FormData();
                fd.append('file', file);
                fd.append('token', $cookies.get('token'));
                var headers = {
                    "Content-Type": undefined
                };

                HttpCall.call("house/uploadphoto/" + $scope.houseId, "POST", fd, headers, null, null);
            }
        } else {
            $scope.page++;
        }
    };

    $scope.back = function () {
        $scope.page = $scope.page - 1 !== 0 ? $scope.page - 1 : 0;
        if ($scope.page === 1) $scope.initMap();
    };
}]);
