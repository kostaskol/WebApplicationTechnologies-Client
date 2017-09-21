//                                      v This is the required module for routing
var app = angular.module("airbnbApp", [
    'ngRoute',
    'ngAnimate',
    'ngCookies',
    'ngRateIt',
    'angular.filter',
    'ngFileUpload'
]);

app.controller('airbnbController', ['$scope', '$rootScope', '$http', '$cookies', 'HttpCall',
    function ($scope, $rootScope, $http, $cookies, HttpCall) {

        $rootScope.$on('UpdateNavBar', function () {
            $scope.updateNavBar();
        });

        $scope.showNav = true;

        $scope.updateNavBar = function () {
            $scope.token = $cookies.get('token');
            if ($scope.token === "" || $scope.token === null) {
                $scope.loggedIn = false;
                $cookies.put("loggedIn", "false");
                $scope.renter = false;
            } else {
                var updateSuccess = function(response) {
                    $scope.loggedIn = true;
                    $scope.user = response.data;
                    if ($scope.user.accType.charAt(1) === '1') {
                        $scope.renter = true;
                    }
                    $cookies.put("enoughData", $scope.user.enoughData);
                };

                var updateFailure = function(response) {
                    $scope.loggedIn = false;
                    $cookies.put('token', '');
                    $cookies.put('loggedIn', "false");

                };

                HttpCall.postText("user/getuser", $scope.token, updateSuccess, updateFailure);
            }
        };

        $scope.$on('changeNav', function (obj) {
            $scope.showNav = obj.showNav;
        });

        $scope.signOut = function () {
            $cookies.put('token', null);
            $scope.updateNavBar();
        };

        $scope.updateNavBar();
    }
]);

// Inject the dependency and create a url - file mapping
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: "views/home.html",
            controller: 'homeCtrl'
        })
        .when('/signup', {
            templateUrl: "views/signup.html",
            controller: "signUpCtrl"
        })
        .when('/404', {
            templateUrl: "views/404.html"
        })
        .when('/login', {
            templateUrl: "views/login.html",
            controller: "loginCtrl"
        })
        .when("/profile-settings", {
            templateUrl: "views/profile-settings.html",
            controller: "settingsCtrl"
        })
        .when("/register-house", {
            templateUrl: "views/register-house.html",
            controller: "regHouseCtrl"
        })
        .when("/find-house", {
            templateUrl: "views/find-house.html",
            controller: "findHouseCtrl"
        })
        .when("/house-pres", {
            templateUrl: "views/house-pres.html",
            controller: "housePresCtrl"
        })
        .when("/searchresults", {
            templateUrl: "views/search-results.html",
            controller: "searchResultsCtrl"
        })
        .when("/profilepage", {
            templateUrl: "views/profile-page.html",
            controller: "profilePageCtrl"
        })
        .when("/message", {
            templateUrl: "views/message.html",
            controller: "messageCtrl"
        })
        .when("/admin", {
            templateUrl: "views/admin.html",
            controller: "adminCtrl"
        })
        .when("/userpresentation", {
            templateUrl: "views/user-pres.html",
            controller: "userPresCtrl"
        })
        .when("/passreset", {
            templateUrl: "views/pass-reset.html",
            controller: "passResetCtrl"
        })
        .when("/myprofile", {
            templateUrl: "views/my-profile.html",
            controller: "myProfileCtrl"
        })
        .when("/house-edit", {
            templateUrl: "views/house-edit.html",
            controller: "houseEditCtrl"
        })
        .when("/test", {
            templateUrl: "views/test.html",
            controller: "testCtrl"
        })
        .when('/', {
            redirectTo: '/home'
        })
        .otherwise({
            redirectTo: "/404"
        });
}]);