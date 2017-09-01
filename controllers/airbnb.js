//                                      v This is the required module for routing
var app = angular.module("airbnbApp", [
    'ngRoute',
    'ngAnimate',
    'ngCookies',
    'ngRateIt',
    'angular.filter'
]);

var user;

var port = 8080;

app.controller('airbnbController', ['$scope', '$rootScope', '$http', '$cookies',
    function ($scope, $rootScope, $http, $cookies) {

        $rootScope.$on('UpdateNavBar', function () {
            $scope.updateNavBar();
        });

        console.log('airbnbcontroller called');
        $scope.showNav = true;

        $scope.updateNavBar = function () {
            $scope.token = $cookies.get('token');
            if ($scope.token === "" || $scope.token == null) {
                $scope.loggedIn = false;
                $scope.renter = false;
            } else {

                // Request user information
                $http({
                    url: "http://localhost:8080/airbnb/rest/user/getuser",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: {
                        "token": $scope.token
                    }
                }).then( /* success */ function (response) {
                    $scope.loggedIn = true;
                    $scope.user = response.data;
                    if ($scope.user.accType.charAt(1) == '1') {
                        $scope.renter = true;
                    }

                }, function ( /* failure */ error) {
                    // TODO: Remove this comment
                    // For now, we manage a 404 (Server not running)
                    // the same way. Need to change this and redirect them to
                    // another page explaining the problem
                    if (error.status == 401) {
                        $scope.loggedIn = false;
                        $cookies.put('token', '');
                    }
                });
            }
        };

        $scope.$on('changeNav', function (obj) {
            $scope.showNav = obj.showNav;
            console.log("Change Nav Called! " + obj.showNav);
        });

        $scope.signOut = function () {
            $cookies.put('token', '');
            user = null;
            $scope.updateNavBar();
        };

        $scope.updateNavBar();
    }
]);

app.service('authenticationService', function ($http, $location) {
    this.login = function (cred, succCb, failCb) {
        $http({
            url: "http://localhost:" + port + "/airbnb/rest/user/login",
            method: "POST",
            data: cred,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(succCb, failCb);
    };

    this.signup = function (info) {
        $http({
            url: "http://localhost:" + port + "/airbnb/rest/user/signup",
            method: "POST",
            data: info,
            headers: {
                "Content-Type": "application/json"
            }
        }).then( /* success */ function (data) {
            var responseObject = data['data'];
            if (responseObject['err-code'] == 200) {
                console.log("Showing error");
                $('#mail-err').removeClass("error-hidden");
                $('#mail-err').addClass("error");
            } else {
                $('#mail-err').removeClass("error");
                $('#mail-err').addClass("error-hidden");
                window.history.back();
            }
        }, /* failure */ function (data) {
            console.log("Got failure data: " + JSON.stringify(data) + " which is of type: " + typeof data);
        });
    };
});

app.service('fileUploadService', ['$http', function ($http) {
    this.uploadFileToUrl = function (data, uploadUrl) {
        $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': "multipart/form-data",
                },
                data: data
            })
            .then( /* success */ function (data) {
                console.log(data);
            }, /* failure */ function (data) {
                console.log(data);
            });
    };
}]);

app.service('searchResultsService', ['$http', '$rootScope', function ($http, $rootScope) {
    this.search = function (queryParams) {
        $http({
            url: "http://localhost:" + port + "/airbnb/rest/house/search",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            data: queryParams
        }).then( /* success */ function (response) {
            this.houses = response.data;
            $rootScope.$broadcast('gotList', null);
        }, /* failure */ function (response) {
            this.houses = null;
        });
    }
}])

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



var req;
