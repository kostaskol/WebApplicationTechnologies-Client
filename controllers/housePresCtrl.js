var app = angular.module('airbnbApp');

app.controller('housePresCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$window', '$http', '$cookies',
                                 function ($scope, $rootScope, $routeParams, $location, $window, $http, $cookies) {

        $scope.houseId = parseInt($routeParams.houseId);
        $scope.currentIndex = 0;
        $scope.guests = 1;
        $scope.dateChosen = false;


        function calculateCost() {
            console.log("Calculating cost");
            console.log("Guests: " + $scope.guests + " costPerPerson: " + $scope.house.costPerPerson);
            var days = $scope.bookDateTo - $scope.bookDateFrom;
            days = Math.floor(days / (1000 * 60 * 60 * 24));
            $scope.finalCost = days * $scope.house.costPerDay + $scope.guests * $scope.house.costPerPerson;
            console.log("Final cost = " + $scope.finalCost);
            $scope.showCost = true;
        }

        $scope.$watch('guests', function (newVal, oldVal) {
            if ($scope.dateChosen) {
                calculateCost();
            }
        });

        $http({
            url: SERVER_URL + "/house/gethouse/" + $scope.houseId,
            method: "GET"
        }).then( /* success */ function (response) {
            $scope.house = response.data;
            console.log($scope.house.dateFrom);
            //$scope.house.dateFrom = new Date($scope.house.dateFrom);
            $scope.currentIndex = 0;
            $scope.show = true;

            var bookDateFrom;

            var nowDate = new Date();

            if (nowDate > new Date($scope.house.dateFrom)) {
                bookDateFrom = nowDate;
            } else {
                bookDateFrom = new Date($scope.house.dateFrom);
            }
            
            console.log($scope.house.excludedDates);
            
            $scope.excludedDates = [];
            for (var i = 0; i < $scope.house.excludedDates.length; i++) {
                $scope.excludedDates.push(new Date($scope.house.excludedDates[i]));
            }
            
            console.log($scope.excludedDates);

            $("#bookDate").datepicker({
                language: 'en',
                minDate: bookDateFrom,
                maxDate: new Date($scope.house.dateTo),
                range: true,
                multipleDatesSeparator: " - ",
                onSelect: function (formattedDate, selected, event) {
                    $scope.$apply(function () {
                        var dates = formattedDate.split(" - ");
                        if (dates.length != 2) {
                            $scope.showCost = false;
                            return;
                        } else {
                            $scope.bookDateFrom = new Date(dates[0]);
                            $scope.bookDateTo = new Date(dates[1]);
                            $scope.dateChosen = true;
                            calculateCost();
                        }
                    });

                },
                onRenderCell: function(date, cellType) {
                    if (cellType == "day") {
                        for (var i = 0; i < $scope.excludedDates.length; i++) {
                            var d = $scope.excludedDates[i];
                            if (d.getUTCFullYear() === date.getUTCFullYear() && 
                                d.getUTCMonth() === date.getUTCMonth() && 
                                d.getDate() === date.getDate()) {
                                return {
                                    disabled: true
                                };
                            }

                        }
                        return {
                            disabled: false
                        };
                    }
                }

            });
            var map = new google.maps.Map(document.getElementById("housePresMap"), {
                center: {
                    lat: $scope.house.latitude,
                    lng: $scope.house.longitude
                },
                zoom: 15
            });

            var marker = new google.maps.Marker({
                map: map,
                position: {
                    lat: $scope.house.latitude,
                    lng: $scope.house.longitude
                }
            });

        }, /* failure */ function (response) {

        });

        $scope.book = function () {
            if ($scope.house.minCost > $scope.finalCost) {
                console.log("Didn't reach minimum cost");
            }

            var data = {
                token: $cookies.get('token'),
                houseId: $scope.houseId,
                guests: $scope.guests,
                dateFrom: $scope.bookDateFrom.yyyymmdd(),
                dateTo: $scope.bookDateTo.yyyymmdd()
            };

            $http({
                url: SERVER_URL + "/booking/new",
                method: "POST",
                data: data,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then( /* success */ function (response) {
                if (response.data.hasOwnProperty("status")) {
                    switch (parseInt(response.data.status)) {
                        case STATUS_BAD_DATE_RANGE:
                            console.log("Bad date range");
                            break;
                        case STATUS_DATE_BOOKED:
                            console.log("Someone booked it before you did");
                            break;
                        case STATUS_DATE_OOB:
                            console.log("This should never happen");
                            break;
                    }
                } else {
                    console.log("House booked successfully");
                }
            }, /* failure */ function (response) {
                console.log(response);
            });
        };

        $scope.more = function () {
            $scope.guests++;
        };

        $scope.less = function () {
            $scope.guests = $scope.guests != 1 ? $scope.guests - 1 : 1;
        };

        $scope.getComments = function () {
            $http({
                url: SERVER_URL + "/comment/get/" + $scope.houseId,
                method: "GET"
            }).then( /* success */ function (response) {
                $scope.comments = response.data;
            }, /* failure */ function (response) {
                $scope.comments = ["Failed loading comments"];
            });
        };

        $scope.getComments();



        $scope.newComment = function () {
            if ($scope.userComment == "") return;
            var data = {
                token: $cookies.get('token'),
                comment: $scope.userComment,
                rating: $scope.userRating
            };

            $http({
                url: SERVER_URL + "/comment/new/" + $scope.houseId,
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                data: data
            }).then( /* success */ function (response) {
                console.log("All Good!");
                $scope.userComment = "";
                $scope.getComments();
            }, /* failure */ function (response) {
                if (response.status == 404)
                    window.alert("Server not running");
                else if (response.status == 401)
                    $location.path("/login");
            });
        };

        $scope.emptyComm = function () {
            $scope.userComment = "";
        };

        $scope.goToProfile = function () {
            $location.path("/profilepage").search({
                userId: $scope.house.ownerId
            });
        };

        $scope.setCurrentSlideIndex = function (index) {
            $scope.currentIndex = index;
        };

        $scope.isCurrentSlideIndex = function (index) {
            return $scope.currentIndex === index;
        };

        $scope.prevSlide = function () {
            $scope.currentIndex = ($scope.currentIndex < $scope.house.pictures.length - 1) ? ++$scope.currentIndex : 0;
        };

        $scope.nextSlide = function () {
            $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.house.pictures.length - 1;
            console.log($scope.houseId);
        };



}]);

app.animation(".slide-animation", function () {
    return {
        addClass: function (element, className, done) {
            if (className == "ng-hide") {
                TweenMax.to(element, 0.5, {
                    left: -element.parent().width(),
                    onComplete: done
                });
            } else {
                done();
            }
        },
        removeClass: function (element, className, done) {
            if (className == 'ng-hide') {
                element.removeClass('ng-hide');
                TweenMax.set(element, {
                    left: element.parent().width()
                });
                TweenMax.to(element, 0.5, {
                    left: 0,
                    onComplete: done
                });
            } else {
                done();
            }
        }
    }
})
