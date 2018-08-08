var app = angular.module('routerApp.userDashboard', ['toaster']);
app.controller('userctrl', function ($scope, $stateParams, Service, $window, $state, $rootScope, $http, toaster, $modal) {
    $scope.myValue = true;
    $scope.coinvalue = 0;
    var sessionData = JSON.parse(sessionStorage.getItem("names"));

    if (sessionData == null) {
        //toaster.error("session expired");
        $state.go('login');
        return;
    }

    var sessionid = sessionData.loginInfo.sessionId;
    $scope.walletaddress = sessionData.loginInfo.walletAddress;
    $scope.sessionuser = sessionData.loginInfo.firstName + sessionData.loginInfo.lastName;



    $scope.getuserdashboarddetails = function () {
        var data = {
            "sessionId": sessionid
        }
        $scope.myValue = false;

        Service.getuserdashboarddetails(data).then(function (response) {

            if (response.data != null) {
                $scope.message = response.data;
                if (response.data.status == "Success") {
                    $scope.myValue = true;

                    $scope.etherBalance = response.data.etherBalance;
                    $scope.tokenBalance = response.data.tokenBalance;
                    $scope.referral = response.data.referralPoints;
                    $scope.ethOnUsd = response.data.ethOnUsd;
                    $scope.tokenRate = response.data.tokenRate;

                }
                else {
                    if (response.data.message = "Session Expired") {
                        $scope.myValue = true;

                        $state.go('login');
                    }
                    toaster.error( response.data.message);
                }

            }
            else {
                $scope.myValue = true;

               // toaster.error("Session Expired");
                $state.go('login');
            }
        }, function (error) {
            $scope.myValue = true;
            toaster.error(response.data.message);
        });

    }

    $scope.getuserdashboarddetails();

    $scope.gettransactionhistory = function () {
        var data = {
            "sessionId": sessionid
        }
        $scope.usertranscationhistory = [];
        var senttranscation = [];
        var receivetranscation = [];
        var overalltranscation = [];
        var userdashboardtransaction = [];
        Service.gettransactionhistory(data).then(function (response) {

            if (response.data != null) {
                $scope.message = response.data;
                if (response.data.status == "Success") {
                    $scope.transcation = response.data.transactionHistory;
                    overalltranscation = response.data.transactionHistory;
                }
                else {
                    if (response.data.message == "Session Expired") {
                        $state.go('login');
                    }
                    //toaster.error(response.data.message);
                }
                for (var i = 0; i < overalltranscation.length; i++) {
                    if (overalltranscation[i].fromAddress == $scope.walletaddress) {
                        senttranscation.push(overalltranscation[i]);
                        $scope.senttransactions = senttranscation;
                    }
                    if (overalltranscation[i].toAddress == $scope.walletaddress) {
                        receivetranscation.push(overalltranscation[i]);
                        $scope.receivetransactions = receivetranscation;

                    }
                }
                for (var i = 0; i <= 2; i++) {
                    if (receivetranscation.length > 0) {
                        if (receivetranscation[i]) {
                            userdashboardtransaction.push(receivetranscation[i]);
                            $scope.usertranscationhistory = userdashboardtransaction;

                        }
                    }

                }

            }
            else {
                toaster.error("Session Expired");
            }
        }, function (error) {
            toaster.error(response.data.message);
        });

    }

    $scope.gettransactionhistory();

    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: 'root/views/user/ResetPassword.html',
            controller: 'popupctrlr'

        });

        modalInstance.result.then(function (secureKey) {
            if (secureKey) {
                var Oldpassword = secureKey.password;
                var NewPassword = secureKey.oldpassword;
                var data = {
                    "sessionId": sessionid,
                    "newPassword": NewPassword,
                    "oldPassword": Oldpassword,
                    "confirmPassword": secureKey.confirmpassword
                }


                $scope.myValue = false;
                Service.resetpassword(data).then(function (response) {
                    $scope.message = response.data;
                    if (response.data.message == "Password Updated Successfully") {
                        $scope.myValue = true;
                        toaster.success(response.data.message);
                        $state.go('login');

                    }
                    else {
                        $scope.myValue = true;
                        toaster.error(response.data.message);
                    }


                }, function (error) {
                    toaster.error(response.data.message);
                });
            }


        });

    }

    $scope.logout = function () {
        localStorage.setItem("status","");
        var modalInstance = $modal.open({
            templateUrl: 'root/views/user/logout.html',
            controller: 'logoutctrlr'

        });

        modalInstance.result.then(function (secureKey) {
            if (secureKey) {
                if (secureKey == "Ok") {
                    $state.go('login');
                }
            }

        });

    }
    $scope.logoutShape = function () {
        localStorage.setItem("status","redirect");
        var modalInstance = $modal.open({
            templateUrl: 'root/views/user/logout.html',
            controller: 'logoutctrlr',
           
        });
    }
	$scope.countedvalue = 0;
	$scope.coinCount = function(val){
		//console.log("val",val,val*1);
		$scope.countedvalue = val * $scope.tokenRate;
		
	}
    $scope.purchase = function () {

        if ($scope.coinvalue == undefined || $scope.coinvalue == "" || $scope.walletpassword == undefined || $scope.walletpassword == "") {

            toaster.error("Please fill the fields Correctly");
            return;
        }
        if ($scope.coinvalue == 0) {
            toaster.error("Please enter valid Token");
            return;
        }
        else {
            var ethamount =  $scope.tokenRate * $scope.coinvalue;
            var data = {
                "requestToken": $scope.coinvalue,
                "etherTransferAmount":ethamount,
                "sessionId": sessionid,
                "walletPassword": $scope.walletpassword,

            }

            $scope.myValue = false;
            Service.coinpurchase(data).then(function (response) {

                $scope.message = response.data;
                if (response.data.status == "Success") {
                    $scope.myValue = true;
                    toaster.success(response.data.message);
                    $scope.coinvalue = "";
                    $scope.walletpassword = "";
                        $window.location.reload();
                       
                    
                }
                else {

                    console.log("enter else", response.data);
                    $scope.myValue = true;
                    toaster.error(response.data.message);
                    if (response.data.message == "Session Expired") {
                        $state.go('login');
                    }
                    $scope.coinvalue = "";
                    $scope.walletpassword = "";
                }

            }, function (error) {
                $scope.myValue = true;
                toaster.error(response.data.message);
            });
        }
    }

    $scope.validateEmail = function () {
        $scope.value = "true";

    };


})
app.controller('popupctrlr', function ($scope, $rootScope, $state, $modalInstance, toaster) {
    $scope.change = function (password, valid) {

        var data = {
            password: password.OPassword,
            oldpassword: password.Npassword,
            confirmpassword: password.Cpassword
        }

        if (data.oldpassword == data.confirmpassword) {

            if (data.password == data.oldpassword) {
                toaster.error("Old and New Password should not be same");
                return;

            }
            else {

                $modalInstance.close(data);
            }

        }
        else {
            toaster.error("New and Confirm Password should  be same");
        }


    }
    $scope.close = function () {
        $modalInstance.close();
    }




})