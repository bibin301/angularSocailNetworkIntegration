var app = angular.module('routerApp.referralcontroller', ['toaster']);
app.controller('referralctrl', function ($scope, $stateParams, Service,$window, $state, $rootScope, $http, toaster) {
    $scope.myValue = true;
    var sessionData = JSON.parse(sessionStorage.getItem("names"));

    if (sessionData == null) {
        //toaster.error("session expired");
        $state.go('login');
        return;
    }

    var sessionid = sessionData.loginInfo.sessionId;
    $scope.walletaddress = sessionData.loginInfo.walletAddress;
    $scope.sessionuser = sessionData.loginInfo.firstName + sessionData.loginInfo.lastName;
  
    
    $scope.userReferralScheme = function (emailId) {
		
        if (emailId == undefined || emailId == "") {
            //toaster.pop("please fill the field");
        }
        else {
           
            var referralData = {
                "emailId": emailId,
                "sessionId": sessionData.loginInfo.sessionId
            }
           
            $scope.myValue = false;
            Service.referral(referralData).then(function (response) {
                $scope.myValue = true;
                $scope.message = response.data;
                if (response.status == 200) {
                    $scope.myValue = true;
                    $scope.message = response.data;
                    toaster.success(response.data.message);
                    $state.go('userdashboard');
                }
                if (response.status == 206) {
                   $scope.myValue = true;
                    if (response.data.message == "Please Enter Correct Details") {
                        toaster.error(response.data.message);
                    }

                    else {
                        $scope.myValue = true;
                        $scope.message = response.data;
                        toaster.error(response.data.message);
                    }
                }



            }, function (error) {
                if (error.status == 409) {
                    $scope.myValue = true;
                    $scope.message = error.data.message;
                    toaster.error(error.data.message);


                }
                else {
                    $scope.myValue = true;
                    $scope.message = error.data.message;
                    toaster.error(error.data.message);

                }
            });
        }

    }


})


