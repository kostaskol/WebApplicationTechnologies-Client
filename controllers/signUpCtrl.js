var app = angular.module('airbnbApp');

Date.prototype.yyyymmdd = function () {


    var mm = this.getMonth() + 1;
    var dd = this.getDate();

    return [this.getFullYear(), '-',
        (mm > 9 ? '' : '0') + mm, '-',
        (dd > 9 ? '' : '0') + dd, 'T'
      ].join('');
}

// Constants
var tooShort = 1;
var tooLong = 2;
var noDigit = 3;
var noChar = 4;
var allGood = 0;


function formChecker(jsonObject) {
    this.mail = jsonObject.mail;
    this.passwd = jsonObject.passwd;
    this.rePasswd = jsonObject.rePasswd;
    this.fName = jsonObject.fName;
    this.lName = jsonObject.lName;
    this.cCode = jsonObject.cCode;
    this.pNum = jsonObject.pNum;
    this.dob = jsonObject.dob;


    this.checkRePasswd = function () {
        return this.passwd == this.rePasswd;
    }

    this.checkPasswd = function () {
//        if (this.passwd.length < 6)
//            return tooShort;
//
//        if (this.passwd.length > 30)
//            return tooLong;
//
//        if (this.passwd.search(/\d/) == -1)
//            return noDigit;
//
//        if (this.passwd.search(/[a-zA-z]/) == -1)
//            return noChar;

        return allGood;
    }

    this.checkEmpty = function () {
        return !(this.mail == null || this.passwd == null ||
            this.rePasswd == null ||
            this.fName == null || this.lName == null || this.cCode == null ||
            this.pNum == null || this.dob == null)
    }

    this.checkNum = function () {
        return /\d*/.test(this.pNum) && /\d*/.test(this.cCode);
    }

}

app.controller("signUpCtrl", ['$scope', '$http', '$location', 'authenticationService', function ($scope, $http, $location, authenticationService) {
    // TODO: Remove this (obviously)
    $scope.mail = "kwstaskolivas@gmail.com";
    $scope.passwd = "49178417a";
    $scope.rePasswd = "49178417a";
    $scope.fName = "kostas";
    $scope.lName = "kolivas";
    $scope.cCode = "30";
    $scope.pNum = "6948759487";

    $scope.signUp = function () {
        var cont = true;

        var checker = new formChecker({
            "mail": $scope.mail,
            "passwd": $scope.passwd,
            "rePasswd": $scope.rePasswd,
            "fName": $scope.fName,
            "lName": $scope.lName,
            "cCode": $scope.cCode,
            "pNum": $scope.pNum,
            "dob": $scope.dateOfBirth.yyyymmdd()
        });

        if (!checker.checkEmpty()) {
            console.log("At least on field is empty");
            return;
        }

        if (!checker.checkNum()) {
            console.log("Number is wrong");
            $scope.pNumErr = true;
            cont = false;
        } else {
            $scope.pNumErr = false;
        }

        switch (checker.checkPasswd()) {
            case tooShort:
                $scope.passErrText = "Password must be longer than 6 characters";
                $scope.passErr = true;
                cont = false;
                break;
            case tooLong:
                $scope.passErrText = "Password must be no longer than 30 characters";
                $scope.passErr = true;
                cont = false;
                break;
            case noDigit:
                $scope.passErrText = "Password must contain at least one digit";
                $scope.passErr = true;
                cont = false;
                break;
            case noChar:
                $scope.passErrText = "Password must contain at least on character";
                $scope.passErr = true;
                cont = false;
                break;
            case allGood:
                $scope.passErrText = "";
                $scope.passErr = false;
                break;
        }

        if (!checker.checkRePasswd()) {
            $scope.rePassErr = true;
            cont = false;
        } else {
            $scope.rePassErr = false;
6948759487        }

        if (!cont) return;


        var accType = "0";
        if ($scope.isOwner) {
            accType += "1";
        } else {
            accType += "0";
        }


        var request = {
            "email": $scope.mail.toLowerCase(),
            "passwd": $scope.passwd,
            "accountType": accType,
            "firstName": $scope.fName,
            "lastName": $scope.lName,
            "phoneNumber": $scope.cCode + "-" + $scope.pNum,
            "dateOfBirth": $scope.dateOfBirth.yyyymmdd()
        };

        authenticationService.signup(request);
    }
}])
