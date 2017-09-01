var app = angular.module('airbnbApp');

app.directive('userPreview', function () {
    return {
        restrict: 'E',
        scope: {
            user: '=',
            click: '=',
            index: '=',
            approve: '='
        },
        templateUrl: "views/user-preview.html",
        link: function (scope, element, attrs) {
            console.log("User: " + JSON.stringify(scope.user));
            if (scope.user.approved == true) {
                scope.approvedText = "User approved";
                scope.approved = true;
            } else {
                scope.approvedText = "User not approved";
                scope.approved = false;
            }
            
            scope.clicked = function() {
                scope.click(scope.index);
            };
            
            scope.approved = function() {
                scope.approve(scope.index);
            };
            
            if (scope.user.accType.charAt(1) == "1") {
                scope.renter = true;
            } else {
                scope.renter = false;
            }
        }
    };
});
