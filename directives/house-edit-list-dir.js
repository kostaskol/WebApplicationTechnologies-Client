var app = angular.module('airbnbApp');

app.directive('houseEditList', function() {
    return {
        restrict: "E",
        scope: {
            houses: "=",
            houseListStyle: "="
        },
        templateUrl: "views/house-list.html",
        controller: "houseEditListCtrl"
    }
});