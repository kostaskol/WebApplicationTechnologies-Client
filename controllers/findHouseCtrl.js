var app = angular.module('airbnbApp');

app.controller('findHouseCtrl', ['$scope', '$location',
    function($scope, $location) {
        $scope.numBeds =
            $scope.numBaths =
            $scope.accommodates =
            $scope.minDays =
            $scope.rating =
            $scope.page = 0;


        $scope.initialiseDate = function() {
            $("#date-picker").datepicker({
                language: 'en',
                range: 'true',
                minDate: new Date(),
                multipleDatesSeparator: ' - ',
                onSelect: function(formattedDate, selected, event) {
                    $scope.$apply(function() {
                        var dates = formattedDate.split(" - ");
                        if (dates.length === 1) {
                            $scope.dateFrom = new Date(dates[0]);
                        } else {
                            $scope.dateFrom = new Date(dates[0]);
                            $scope.dateTo = new Date(dates[1]);
                        }
                    });
                }
            });
        };

        $scope.more = function(i) {
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
                    $scope.minDays++;
                    break;
                case 4:
                    $scope.rating = $scope.rating < 5 ? $scope.rating + 1 : 5;
                    break;
            }
        };

        $scope.less = function(i) {
            switch (i) {
                case 0:
                    $scope.numBeds = $scope.numBeds > 0 ? $scope.numBeds - 1 : 0;
                    break;
                case 1:
                    $scope.numBaths = $scope.numBaths > 0 ? $scope.numBaths - 1 : 0;
                    break;
                case 2:
                    $scope.accommodates = $scope.accommodates > 0 ? $scope.accommodates - 1 : 0;
                    break;
                case 3:
                    $scope.minDays = $scope.minDays > 0 ? $scope.minDays - 1 : 0;
                    break;
                case 4:
                    $scope.rating = $scope.rating > 0 ? $scope.rating - 1 : 0;
                    break;
            }
        };

        $scope.nextPage = function() {
            $scope.page++;
            if ($scope.page === 1) {
                console.log("Country: " + $scope.country);
            }
            if ($scope.page === 7) {
                console.log("Searching");
                $scope.search();
            }
        };

        $scope.prevPage = function() {
            $scope.page = $scope.page > 0 ? $scope.page - 1 : 0;
        };

        if ($scope.dateFrom != null) {
            $scope.dateFrom = $scope.dateFrom.yyyymmdd();
        }

        if ($scope.dateTo != null) {
            $scope.dateTo = $scope.dateTo.yyyymmdd();
        }



        $scope.search = function() {
            if ($scope.dateFrom != null) {
                $scope.dateFrom = $scope.dateFrom.yyyymmdd();
            }

            if ($scope.dateTo != null) {
                $scope.dateTo = $scope.dateTo.yyyymmdd();
            }
            var queryParams = {
                "city": $scope.city,
                "country": $scope.country,
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
                "minDays": $scope.minDays,
                "rating": $scope.rating,
                "dateFrom": $scope.dateFrom,
                "dateTo": $scope.dateTo,
                "minCost": $scope.minCost,
                "maxCost": $scope.maxCost,
                "minCostPerPerson": $scope.minCostPerPerson,
                "maxCostPerPerson": $scope.maxCostPerPerson
            };

            $location.path("/searchresults").search(queryParams);
        };
    }
]);
