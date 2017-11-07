var app = angular.module('auth', []);

app.controller('auth', function ($scope, $http, $window) {

    $scope.LoginBox = false;
    $scope.LoginAlert = true;
    $scope.RegisterAlert = true;
    $scope.RegisterBox = false;

    $scope.toggle_login = function () {
        $scope.RegisterBox = !$scope.RegisterBox;
        $scope.LoginBox = !$scope.LoginBox;
    };

    $scope.toggle_register = function () {
        $scope.RegisterBox = !$scope.RegisterBox;
        $scope.LoginBox = !$scope.LoginBox;
    };

    $scope.login = function () {

        var data = {
            username: $scope.username,
            password: $scope.password
        }

        $http.post('/login', data).then(function (data, status) {
            if (data.is_logged) {
                $scope.LoginAlert = true;
                $window.location.href = "/home#?id=" + data.id;
            }
            else {
                $scope.LoginAlert = false;
            }
        }).error(function (data, status) {
            alert("Connection Error");
        });

    };

    $scope.check_username_register = function () {
        var data = {
            username: $scope.username
        }
        check_username.check_username(data);

    };

    $scope.register = function () {
        var data = {
            username: $scope.username,
            password: $scope.password
        }

        $http.post('/register', data).then(function (data, status) {
            if (data.is_logged) {
                $scope.LoginAlert = true;
                alert("hello")
                //$window.location.href = "/home#?id=" + data.id;
            }
            else {
                $scope.LoginAlert = false;
                alert("bye")
            }
        }).catch(function (data, status) {
            alert("Connection Error");
        });
    };

    var check_username = {
        check_username: function (data) {
            $http.post('/check_name', data).then(function (data, status, headers, config) {
                if (!data.msg) {
                    $scope.RegisterAlert = true;
                } else {
                    $scope.RegisterAlert = false;
                }
            }).catch(function (data, status) {
                alert("Connection Error");
            });
        }
    }



})