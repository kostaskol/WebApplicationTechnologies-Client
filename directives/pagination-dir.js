var app = angular.module('airbnbApp');

app.directive('pagination', function() {
    return {
        restrict: "E",
        scope: {
            pages: "=",
            click: "="
        },
        templateUrl: "views/pagination.html",
        link: function(scope, element, attrs) {
            scope.clicked = function(index) {
                scope.click(index);
            };


        }
    }
})
