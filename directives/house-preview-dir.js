var app = angular.module('airbnbApp');

app.directive('housePreview', function () {
    return {
        restrict: "EA",
        scope: {
            house: "=",
            presentHouse: "=",
            parentIndex: "=",
            index: "="
        },
        link: function(scope, element, attribute) {
            scope.clicked = function() {
                console.log("Clicked!");
                scope.presentHouse(scope.parentIndex, scope.index);
            };
        },
        templateUrl: "views/house-preview.html"
    };
});