var app = angular.module('airbnbApp');

app.controller('myProfileCtrl', ['$scope', '$location', '$cookies', '$http', function ($scope, $location, $cookies, $http) {
    var data = {
        token: $cookies.get('token')
    };

    $scope.mailChanged = false;
    $scope.type = 'mp';

    if ($cookies.get("loggedIn") === "false" || $cookies.get("token") == "" || $cookies.get("token") == null) {
        $location.path("/");
    }

    $scope.updateUser = function () {
        if ($scope.initialBio != $scope.user.bio ||
            $scope.initialPNum != $scope.user.pNum) {
            var data = {
                bio: $scope.user.bio,
                pNum: $scope.user.pNum,
                token: $cookies.get("token")
            };

            $http({
                url: SERVER_URL + "/user/updateuser",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                data: data
            }).then( /* success */ function (response) {
                console.log("Updated successfully");
                $scope.initialBio = $scope.user.bio;
            }, /* failure */ function (response) {

            });
        }
    };

    $http({
        url: SERVER_URL + "/user/getuser",
        data: data,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }).then( /* success */ function (response) {
        $scope.user = response.data;
        $scope.initialBio = response.data.bio;
        $scope.initialPNum = response.data.pNum;
        console.log(response.data);
        if ($scope.user.accType.charAt(RENTER_OFFS) === "1") {
            $scope.renter = true;
            if ($scope.user.approved) {
                $scope.approvedText = "You can register houses";
            } else {
                $scope.approvedText = "Your request for house registration is under review. Please check back later";
            }
        } else {
            $scope.renter = false;
        }
    }, /* failure */ function (response) {

    });

    $scope.showMessages = function (type) {
        $http({
            url: SERVER_URL + "/message/receive/" + type,
            method: "POST",
            data: $cookies.get("token"),
            headers: {
                "Content-Type": "text/plain"
            }
        }).then( /* success */ function (response) {
            console.log(response.data);
            if (response.data.length === 0) {
                $scope.noMessages = true;
            } else {
                $scope.messages = response.data;
                $scope.noMessages = false;
            }
            if (type == 0) {
                $scope.type = 'mmi';
            } else {
                $scope.type = 'mms';
            }
        }, /* failure */ function (response) {

        });
    };

    $scope.previousIndex = null;
    $scope.shown = false;
    $scope.showMessage = function (index) {
        if ($scope.previousIndex !== null) {
            console.log("Previous index = " + $scope.previousIndex);
            angular.element("#" + $scope.previousIndex + "-body").removeClass("shown");
            angular.element("#" + $scope.previousIndex + "-body").addClass("hide");
        }

        if ($scope.previousIndex === index) {
            if ($scope.shown) {
                angular.element("#" + $scope.previousIndex + "-body").removeClass("shown");
                angular.element("#" + $scope.previousIndex + "-body").addClass("hide");
                $scope.shown = false;
            } else {
                angular.element("#" + $scope.previousIndex + "-body").removeClass("hide");
                angular.element("#" + $scope.previousIndex + "-body").addClass("shown");
                $scope.shown = true;
            }
            return;
        }

        console.log("Current index " + index);

        $scope.previousIndex = index;
        angular.element("#" + index + "-body").removeClass("hide");
        angular.element("#" + index + "-body").addClass("shown");
        $scope.shown = true;
    };

    $scope.signOut = function () {
        swal({
            title: "Warning",
            text: "Are you sure you wish to sign out?",
            allowOutsideClick: true,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "Sign out",
            cancelButtonText: "No, take me back"
        }, function (confirmed) {
            if (confirmed) {
                $http({
                    url: SERVER_URL + "/user/invalidate",
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain"
                    },
                    data: $cookies.get("token")
                }).then( /* success */ function (response) {
                    $cookies.remove("token");
                    $cookies.put("loggedIn", "false");
                    $location.path("/home");
                }, /* failure */ function (response) {

                });
            }
        });

    };
    
    $scope.showHouses = function() {
        $scope.type = "sh";
        $http({
           url: SERVER_URL + "/house/getusershousesmin",
            method: "POST",
            data: $cookies.get("token"),
            headers: {
                "Content-Type": "text/plain"
            }
        }).then(/* success */ function(response) {
            console.log(response.data);
           $scope.usersHouses = response.data.houses; 
        }, /* failure */ function(response) {
            
        });
    };

    $scope.deleteMessage = function (index) {
        swal({
                title: "Warning",
                text: "Are you sure you want to delete this message?",
                type: "warning",
                allowOutsideClick: true,
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: "I'm sure",
                cancelButtonText: "No, take me back",
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            },
            function (confirmed) {
                console.log($scope.messages);
                if (confirmed) {
                    $http({
                        url: SERVER_URL + "/message/delete/" + MESSAGE_RECEIVER + "/" + $scope.messages[index].messageId,
                        method: "POST",
                        data: $cookies.get("token"),
                        headers: {
                            "Content-Type": "text/plain"
                        }
                    }).then( /* success */ function (response) {
                        $scope.messages.splice(index, 1);
                        swal({
                            title: "Success!",
                            text: "The message has been successfully deleted",
                            type: "success"
                        });
                    }, /* failure */ function (response) {

                    });
                }
            });
        console.log("Deleting message with subject: " + $scope.messages[index].subject);
    };

    var getBookings = function (response) {
        $scope.bookings = response.data;
        $scope.currentlyBooked = [];
        $scope.previouslyBooked = [];
        for (var i = 0; i < $scope.bookings.length; i++) {
            if (new Date($scope.bookings[i].dateTo) < new Date()) {
                $scope.previouslyBooked.push($scope.bookings[i]);
                $scope.hasPrevious = true;
            } else {
                $scope.currentlyBooked.push($scope.bookings[i]);
                $scope.hasCurrent = true;
            }
        }
        console.log($scope.currentlyBooked);
    };

    $scope.showBooked = function (type) {
        $scope.hasCurrent = $scope.hasPrevious = false;

        if (type === 0) {
            $http({
                url: SERVER_URL + "/booking/getusersbookings",
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                data: $cookies.get("token")
            }).then( /* success */ getBookings,
                /* failure */
                function (response) {

                });
        } else {
            $http({
                url: SERVER_URL + "/booking/getrentersbookings",
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                data: $cookies.get("token")
            }).then( /* success */ getBookings,
                /* failure */
                function (response) {

                });
        }
        $scope.type = 'bookings';
    };

    $scope.showMessage(0);


    $scope.showProfile = function () {
        $scope.type = "mp";
    };

    $scope.changeEmail = function () {
        $scope.showMail = !$scope.showMail;
    };

    $scope.updateMail = function () {
        if ($scope.newMail == "" || $scope.newMail == null) {
            console.log("Returning")
            return;
        }

        var data = {
            token: $cookies.get("token"),
            newMail: $scope.newMail
        };

        $http({
            url: SERVER_URL + "/user/changemail",
            data: data,
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then( /* success */ function (response) {
            $scope.mailChanged = true;
        }, /* failure */ function (response) {

        });
    };

}]);
