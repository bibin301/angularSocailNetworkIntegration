// angular.module('myApp.services', [])


angular.module('routerApp.services', [])
    .service('Service', function ($http) {
        var storedNames = JSON.parse(sessionStorage.getItem("names"));
               
       // var port='http://apps.wellnesstokens.io:8080/wellnesscoin'
       //server
        // var port='http://apps.wellnesstokens.io:8080/wellnesscoin-backendapi-0.0.1-SNAPSHOT/wellnesscoin'
         //var port='http://localhost:8080/wellnesscoin'
		//   var port='https://apps.wellnesstokens.io:3009/wellnesscoin-backendapi-0.0.1-SNAPSHOT/wellnesscoin'
        var port = "http://192.168.1.91:8080/wellnesscoin"

        this.login = function (data, callback) {
            $http({
                method: "POST",
                url: port+'/api/user/2FALogin',
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });


        };

        this.otplogin = function (data, callback) {

            $http({
                method: "POST",
                url: port+'/api/user/login',
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {

                callback(response);
            }, function myError(err) {

                callback(err);
            });


        };



       
        this.register = function (data) {
            return $http.post(port+'/api/user/register ', data);
        };

        this.forgotpassword = function (forgotPasswordData) {
            return $http.post(port+'/api/user/forgot/password', forgotPasswordData);
        };

        this.resetpassword = function (data) {
            return $http.post(port+'/api/user/update/password', data);
        };

        this.emailVerification = function (data) {
            return $http.post(port+'/api/user/emailverification', data);
        };
        this.referral = function (data) {
            return $http.post(port+'/api/user/referral', data);
        };
        this.getuserdashboarddetails = function (data) {
            return $http.post(port+'/api/user/userDashboard', data);
        };
        this.minttokens= function (data) {
            return $http.post(port+'/api/token/mintToken', data);
        };
        this.cointransfer= function (data) {
            return $http.post(port+'/api/token/requestTokenByStatus', data);
        };
        this.burntoken= function (data) {
            return $http.post(port+'/api/token/burn', data);
        };
        
        this.socialLogin= function (data) {
            return $http.post(port+'/api/user/socialNetwork/login', data);
        };
        this.gettransactionhistory= function (data) {
            return $http.post(port+'/api/token/transactionHistory', data);
        };
        this.logout= function (data) {
            return $http.post(port+'/api/user/logout', data);
        };
        this.cointransferadmin= function (data) {
            return $http.post(port+'/api/token/transfer', data);
        };
        this.coinpurchase= function (data) {
            // return $http.post(port+'/crowdsale/api/contribute', data);old api
            return $http.post(port+'/crowdsale/api/purchase/token', data);
        }
        this.forgretresetpassword= function (data) {
            return $http.post(port+'/api/user/forgot/resetPassword', data);
        }
		 this.getuserregisterlist= function (data) {
            return $http.post(port+'/api/user/userList', data);
        }
        
        this.addTokenrate= function (data) {
            return $http.post(port+'/api/token/add/wellnesstoken/rate', data);
        }
        
    });

angular.module('routerApp.services').service('Auth', function () {

    this.getUserInfo = function () {
        var userInfo = JSON.parse(sessionStorage.getItem("names"));
        return userInfo;
    }

})