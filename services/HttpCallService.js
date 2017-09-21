
angular.module('airbnbApp').service("HttpCall", function($http) {
    this.callObj = {};

    this.postText = function(url, data, success, failure) {
        this.post(url, data, "text/plain", success, failure);
    };

    this.postJson = function(url, data, success, failure) {
        this.post(url, data, "application/json", success, failure);
    };

    this.post = function(url, data, ct, success, failure) {
        this.callObj.url = SERVER_URL + "/" + url;
        this.callObj.method = "POST";
        this.callObj.data = data;
        this.callObj.headers = {
            "Content-Type": ct
        };
        $http(this.callObj).then(success, failure);
    };

    this.get = function(url, success, failure) {
        this.callObj.url = SERVER_URL + "/" + url;
        this.callObj.method = "GET";
        $http(this.callObj).then(success, failure);
    };

    this.call = function(url, method, data, headers, success, failure) {
        url = SERVER_URL + "/" + url;
        var obj = {
            url: url,
            method: method
        };
        if (method === "POST") {
            obj.data = data;
            obj.headers = headers;
        }
        if (success !== null && failure !== null) {
            $http(obj).then(success, failure);
        } else {
            $http(obj);
        }
    }
});